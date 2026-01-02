import React, { useState, useRef } from 'react';
import type { CalculatedBet, BetResult, Bet } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface BetTableProps {
  bets: CalculatedBet[];
  onDeleteBet: (id: string) => void;
  onUpdateBet: (bet: Bet) => void;
  onImportBets: (bets: Bet[]) => void;
}

const ExportIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 3a1 1 0 011 1v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9.586V4a1 1 0 011-1z" />
        <path d="M3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
);

const JsonIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);

const UploadIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);


const ResultSelector: React.FC<{
  result: BetResult;
  onChange: (newResult: BetResult) => void;
}> = ({ result, onChange }) => {
  const resultClasses: Record<BetResult, string> = {
    win: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
    loss: 'bg-red-500/20 text-red-400 border-red-500',
    push: 'bg-slate-500/20 text-slate-300 border-slate-500',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  };
  
  return (
    <select
      value={result}
      onChange={(e) => onChange(e.target.value as BetResult)}
      className={`rounded-md px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${resultClasses[result]}`}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="pending">Pending</option>
      <option value="win">Win</option>
      <option value="loss">Loss</option>
      <option value="push">Push</option>
    </select>
  );
};

const BetTable: React.FC<BetTableProps> = ({ bets, onDeleteBet, onUpdateBet, onImportBets }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleResultChange = (bet: Bet, newResult: BetResult) => {
        onUpdateBet({ ...bet, result: newResult });
    };

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleExportCSV = () => {
        if (bets.length === 0) {
            alert("No bets to export.");
            return;
        }

        const headers = [
            'id', 'date', 'event', 'league', 'betType', 'betDetails', 'odds', 'stake',
            'yourProbability', 'result', 'notes', 'impliedProbability', 'edge', 'profit'
        ];

        const escapeCsvField = (field: any): string => {
            const stringField = String(field ?? '');
            if (/[",\n]/.test(stringField)) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const csvRows = bets.map(bet => {
            const betDetailsString = (bet.betDetails || [])
                .map(leg => leg.description)
                .join('; ');

            const csvRow: { [key: string]: any } = { ...bet, betDetails: betDetailsString };

            return headers.map(header => escapeCsvField(csvRow[header as keyof typeof csvRow])).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'ev_bets_export.csv', 'text/csv;charset=utf-8;');
    };

    const handleExportJSON = () => {
        if (bets.length === 0) {
            alert("No bets to export.");
            return;
        }
        // Export clean state without derived fields to keep backup file smaller and clean
        const cleanBets = bets.map(({ impliedProbability, edge, profit, ...rest }) => rest);
        const jsonContent = JSON.stringify(cleanBets, null, 2);
        downloadFile(jsonContent, 'ev_bets_backup.json', 'application/json');
    };

    const downloadFile = (content: string, fileName: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const timestamp = new Date().toISOString().slice(0, 10);
        link.setAttribute("download", `${fileName.split('.')[0]}_${timestamp}.${fileName.split('.')[1]}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const triggerImport = () => {
        fileInputRef.current?.click();
    };

    const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedBets = JSON.parse(content);
                
                if (Array.isArray(importedBets)) {
                     // Basic validation to ensure it looks like bet data
                     const isValid = importedBets.every(b => b.date && b.event && b.odds);
                     if(isValid) {
                         onImportBets(importedBets);
                     } else {
                         alert("Invalid JSON structure. Please upload a valid backup file.");
                     }
                } else {
                    alert("Invalid JSON format. Expected an array of bets.");
                }
            } catch (error) {
                console.error("Error parsing JSON", error);
                alert("Error parsing the file. Please ensure it is a valid JSON file.");
            }
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };


  return (
    <Card className="overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-slate-100">Bet History</h2>
            <div className="flex flex-wrap gap-2">
                <input 
                    type="file" 
                    accept=".json" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImportJSON}
                />
                <Button onClick={triggerImport} variant="secondary" className="w-auto !py-2 !px-3 text-sm" title="Restore Backup">
                    <UploadIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Restore</span>
                </Button>
                <Button onClick={handleExportJSON} variant="secondary" className="w-auto !py-2 !px-3 text-sm" title="Backup to JSON">
                    <JsonIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Backup</span>
                </Button>
                <Button onClick={handleExportCSV} variant="secondary" className="w-auto !py-2 !px-3 text-sm" title="Export to CSV">
                    <ExportIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">CSV</span>
                </Button>
            </div>
        </div>
        <div className="w-full text-left">
            <div className="hidden md:grid md:grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase p-4 border-b border-slate-700">
                <div className="md:col-span-2">Date</div>
                <div className="md:col-span-3">Event</div>
                <div className="md:col-span-2">Bet Type</div>
                <div className="text-center">Odds</div>
                <div className="text-center">Stake</div>
                <div className="text-center">Edge</div>
                <div className="text-center">P/L</div>
                <div className="md:col-span-1">Result</div>
            </div>
            <div className="space-y-2">
                {bets.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        <p className="font-semibold">Your history is empty!</p>
                        <p className="text-sm">Log your first bet to see it appear here.</p>
                    </div>
                )}
                {bets.map((bet) => (
                    <div key={bet.id} className="bg-slate-800 rounded-lg">
                        <div
                            className="grid grid-cols-4 md:grid-cols-12 gap-4 p-4 items-center cursor-pointer hover:bg-slate-700/50 transition-colors"
                            onClick={() => toggleRow(bet.id)}
                        >
                            <div className="md:col-span-2 text-sm font-medium">{new Date(bet.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</div>
                            <div className="col-span-3 md:col-span-3 text-sm font-semibold truncate" title={bet.event}>{bet.event}</div>
                            <div className="hidden md:block md:col-span-2 text-xs text-slate-300 truncate" title={bet.betType}>{bet.betType}</div>
                            <div className="hidden md:block text-sm text-center font-mono">{bet.odds > 0 ? `+${bet.odds}` : bet.odds}</div>
                            <div className="hidden md:block text-sm text-center font-mono">${bet.stake.toFixed(2)}</div>
                            <div className={`hidden md:block text-sm text-center font-semibold ${bet.edge > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{bet.edge.toFixed(2)}%</div>
                            <div className={`text-sm text-center font-semibold ${bet.profit > 0 ? 'text-emerald-400' : bet.profit < 0 ? 'text-red-400' : 'text-slate-300'}`}>{bet.profit.toFixed(2)}</div>
                            <div className="col-span-1 md:col-span-1 text-center">
                                <ResultSelector result={bet.result} onChange={(newResult) => handleResultChange(bet, newResult)} />
                            </div>
                        </div>
                        {expandedRow === bet.id && (
                             <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <p className="md:hidden"><strong className="text-slate-400">Bet Type:</strong> {bet.betType}</p>
                                    <p className="md:hidden"><strong className="text-slate-400">Odds:</strong> {bet.odds > 0 ? `+${bet.odds}` : bet.odds}</p>
                                    <p className="md:hidden"><strong className="text-slate-400">Stake:</strong> ${bet.stake.toFixed(2)}</p>
                                    <p className="md:hidden"><strong className="text-slate-400">Edge:</strong> <span className={bet.edge > 0 ? 'text-emerald-400' : 'text-red-400'}>{bet.edge.toFixed(2)}%</span></p>
                                    <p><strong className="text-slate-400">League:</strong> {bet.league}</p>
                                    <p><strong className="text-slate-400">Your Prob:</strong> {bet.yourProbability.toFixed(2)}%</p>
                                    <p><strong className="text-slate-400">Implied Prob:</strong> {bet.impliedProbability.toFixed(2)}%</p>
                                 </div>
                                 {bet.betDetails && bet.betDetails.length > 0 && (
                                    <div className="mt-4">
                                      <strong className="text-slate-400 text-sm">Bet Details:</strong>
                                      <ul className="list-disc list-inside pl-2 mt-1 text-slate-300 space-y-1 text-sm">
                                        {bet.betDetails.map((leg, index) => (
                                          <li key={index}>{leg.description}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                 {bet.notes && <p className="mt-4 text-slate-300"><strong className="text-slate-400">Notes:</strong> {bet.notes}</p>}
                                 <button onClick={(e) => { e.stopPropagation(); onDeleteBet(bet.id); }} className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors">Delete Bet</button>
                             </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </Card>
  );
};

export default BetTable;