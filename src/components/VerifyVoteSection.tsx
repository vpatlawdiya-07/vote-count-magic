import { useState } from 'react';
import { votingService, sampleCandidates } from '@/lib/votingService';
import { Vote } from '@/types/voting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, CheckCircle2, XCircle, Shield, Clock, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export const VerifyVoteSection = () => {
  const [voteId, setVoteId] = useState('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; vote?: Vote; candidateName?: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voteId.trim()) return;

    setIsSearching(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const vote = votingService.verifyVote(voteId.trim());
    
    if (vote) {
      const candidate = sampleCandidates.find(c => c.id === vote.candidateId);
      setSearchResult({ 
        found: true, 
        vote,
        candidateName: candidate?.name || 'Unknown Candidate'
      });
    } else {
      setSearchResult({ found: false });
    }

    setIsSearching(false);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <section className="py-20 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Vote Verification</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Verify Your Vote
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter your vote verification ID to confirm your vote was recorded correctly and counted in the final tally.
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-xl p-8 border border-border/50">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voteId" className="text-sm font-medium">Vote Verification ID</Label>
              <div className="flex gap-3">
                <Input
                  id="voteId"
                  type="text"
                  placeholder="vote-1234567890-abc123..."
                  value={voteId}
                  onChange={(e) => setVoteId(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button type="submit" variant="vote" disabled={isSearching || !voteId.trim()}>
                  {isSearching ? 'Searching...' : 'Verify'}
                </Button>
              </div>
            </div>
          </form>

          {searchResult && (
            <div className={cn(
              "mt-8 p-6 rounded-xl border-2 transition-all duration-300",
              searchResult.found 
                ? "bg-success/5 border-success/20" 
                : "bg-destructive/5 border-destructive/20"
            )}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                  searchResult.found ? "bg-success/20" : "bg-destructive/20"
                )}>
                  {searchResult.found ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {searchResult.found && searchResult.vote ? (
                    <>
                      <h3 className="font-display text-xl font-semibold text-success mb-4">
                        Vote Verified Successfully
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Vote ID:</span>
                          <code className="font-mono text-xs bg-background px-2 py-1 rounded truncate">
                            {searchResult.vote.id}
                          </code>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Timestamp:</span>
                          <span>{formatDate(searchResult.vote.timestamp)}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Signature:</span>
                          <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                            {searchResult.vote.signature}
                          </code>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-success/20">
                        <p className="text-sm text-muted-foreground">
                          Your vote for <strong>{searchResult.candidateName}</strong> has been securely recorded and will be included in the final count.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-display text-xl font-semibold text-destructive mb-2">
                        Vote Not Found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We couldn't find a vote with this verification ID. Please double-check the ID and try again. If you believe this is an error, please contact the election administrator.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
