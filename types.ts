
export interface BetLeg {
  description: string;
}

export type BetResult = 'win' | 'loss' | 'push' | 'pending';

export interface Bet {
  id: string;
  date: string;
  event: string;
  league: string;
  betType: string;
  betDetails?: BetLeg[];
  odds: number;
  stake: number;
  yourProbability: number;
  notes: string;
  result: BetResult;
}

export interface CalculatedBet extends Bet {
  impliedProbability: number;
  edge: number;
  profit: number;
}
