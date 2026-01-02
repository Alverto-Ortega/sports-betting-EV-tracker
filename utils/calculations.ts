import type { Bet, BetResult } from '../types';

/**
 * Calculates the implied probability from American odds.
 * @param odds - The American odds (e.g., -110, +150).
 * @returns The implied probability as a percentage.
 */
export const calculateImpliedProbability = (odds: number): number => {
  if (odds === 0) return 0;
  // For negative odds (favorites), the formula is: (-odds) / (-odds + 100)
  if (odds < 0) {
    return (-odds / (-odds + 100)) * 100;
  }
  // For positive odds (underdogs), the formula is: 100 / (odds + 100)
  return (100 / (odds + 100)) * 100;
};

/**
 * Calculates the profit or loss for a bet based on its result.
 * @param stake - The amount wagered.
 * @param odds - The American odds of the bet.
 * @param result - The outcome of the bet ('win', 'loss', 'push', 'pending').
 * @returns The net profit or loss.
 */
export const calculateProfit = (stake: number, odds: number, result: BetResult): number => {
  if (result === 'win') {
    // For negative odds, profit is stake * (100 / absolute odds)
    if (odds < 0) {
      return stake * (100 / -odds);
    }
    // For positive odds, profit is stake * (odds / 100)
    return stake * (odds / 100);
  }
  if (result === 'loss') {
    // A loss always results in losing the entire stake.
    return -stake;
  }
  // A 'push' or 'pending' bet has no profit or loss.
  return 0;
};

/**
 * Augments a Bet object with calculated fields like implied probability, edge, and profit.
 * @param bet - The original bet object.
 * @returns A new CalculatedBet object.
 */
export const addCalculationsToBet = (bet: Bet) => {
  const impliedProbability = calculateImpliedProbability(bet.odds);
  const edge = bet.yourProbability - impliedProbability;
  const profit = calculateProfit(bet.stake, bet.odds, bet.result);
  
  return {
    ...bet,
    impliedProbability,
    edge,
    profit,
  };
};
