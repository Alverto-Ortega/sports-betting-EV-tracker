# Developer Documentation: +EV Bet Tracker

This document serves as a guide for extending, maintaining, and understanding the internal logic of the +EV Bet Tracker.

## 🏗️ Architecture Overview

The app is built as a **Pure Static Web App**. It uses modern ES Modules (ESM) loaded via an `importmap` in `index.html`. 

## 🧠 Core Logic

### Bankroll & Betting Plan
The `starting_bankroll` (stored in LocalStorage) represents the user's initial "seed" capital at the start of their plan.
- **Current Balance**: `StartingBankroll + Sum(All Settled Profits/Losses)`.
- **Settled Profits**: Only bets with a result of 'win', 'loss', or 'push' are included in the balance calculation. 'Pending' bets do not affect current bankroll.
- **Sync Logic**: The `BankrollCard` in the sidebar and the `AnalysisDashboard` both use the same state. Updating the "Beginning Bankroll" input will instantly trigger a global UI refresh.

### American Odds to Probability
The utility in `utils/calculations.ts` handles the standard betting formulas:
- **Negative Odds (Favorites):** `P = (-Odds) / (-Odds + 100)`
- **Positive Odds (Underdogs):** `P = 100 / (Odds + 100)`

## 🛠️ How to Extend the App

### 1. Modifying the Sidebar
The sidebar layout is managed in `App.tsx`. You can reorder the `BankrollCard`, `MilestoneTracker`, and `BetForm` to change the hierarchy of information.

### 2. Stake vs. Bankroll % (Future Feature)
If you wish to add a feature that recommends a stake based on bankroll percentage (Kelly Criterion), you would:
1. Access the `startingBankroll + totalSettledProfit` value in `BetForm.tsx`.
2. Implement the formula in `utils/calculations.ts`.
3. Display the recommended amount next to the "Stake" input field.

## ⚠️ Maintenance Notes
- **Storage Limits**: Standard browser `localStorage` is capped at ~5MB.
- **Data Integrity**: Always use the **Restore** feature in the `BetTable` component if moving between devices or clearing browser cache.
