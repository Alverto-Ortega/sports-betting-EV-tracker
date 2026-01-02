
import React, { useState, useMemo, useEffect } from 'react';
import type { Bet } from '../types';
import { calculateImpliedProbability } from '../utils/calculations';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface BetFormProps {
  onAddBet: (bet: Omit<Bet, 'id'>) => void;
}

const initialState = {
  date: new Date().toISOString().split('T')[0],
  event: '',
  league: '',
  betType: '',
  betDetails: [],
  odds: -110,
  stake: 10,
  yourProbability: 55,
  notes: '',
  result: 'pending' as const,
};

const BetForm: React.FC<BetFormProps> = ({ onAddBet }) => {
  const [bet, setBet] = useState(initialState);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLeg, setCurrentLeg] = useState('');

  const impliedProbability = useMemo(() => calculateImpliedProbability(bet.odds), [bet.odds]);
  const edge = useMemo(() => bet.yourProbability - impliedProbability, [bet.yourProbability, impliedProbability]);
  const isParlay = useMemo(() => bet.betType.toLowerCase().includes('parlay'), [bet.betType]);

  // Real-time validation logic
  useEffect(() => {
    if (Math.abs(bet.odds) < 100 && bet.odds !== 0) {
      setFormError("American odds must be ≥ 100 or ≤ -100.");
    } else if (bet.stake <= 0) {
      setFormError("Stake must be greater than 0.");
    } else if (bet.yourProbability <= 0 || bet.yourProbability >= 100) {
      setFormError("Probability must be between 0.1% and 99.9%.");
    } else {
      setFormError(null);
    }
  }, [bet.odds, bet.stake, bet.yourProbability]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setBet(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleAddLeg = () => {
    if (currentLeg.trim()) {
        setBet(prev => ({
            ...prev,
            betDetails: [...(prev.betDetails || []), { description: currentLeg.trim() }]
        }));
        setCurrentLeg('');
    }
  };

  const handleRemoveLeg = (index: number) => {
    setBet(prev => ({
        ...prev,
        betDetails: prev.betDetails?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formError) return;
    
    if (!bet.event.trim() || !bet.league.trim()) {
        setFormError("Event and League are required.");
        return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
        onAddBet(bet);
        setBet({...initialState, date: new Date().toISOString().split('T')[0]});
        setCurrentLeg('');
        setIsSubmitting(false);
    }, 200);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        Log New Bet
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Date" type="date" name="date" value={bet.date} onChange={handleChange} required disabled={isSubmitting} />
        <Input label="Event" placeholder="e.g. Lakers vs Celtics" type="text" name="event" value={bet.event} onChange={handleChange} required disabled={isSubmitting} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="League" placeholder="NBA" type="text" name="league" value={bet.league} onChange={handleChange} required disabled={isSubmitting} />
          <Input label="Type" placeholder="Spread" type="text" name="betType" value={bet.betType} onChange={handleChange} required disabled={isSubmitting} />
        </div>
        
        {isParlay && (
            <div className="space-y-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <label className="block text-xs font-bold text-slate-400 uppercase">Parlay Legs</label>
                <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Leg description..."
                      value={currentLeg} 
                      onChange={(e) => setCurrentLeg(e.target.value)} 
                      onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddLeg(); }}}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                    />
                    <button type="button" onClick={handleAddLeg} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs font-bold transition-colors">Add</button>
                </div>
                {bet.betDetails && bet.betDetails.length > 0 && (
                    <ul className="space-y-1">
                        {bet.betDetails.map((leg, index) => (
                            <li key={index} className="flex items-center justify-between bg-slate-700/60 p-2 rounded text-xs">
                                <span>{leg.description}</span>
                                <button type="button" onClick={() => handleRemoveLeg(index)} className="text-red-400">×</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="American Odds" type="number" name="odds" value={bet.odds} onChange={handleChange} required disabled={isSubmitting} />
          <Input label="Stake ($)" type="number" name="stake" value={bet.stake} onChange={handleChange} step="0.01" min="0.01" required disabled={isSubmitting} />
        </div>
        
        <Input 
          label="Your Estimated Win Prob (%)" 
          type="number" 
          name="yourProbability" 
          value={bet.yourProbability} 
          onChange={handleChange} 
          step="0.1" 
          min="0.1" 
          max="99.9" 
          required 
          disabled={isSubmitting} 
        />

        <div className={`p-4 rounded-md space-y-2 border transition-colors ${edge > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Market Implied:</span>
            <span>{impliedProbability.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Your Edge:</span>
            <span className={`text-xl font-black ${edge > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {edge > 0 ? '+' : ''}{edge.toFixed(2)}%
            </span>
          </div>
        </div>

        {formError && (
          <div className="bg-red-500/20 border border-red-500/50 p-2 rounded text-xs text-red-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {formError}
          </div>
        )}
        
        <Button type="submit" disabled={isSubmitting || !!formError}>
            {isSubmitting ? 'Saving...' : 'Add to Tracker'}
        </Button>
      </form>
    </Card>
  );
};

export default BetForm;
