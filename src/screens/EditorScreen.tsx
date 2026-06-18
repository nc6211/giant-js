import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-tomorrow.css';
import { ArrowLeft, Play, Save, Layout, Terminal as ConsoleIcon, ExternalLink } from 'lucide-react';
import { ProjectFile } from '../types';
import { storage } from '../utils/storage';
import { runJS, RunResult } from '../utils/jsRunner';
import { runReact } from '../utils/reactRunner';
import { Console } from '../components/Console';
import { PreviewWebView } from '../components/PreviewWebView';

interface EditorScreenProps {
  file: ProjectFile;
  onBack: () => void;
  onPreview: (html: string) => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({ file, onBack, onPreview }) => {
  const [code, setCode] = useState(file.content);
  const [mode, setMode] = useState<'console' | 'preview'>(file.type === 'js' ? 'console' : 'preview');
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const saveFile = () => {
    setIsSaving(true);
    storage.saveFile({ ...file, content: code });
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleRun = async () => {
    if (file.type === 'js') {
      setMode('console');
      const result = await runJS(code);
      setLogs(result.output);
      setError(result.error);
    } else {
      setMode('preview');
      const html = await runReact(code);
      setPreviewHtml(html);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text overflow-hidden font-sans">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-brand-border bg-brand-panel shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center mr-3">
              <span className="text-black font-black text-xs">GJS</span>
            </div>
            <h1 className="text-sm font-bold tracking-tight">Giant JS <span className="text-brand-muted font-normal ml-2">v0.2.0</span></h1>
          </div>
          
          <div className="h-4 w-[1px] bg-brand-border"></div>
          
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-md transition-colors">
              <ArrowLeft size={18} className="text-brand-muted hover:text-white" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white truncate max-w-[150px]">{file.name}</span>
              <span className="text-[9px] text-brand-muted uppercase tracking-widest font-medium">{file.type === 'jsx' ? 'React Application' : 'JavaScript Script'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-brand-border/50 rounded-lg p-1">
            <button 
              onClick={() => setMode('console')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                mode === 'console' ? 'bg-white/10 text-white shadow-sm' : 'text-brand-muted hover:text-white'
              }`}
            >
              CONSOLE
            </button>
            <button 
              onClick={() => setMode('preview')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                mode === 'preview' ? 'bg-white/10 text-white shadow-sm' : 'text-brand-muted hover:text-white'
              }`}
            >
              PREVIEW
            </button>
          </div>

          <div className="h-4 w-[1px] bg-brand-border mx-1"></div>

          <button 
            onClick={saveFile}
            className={`p-2 rounded-lg transition-all ${
              isSaving ? 'text-green-400' : 'text-brand-muted hover:text-white hover:bg-white/5'
            }`}
            title="Save changes"
          >
            <Save size={18} />
          </button>
          
          <button 
            onClick={handleRun}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand-accent hover:bg-[#ffe066] text-black rounded-lg text-xs font-bold transition-all"
          >
            <Play size={14} fill="currentColor" /> Run Code
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Pane */}
        <div className="w-1/2 flex flex-col border-r border-brand-border bg-brand-bg overflow-hidden">
          <div className="flex-1 overflow-auto p-2 scrollbar-thin scrollbar-thumb-brand-border">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => Prism.highlight(code, Prism.languages[file.type === 'js' ? 'javascript' : 'jsx'], file.type === 'js' ? 'javascript' : 'jsx')}
              padding={16}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                width: '100%',
                minHeight: '100%',
                lineHeight: '1.6',
              }}
              className="outline-none"
            />
          </div>
        </div>

        {/* Output Pane */}
        <div className="w-1/2 flex flex-col bg-brand-sidebar overflow-hidden relative">
          {file.type === 'jsx' && previewHtml && mode === 'preview' && (
            <button 
              onClick={() => onPreview(previewHtml)}
              className="absolute top-4 right-4 z-10 p-2 bg-brand-panel/80 hover:bg-brand-panel rounded-lg text-brand-muted hover:text-white border border-brand-border shadow-xl backdrop-blur-md transition-all"
              title="Open full screen preview"
            >
              <ExternalLink size={16} />
            </button>
          )}

          <div className="flex-1 overflow-hidden">
            {mode === 'console' ? (
              <Console logs={logs} error={error} />
            ) : (
              <div className="w-full h-full p-6 flex flex-col bg-brand-sidebar">
                {previewHtml ? (
                  <div className="flex-1 rounded-xl overflow-hidden border border-brand-border shadow-2xl bg-white">
                    <PreviewWebView html={previewHtml} />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-brand-muted opacity-40 select-none border border-dashed border-brand-border rounded-xl">
                    <Layout size={64} strokeWidth={1} className="mb-6" />
                    <p className="text-xs font-bold uppercase tracking-widest">Ready to build</p>
                    <p className="text-[10px] mt-2 italic">Click Run Code to start renderer</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="h-7 bg-[#1E1E1E] border-t border-brand-border flex items-center justify-between px-4 text-[10px] text-brand-muted font-medium shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-brand-accent/80">
            <div className="w-2 h-2 rounded-full bg-brand-accent mr-2 animate-pulse" />
            LIVE RUNTIME
          </div>
          <span className="opacity-40">main*</span>
          <span className="opacity-40">UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-500 font-bold uppercase tracking-tighter">● SYSTEM READY</span>
          <span className="opacity-40">{file.type === 'jsx' ? 'REACT JSX' : 'ECMASCRIPT'}</span>
        </div>
      </footer>
    </div>
  );
};
