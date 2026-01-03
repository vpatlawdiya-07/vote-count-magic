import { useState, useEffect } from 'react';
import { votingService } from '@/lib/votingService';
import { VoteResult } from '@/types/voting';
import { BarChart3, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResultsSectionProps {
  refreshTrigger?: number;
}

export const ResultsSection = ({ refreshTrigger }: ResultsSectionProps) => {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchResults = () => {
    setIsAnimating(true);
    const newResults = votingService.getResults();
    const newTotal = votingService.getTotalVotes();
    
    setResults(newResults);
    setTotalVotes(newTotal);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    fetchResults();
  }, [refreshTrigger]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const winner = results[0];

  return (
    <section id="results" className="py-20 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Live Results</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Current Vote Tally
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Watch the results update in real-time as votes are securely counted and verified.
          </p>

          <Button variant="ghost" size="sm" onClick={fetchResults} className="gap-2">
            <RefreshCw className={cn("w-4 h-4", isAnimating && "animate-spin")} />
            Refresh Results
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{formatNumber(totalVotes)}</p>
            <p className="text-sm text-muted-foreground">Total Votes Cast</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-md border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{results.length}</p>
            <p className="text-sm text-muted-foreground">Candidates</p>
          </div>

          {winner && (
            <div className="col-span-2 md:col-span-1 bg-card rounded-2xl p-6 shadow-md border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm"
                  style={{ backgroundColor: winner.color }}
                >
                  {winner.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <p className="text-lg font-display font-bold truncate">{winner.candidateName}</p>
              <p className="text-sm text-muted-foreground">Current Leader</p>
            </div>
          )}
        </div>

        {/* Results bars */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <div 
              key={result.candidateId}
              className={cn(
                "bg-card rounded-2xl p-6 shadow-md border transition-all duration-500",
                index === 0 ? "border-primary/30 shadow-glow" : "border-border/50"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-display font-bold"
                    style={{ backgroundColor: result.color }}
                  >
                    {result.candidateName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{result.candidateName}</h3>
                    <p className="text-sm" style={{ color: result.color }}>{result.party}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-display font-bold">{formatNumber(result.votes)}</p>
                  <p className="text-sm text-muted-foreground">{result.percentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${result.percentage}%`,
                    backgroundColor: result.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Transparency note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All votes are encrypted, anonymized, and recorded with blockchain-style verification.
            <br />
            Results are updated in real-time as votes are processed.
          </p>
        </div>
      </div>
    </section>
  );
};
