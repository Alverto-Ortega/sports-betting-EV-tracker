
import React from 'react';
import Card from './ui/Card';

interface MilestoneTrackerProps {
  totalBets: number;
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ totalBets }) => {
  const milestoneInterval = 100;
  const currentMilestone = Math.floor(totalBets / milestoneInterval) * milestoneInterval;
  const nextMilestone = currentMilestone + milestoneInterval;
  const progress = totalBets % milestoneInterval;
  const isAtMilestone = totalBets > 0 && totalBets % milestoneInterval === 0;

  return (
    <Card className={`mb-6 transition-all duration-500 ${isAtMilestone ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-900/10' : ''}`}>
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bet Volume</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalBets}</span>
            <span className="text-slate-500 text-sm font-medium">total wagers</span>
          </div>
        </div>
        <div className="text-right">
          {isAtMilestone ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-900 animate-bounce">
              🎉 {totalBets} BETS REACHED!
            </span>
          ) : (
            <span className="text-xs font-bold text-cyan-400">
              {milestoneInterval - progress} more to {nextMilestone}
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${isAtMilestone ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
          style={{ width: `${isAtMilestone ? 100 : progress}%` }}
        />
        {/* Milestone Markers */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[25, 50, 75].map(tick => (
            <div key={tick} className="h-full w-px bg-slate-900/30" />
          ))}
        </div>
      </div>
      
      <p className="mt-3 text-[11px] text-slate-500 leading-tight">
        {isAtMilestone 
          ? `Incredible consistency! You've officially logged ${totalBets} bets. Keep grinding that edge.`
          : `You are ${Math.round((progress/milestoneInterval)*100)}% of the way to your next major volume milestone of ${nextMilestone} bets.`}
      </p>
    </Card>
  );
};

export default MilestoneTracker;
