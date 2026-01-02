
import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [lastSaved, setLastSaved] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const handleUpdate = () => {
      setLastSaved(new Date().toLocaleTimeString());
    };
    window.addEventListener('local-storage-update', handleUpdate);
    return () => window.removeEventListener('local-storage-update', handleUpdate);
  }, []);

  return (
    <footer className="mt-12 py-8 border-t border-slate-800">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 shadow-xl">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Local Storage Active
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Synced: {lastSaved}
          </span>
        </div>
        
        <div className="max-w-lg space-y-2">
            <p className="text-slate-500 text-sm">
              <strong>Privacy Protocol:</strong> This application operates 100% offline. 
              No servers, no tracking, no data leaks. Your bets never leave this device.
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              DANGER: Clearing your browser history/cache or using "Incognito" mode will wipe your data. 
              Always keep a <code>.json</code> backup using the export tool above for long-term safety.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
