
import React, { useMemo, useState } from 'react';
import type { CalculatedBet } from '../types';
import Card from './ui/Card';
import Input from './ui/Input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';


interface AnalysisDashboardProps {
  bets: CalculatedBet[];
  startingBankroll: number;
  onUpdateBankroll: (val: number) => void;
}

const EmptyState: React.FC<{message: string}> = ({ message }) => (
    <div className="text-center h-full flex items-center justify-center p-8 text-slate-500">
        <div>
            <p className="font-semibold">Not enough data yet.</p>
            <p className="text-sm">{message}</p>
        </div>
    </div>
);

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ bets, startingBankroll, onUpdateBankroll }) => {
  const [daysFilter, setDaysFilter] = useState<number>(30);

  const filteredBets = useMemo(() => {
    if (bets.length === 0) return [];
    const now = new Date();
    const cutoff = new Date(new Date().setDate(now.getDate() - daysFilter));
    return bets.filter(bet => new Date(bet.date) >= cutoff && bet.result !== 'pending');
  }, [bets, daysFilter]);

  // Lifetime metrics for bankroll
  const lifetimeProfit = useMemo(() => bets.reduce((acc, bet) => acc + (bet.result !== 'pending' ? bet.profit : 0), 0), [bets]);
  const currentBankroll = startingBankroll + lifetimeProfit;
  const growthPercentage = startingBankroll > 0 ? (lifetimeProfit / startingBankroll) * 100 : 0;

  // Filtered metrics
  const periodProfit = useMemo(() => filteredBets.reduce((acc, bet) => acc + bet.profit, 0), [filteredBets]);
  const totalStaked = useMemo(() => filteredBets.reduce((acc, bet) => acc + bet.stake, 0), [filteredBets]);
  const roi = totalStaked > 0 ? (periodProfit / totalStaked) * 100 : 0;
  const winRate = filteredBets.length > 0 ? (filteredBets.filter(b => b.result === 'win').length / filteredBets.length) * 100 : 0;

  const profitByBetType = useMemo(() => {
    const data: { [key: string]: { profit: number, count: number, staked: number } } = {};
    filteredBets.forEach(bet => {
      if (!data[bet.betType]) {
        data[bet.betType] = { profit: 0, count: 0, staked: 0 };
      }
      data[bet.betType].profit += bet.profit;
      data[bet.betType].count++;
      data[bet.betType].staked += bet.stake;
    });
    return Object.entries(data).map(([name, values]) => ({ name, ...values })).sort((a,b) => b.profit - a.profit);
  }, [filteredBets]);
  
  const profitByLeague = useMemo(() => {
    const data: { [key: string]: { profit: number, count: number } } = {};
    filteredBets.forEach(bet => {
      if (!data[bet.league]) {
        data[bet.league] = { profit: 0, count: 0 };
      }
      data[bet.league].profit += bet.profit;
      data[bet.league].count++;
    });
    return Object.entries(data).map(([name, values]) => ({ name, ...values })).sort((a,b) => b.profit - a.profit);
  }, [filteredBets]);

  const cumulativeProfitData = useMemo(() => {
      const sortedBets = [...filteredBets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let cumulativeProfit = 0;
      return sortedBets.map((bet, index) => {
          cumulativeProfit += bet.profit;
          return {
              name: `Bet ${index + 1}`,
              date: new Date(bet.date).toLocaleDateString(undefined, { timeZone: 'UTC'}),
              profit: cumulativeProfit,
          }
      })
  }, [filteredBets]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-slate-700 border border-slate-600 rounded-md text-sm">
          <p className="label">{`Date: ${payload[0].payload.date}`}</p>
          <p className="intro text-cyan-300">{`Cumulative Profit: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const yAxisTickFormatter = (value: string) => {
      if (value.length > 15) {
          return `${value.substring(0, 15)}...`;
      }
      return value;
  };


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-xl font-bold">Performance Overview</h2>
                <select
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(Number(e.target.value))}
                    className="bg-slate-700 text-sm rounded-md p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                    <option value={365}>Last Year</option>
                    <option value={9999}>All Time</option>
                </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-400">Period P/L</div>
                    <div className={`text-2xl font-bold ${periodProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {periodProfit > 0 ? '+' : ''}{periodProfit.toFixed(2)}
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-400">ROI</div>
                    <div className={`text-2xl font-bold ${roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {roi.toFixed(2)}%
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-400">Period Bets</div>
                    <div className="text-2xl font-bold text-cyan-400">{filteredBets.length}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-slate-400">Win Rate</div>
                    <div className="text-2xl font-bold text-cyan-400">{winRate.toFixed(2)}%</div>
                </div>
            </div>
        </Card>

        <Card className="lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Bankroll Settings</h3>
            <Input 
                label="Starting Capital ($)" 
                type="number" 
                value={startingBankroll} 
                onChange={(e) => onUpdateBankroll(parseFloat(e.target.value) || 0)}
                min="0"
            />
            <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Current Balance:</span>
                    <span className={`text-lg font-black ${lifetimeProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${currentBankroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Lifetime Growth:</span>
                    <span className={`text-sm font-bold ${growthPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
                    </span>
                </div>
            </div>
        </Card>
      </div>
        
      <Card>
          <h3 className="text-lg font-bold mb-4">Profit Over Time (Selected Period)</h3>
          {filteredBets.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cumulativeProfitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tickFormatter={(value: number) => `$${value}`} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Line type="monotone" dataKey="profit" stroke="#2dd4bf" strokeWidth={2} dot={false} name="Period Cumulative Profit" isAnimationActive={true}/>
                </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Log at least two bets in the selected period to see your profit chart." />
          )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-bold mb-4">Profit by Bet Type</h3>
            {profitByBetType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitByBetType} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" width={80} tick={{ fontSize: 12 }} tickFormatter={yAxisTickFormatter} />
                  <Tooltip cursor={{fill: 'rgba(100,116,139,0.1)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Bar dataKey="profit" fill="#2dd4bf" name="Total Profit" isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Place some bets to see which types are most profitable." />
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Profit by League</h3>
             {profitByLeague.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitByLeague}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{fill: 'rgba(100,116,139,0.1)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Bar dataKey="profit" fill="#67e8f9" name="Total Profit" isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Place some bets to see which leagues are your specialty." />
            )}
          </Card>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
