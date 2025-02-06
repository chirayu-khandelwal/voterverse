
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import VotingStats from "@/components/VotingStats";
import ProposalCard from "@/components/ProposalCard";
import TransactionList from "@/components/TransactionList";
import type { Proposal, Transaction, VotingStats as VotingStatsType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch proposals using React Query
  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }
      return data as Proposal[];
    }
  });

  // Calculate stats based on proposals
  const calculateStats = (proposals: Proposal[]): VotingStatsType => {
    const activeProposals = proposals.filter(p => p.status === 'active').length;
    const completedProposals = proposals.filter(p => p.status === 'completed').length;
    const totalVotes = proposals.reduce((sum, p) => sum + p.votes_for + p.votes_against, 0);
    const participationRate = proposals.length > 0 
      ? (totalVotes / (proposals.length * 100)) * 100 
      : 0;

    return {
      totalVotes,
      activeProposals,
      participationRate,
      completedProposals
    };
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('proposals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        (payload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['proposals'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleVote = async (proposalId: string, vote: "for" | "against") => {
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      const updates = {
        ...(vote === "for" 
          ? { votes_for: proposal.votes_for + 1 }
          : { votes_against: proposal.votes_against + 1 }
        ),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', proposalId);

      if (error) throw error;

      toast({
        title: "Vote Cast Successfully",
        description: `Your vote has been recorded for proposal #${proposalId}`,
      });

      // Add transaction
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: "vote",
        timestamp: new Date(),
        address: "anonymous", // This would be replaced with actual user address when auth is implemented
        status: "completed",
        details: `Voted ${vote} Proposal #${proposalId}`,
      };
      setTransactions(prev => [newTransaction, ...prev]);

    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error Casting Vote",
        description: "There was an error recording your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-primary/10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-8 space-y-8"
      >
        <header className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Decentralized Voting Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Secure, transparent, and tamper-proof voting system
          </motion.p>
        </header>

        <section>
          <VotingStats stats={calculateStats(proposals)} />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Active Proposals</h2>
          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={{
                  ...proposal,
                  votesFor: proposal.votes_for,
                  votesAgainst: proposal.votes_against,
                  deadline: new Date(proposal.deadline)
                }}
                onVote={handleVote}
              />
            ))}
          </div>
        </section>

        <section>
          <TransactionList transactions={transactions} />
        </section>
      </motion.div>
    </div>
  );
};

export default Index;
