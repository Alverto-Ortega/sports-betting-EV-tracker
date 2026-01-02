
import React from 'react';

const ChartIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16 6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4zm-6 4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h4zm10-8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2z"/>
    </svg>
);

interface HeaderProps {
  totalBets?: number;
}

const Header: React.FC<HeaderProps> = ({ totalBets = 0 }) => {
  return (
    <header className="text-center mb-6">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-4">
          <ChartIcon className="w-10 h-10 sm:w-12 h-12 text-cyan-400" />
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            +EV Bet Tracker
          </h1>
        </div>
        
        {totalBets > 0 && (
          <div className="inline-flex items-center bg-slate-800 border border-slate-700 rounded-full px-3 py-1 mt-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Volume:</span>
             <span className="text-sm font-black text-cyan-400">{totalBets}</span>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
        Track your edge. Analyze your strategy. Maximize your profits.
      </p>
    </header>
  );
};

export default Header;
