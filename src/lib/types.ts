
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes_for: number;  // Changed from votesFor to match DB schema
  votes_against: number;  // Changed from votesAgainst to match DB schema
  deadline: string;  // Changed from Date to string as that's how it comes from DB
  status: 'active' | 'completed';
  created_at?: string;  // Changed from Date to string
  updated_at?: string;  // Changed from Date to string
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
