
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Proposal } from "@/lib/types";
import VoteButton from "./VoteButton";

interface ProposalCardProps {
  proposal: {
    id: string;
    title: string;
    description: string;
    votesFor: number;
    votesAgainst: number;
    deadline: Date;
    status: 'active' | 'completed';
    created_at?: string;
    updated_at?: string;
  };
  onVote: (proposalId: string, vote: "for" | "against") => void;
}

const ProposalCard = ({ proposal, onVote }: ProposalCardProps) => {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const timeLeft = proposal.deadline.getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="backdrop-blur-sm bg-white/50 rounded-lg border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full mb-2">
              {proposal.status === "active" ? "Active" : "Completed"}
            </span>
            <h3 className="text-xl font-semibold mb-2">{proposal.title}</h3>
            <p className="text-gray-600 mb-4">{proposal.description}</p>
          </div>
          {proposal.status === "active" && (
            <span className="text-sm text-gray-500">
              {daysLeft} days left
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{forPercentage.toFixed(1)}% in favor</span>
            </div>
            <Progress value={forPercentage} className="h-2" />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>{proposal.votesFor.toLocaleString()} votes for</span>
            <span>{proposal.votesAgainst.toLocaleString()} votes against</span>
          </div>

          {proposal.status === "active" && (
            <div className="flex gap-4 mt-4">
              <VoteButton
                onClick={() => onVote(proposal.id, "for")}
                variant="for"
              />
              <VoteButton
                onClick={() => onVote(proposal.id, "against")}
                variant="against"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalCard;
