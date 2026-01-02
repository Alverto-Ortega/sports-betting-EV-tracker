# 📈 +EV Bet Tracker (Pro Edition)

A high-performance, **privacy-first** web application designed for serious sports bettors to track and analyze Positive Expected Value (+EV) wagers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deployment: Static](https://img.shields.io/badge/Deployment-Static-blue.svg)](#deployment)

## ✨ Key Pillars

- **Beginning Bankroll**: Define the start of your betting plan. The app automatically tracks your current balance and growth relative to this seed amount.
- **Real-time Balance**: Always see your current bankroll on the main tracker screen while you log new bets.
- **Volume Milestones**: Stay motivated with an automated tracker that celebrates every 100 bets logged.
- **100% Client-Side**: Your data never leaves your browser. No databases, no tracking, no risk of leaks.
- **Mathematical Edge**: Built-in American Odds to Implied Probability conversion and Edge calculation.
- **Deep Analysis**: ROI tracking, profit-over-time visualization, and performance breakdown by league and bet type.

## 🚀 Deployment Options

### 1. Local (No Setup)
Simply open `index.html` in a local server environment (like VS Code Live Server or Python `http.server`).

### 2. Firebase Hosting (Recommended)
```bash
# Install CLI
npm install -g firebase-tools
# Deploy
firebase login
firebase deploy
```

## 🛠️ Tech Stack
- **Library**: React 19 (ESM Modules)
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Storage**: Browser LocalStorage with Custom Sync Events

## 🔒 Security & Privacy
This application utilizes `localStorage`. For long-term data safety, it is recommended to use the **Backup (JSON)** feature weekly. Clearing browser cookies or cache will remove data if not backed up.

---
*Disclaimer: This tool is for tracking and educational purposes. Betting involves financial risk. Please gamble responsibly.*
