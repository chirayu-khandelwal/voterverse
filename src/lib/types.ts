
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: Date;
  status: 'active' | 'completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface Transaction {
  id: string;
  type: 'vote' | 'create_proposal';
  timestamp: Date;
  address: string;
  status: 'pending' | 'completed' | 'failed';
  details: string;
}

export interface VotingStats {
  totalVotes: number;
  activeProposals: number;
  participationRate: number;
  completedProposals: number;
}
