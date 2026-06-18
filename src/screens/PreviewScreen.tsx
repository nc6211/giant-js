import React from 'react';
import { ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { PreviewWebView } from '../components/PreviewWebView';

interface PreviewScreenProps {
  html: string;
  onBack: () => void;
  fileName: string;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ html, onBack, fileName }) => {
  return (
    <div className="flex flex-col h-screen bg-brand-bg">
      <header className="h-14 bg-brand-panel border-b border-brand-border flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-brand-muted transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Live Render Preview</h1>
            <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em]">{fileName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-brand-muted" title="Share link">
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => {
              const win = window.open();
              if (win) win.document.write(html);
            }} 
            className="p-2 bg-brand-accent hover:bg-[#ffe066] rounded-lg text-black ml-2" 
            title="Pop out to new window"
          >
            <ExternalLink size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 bg-brand-bg overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-sm h-full max-h-[700px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden border-[12px] border-[#1A1A1A] bg-white ring-1 ring-brand-border">
          <PreviewWebView html={html} />
        </div>
      </main>

      <footer className="h-10 bg-brand-bg flex items-center justify-center px-4">
        <div className="w-32 h-1 bg-brand-border rounded-full opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
      </footer>
    </div>
  );
};
