
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import VotingStats from "@/components/VotingStats";
import ProposalCard from "@/components/ProposalCard";
import TransactionList from "@/components/TransactionList";
import type { Proposal, Transaction, VotingStats as VotingStatsType } from "@/lib/types";

const Index = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<VotingStatsType>({
    totalVotes: 12500,
    activeProposals: 3,
    participationRate: 78.5,
    completedProposals: 15,
  });

  const [proposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Community Treasury Allocation",
      description: "Proposal to allocate 5% of treasury funds to community development initiatives.",
      votesFor: 8250,
      votesAgainst: 1750,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: "active",
    },
    {
      id: "2",
      title: "Protocol Upgrade Implementation",
      description: "Implementing new security features and performance improvements.",
      votesFor: 9500,
      votesAgainst: 500,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "active",
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "tx1",
      type: "vote",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      address: "0x1234...5678",
      status: "completed",
      details: "Voted for Proposal #1",
    },
    {
      id: "tx2",
      type: "create_proposal",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      address: "0x8765...4321",
      status: "completed",
      details: "Created new proposal",
    },
  ]);

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    toast({
      title: "Vote Cast Successfully",
      description: `Your vote has been recorded for proposal #${proposalId}`,
    });
    
    setStats(prev => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      participationRate: Math.min(100, prev.participationRate + 0.1),
    }));
  };

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
          <VotingStats stats={stats} />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Active Proposals</h2>
          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
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
