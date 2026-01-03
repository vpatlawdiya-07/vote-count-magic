import { Vote, Candidate, Election, VoteResult, Voter } from '@/types/voting';

// Simulated secure hash function for voter ID encryption
const hashVoterId = (voterId: string): string => {
  let hash = 0;
  for (let i = 0; i < voterId.length; i++) {
    const char = voterId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
};

// Generate a unique digital signature for vote verification
const generateSignature = (): string => {
  return `SIG-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Sample candidates for the demo election
export const sampleCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Eleanor Mitchell',
    party: 'Progress Party',
    position: 'President',
    color: '#2563eb',
  },
  {
    id: 'c2',
    name: 'Marcus Chen',
    party: 'Unity Coalition',
    position: 'President',
    color: '#059669',
  },
  {
    id: 'c3',
    name: 'Sarah Rodriguez',
    party: 'Citizens Alliance',
    position: 'President',
    color: '#dc2626',
  },
  {
    id: 'c4',
    name: 'James Thompson',
    party: 'Independent',
    position: 'President',
    color: '#7c3aed',
  },
];

export const sampleElection: Election = {
  id: 'election-2024',
  title: '2024 Presidential Election',
  description: 'Cast your vote for the next President of the Democratic Republic',
  type: 'presidential',
  startDate: new Date('2024-11-01'),
  endDate: new Date('2024-11-15'),
  candidates: sampleCandidates,
  status: 'active',
};

// In-memory storage for votes (in production, this would be a secure database)
class VotingService {
  private votes: Map<string, Vote> = new Map();
  private voters: Map<string, Voter> = new Map();
  private voteCounts: Map<string, number> = new Map();

  constructor() {
    // Initialize vote counts for each candidate
    sampleCandidates.forEach(candidate => {
      this.voteCounts.set(candidate.id, 0);
    });

    // Add some initial votes for demo purposes
    this.seedInitialVotes();
  }

  private seedInitialVotes() {
    const initialVotes = [
      { candidateId: 'c1', count: 4523 },
      { candidateId: 'c2', count: 3891 },
      { candidateId: 'c3', count: 2156 },
      { candidateId: 'c4', count: 1687 },
    ];

    initialVotes.forEach(({ candidateId, count }) => {
      this.voteCounts.set(candidateId, count);
    });
  }

  // Register a new voter
  registerVoter(email: string, name: string): Voter {
    const voter: Voter = {
      id: `voter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      hasVoted: false,
      verificationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    this.voters.set(voter.id, voter);
    return voter;
  }

  // Authenticate a voter
  authenticateVoter(email: string): Voter | null {
    for (const voter of this.voters.values()) {
      if (voter.email === email) {
        return voter;
      }
    }
    // For demo purposes, create a new voter if not found
    return this.registerVoter(email, email.split('@')[0]);
  }

  // Cast a vote
  castVote(voterId: string, candidateId: string): { success: boolean; vote?: Vote; error?: string } {
    const voter = this.voters.get(voterId);
    
    if (!voter) {
      return { success: false, error: 'Voter not found. Please register first.' };
    }

    if (voter.hasVoted) {
      return { success: false, error: 'You have already cast your vote in this election.' };
    }

    const candidate = sampleCandidates.find(c => c.id === candidateId);
    if (!candidate) {
      return { success: false, error: 'Invalid candidate selection.' };
    }

    // Create the vote object
    const vote: Vote = {
      id: `vote-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      candidateId,
      timestamp: new Date(),
      encryptedVoterId: hashVoterId(voterId),
      signature: generateSignature(),
    };

    // Record the vote
    this.votes.set(vote.id, vote);
    
    // Update vote count
    const currentCount = this.voteCounts.get(candidateId) || 0;
    this.voteCounts.set(candidateId, currentCount + 1);

    // Mark voter as having voted
    voter.hasVoted = true;
    this.voters.set(voterId, voter);

    return { success: true, vote };
  }

  // Get current results
  getResults(): VoteResult[] {
    const totalVotes = Array.from(this.voteCounts.values()).reduce((a, b) => a + b, 0);

    return sampleCandidates.map(candidate => {
      const votes = this.voteCounts.get(candidate.id) || 0;
      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        party: candidate.party,
        votes,
        percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
        color: candidate.color,
      };
    }).sort((a, b) => b.votes - a.votes);
  }

  // Verify a vote
  verifyVote(voteId: string): Vote | null {
    return this.votes.get(voteId) || null;
  }

  // Get total vote count
  getTotalVotes(): number {
    return Array.from(this.voteCounts.values()).reduce((a, b) => a + b, 0);
  }

  // Get voter status
  getVoterStatus(voterId: string): Voter | null {
    return this.voters.get(voterId) || null;
  }
}

// Export a singleton instance
export const votingService = new VotingService();
