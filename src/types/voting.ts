// Base Vote interface following OOP principles from the requirements
export interface Vote {
  id: string;
  candidateId: string;
  timestamp: Date;
  encryptedVoterId: string;
  signature: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  photo?: string;
  color: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  type: 'presidential' | 'local' | 'referendum';
  startDate: Date;
  endDate: Date;
  candidates: Candidate[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface VoteResult {
  candidateId: string;
  candidateName: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface Voter {
  id: string;
  email: string;
  name: string;
  hasVoted: boolean;
  verificationCode?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  voter: Voter | null;
  isLoading: boolean;
}
