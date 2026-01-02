
import React from 'react';
import Card from './ui/Card';
import Input from './ui/Input';

interface BankrollCardProps {
  startingBankroll: number;
  totalProfit: number;
  onUpdateBankroll: (val: number) => void;
}

const BankrollCard: React.FC<BankrollCardProps> = ({ startingBankroll, totalProfit, onUpdateBankroll }) => {
  const currentBankroll = startingBankroll + totalProfit;
  const growthPercentage = startingBankroll > 0 ? (totalProfit / startingBankroll) * 100 : 0;

  return (
    <Card className="mb-6 border-cyan-500/30 bg-slate-800/80">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Your Betting Plan
      </h3>

      <div className="space-y-4">
        <Input 
          label="Beginning Bankroll ($)" 
          type="number" 
          value={startingBankroll} 
          onChange={(e) => onUpdateBankroll(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="bg-slate-900/50 border-slate-700 text-lg font-bold text-cyan-400"
        />

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Current Balance</span>
            <span className={`text-xl font-black ${currentBankroll >= startingBankroll ? 'text-emerald-400' : 'text-red-400'}`}>
              ${currentBankroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Total ROI</span>
            <span className={`text-xl font-black ${growthPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BankrollCard;
