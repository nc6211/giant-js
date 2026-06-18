import React from 'react';

interface ConsoleProps {
  logs: string[];
  error?: string;
}

export const Console: React.FC<ConsoleProps> = ({ logs, error }) => {
  return (
    <div className="bg-brand-sidebar p-6 font-mono text-[13px] h-full overflow-auto flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-brand-border">
        <span className="text-brand-muted uppercase text-[10px] font-black tracking-[0.2em]">System Output</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-border" />
          <div className="w-2 h-2 rounded-full bg-brand-border" />
          <div className="w-2 h-2 rounded-full bg-brand-border" />
        </div>
      </div>
      <div className="flex-1">
        {logs.length === 0 && !error && (
          <div className="text-brand-muted opacity-20 italic">Listening for process output...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="text-brand-text mb-2 flex gap-3 group">
            <span className="text-[#333] font-bold select-none shrink-0">{String(index + 1).padStart(2, '0')}</span>
            <div className="whitespace-pre-wrap break-all opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-blue-400 mr-2 uppercase text-[9px] font-bold tracking-widest">[Log]</span>
              {log}
            </div>
          </div>
        ))}
        {error && (
          <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Fatal</span>
              <span className="text-red-400 font-bold text-xs uppercase tracking-tight">Execution Error</span>
            </div>
            <div className="text-red-300 text-sm opacity-90 break-words font-mono">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
