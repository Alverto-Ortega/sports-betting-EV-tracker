
import React, { useState, useMemo } from 'react';
import type { Bet, CalculatedBet } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { addCalculationsToBet } from './utils/calculations';
import Header from './components/Header';
import Footer from './components/Footer';
import BetForm from './components/BetForm';
import BetTable from './components/BetTable';
import AnalysisDashboard from './components/AnalysisDashboard';
import MilestoneTracker from './components/MilestoneTracker';
import BankrollCard from './components/BankrollCard';

type View = 'tracker' | 'analysis';

const App: React.FC = () => {
  const [bets, setBets] = useLocalStorage<Bet[]>('ev_bets', []);
  const [startingBankroll, setStartingBankroll] = useLocalStorage<number>('starting_bankroll', 1000);
  const [view, setView] = useState<View>('tracker');

  const calculatedBets = useMemo<CalculatedBet[]>(() => {
    return bets
      .map(addCalculationsToBet)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bets]);

  const totalSettledProfit = useMemo(() => {
    return calculatedBets.reduce((acc, bet) => acc + (bet.result !== 'pending' ? bet.profit : 0), 0);
  }, [calculatedBets]);

  const addBet = (bet: Omit<Bet, 'id'>) => {
    const newBet: Bet = { ...bet, id: crypto.randomUUID() };
    setBets(prevBets => [...prevBets, newBet]);
  };

  const deleteBet = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bet?')) {
      setBets(prevBets => prevBets.filter(bet => bet.id !== id));
    }
  };

  const updateBet = (updatedBet: Bet) => {
    setBets(prevBets => prevBets.map(bet => (bet.id === updatedBet.id ? updatedBet : bet)));
  };

  const importBets = (importedBets: Bet[]) => {
    if (window.confirm('This will overwrite your current bet history with the imported data. This action cannot be undone. Are you sure?')) {
        setBets(importedBets);
        alert('Data restored successfully!');
    }
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header totalBets={bets.length} />
        <nav className="my-8 flex justify-center border-b border-slate-700">
          <button
            onClick={() => setView('tracker')}
            className={`px-6 py-3 text-lg font-bold transition-colors duration-300 ${
              view === 'tracker'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Tracker
          </button>
          <button
            onClick={() => setView('analysis')}
            className={`px-6 py-3 text-lg font-bold transition-colors duration-300 ${
              view === 'analysis'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Analysis
          </button>
        </nav>

        <main className="view-transition min-h-[60vh]">
          {view === 'tracker' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <BankrollCard 
                  startingBankroll={startingBankroll} 
                  totalProfit={totalSettledProfit} 
                  onUpdateBankroll={setStartingBankroll} 
                />
                <MilestoneTracker totalBets={bets.length} />
                <BetForm onAddBet={addBet} />
              </div>
              <div className="lg:col-span-2">
                <BetTable 
                    bets={calculatedBets} 
                    onDeleteBet={deleteBet} 
                    onUpdateBet={updateBet} 
                    onImportBets={importBets}
                />
              </div>
            </div>
          )}

          {view === 'analysis' && (
            <AnalysisDashboard 
              bets={calculatedBets} 
              startingBankroll={startingBankroll} 
              onUpdateBankroll={setStartingBankroll}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
