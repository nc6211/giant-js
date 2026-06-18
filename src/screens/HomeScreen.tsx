import React, { useState, useEffect } from 'react';
import { Plus, FileJson, FileCode, Play, Trash2, Clock, Terminal } from 'lucide-react';
import { storage } from '../utils/storage';
import { ProjectFile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HomeScreenProps {
  onOpenFile: (file: ProjectFile) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenFile }) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [showNewMenu, setShowNewMenu] = useState(false);

  useEffect(() => {
    setFiles(storage.getFiles());
  }, []);

  const createNewFile = (type: 'js' | 'jsx') => {
    const defaultJS = '// New JS File\nconsole.log("Hello Giant JS!");\n';
    const defaultJSX = `import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Giant JS React Preview</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click Me
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));`;

    const newFile: ProjectFile = {
      id: Math.random().toString(36).substring(7),
      name: type === 'js' ? 'script.js' : 'Component.jsx',
      content: type === 'js' ? defaultJS : defaultJSX,
      type,
      lastModified: Date.now()
    };
    storage.saveFile(newFile);
    onOpenFile(newFile);
  };

  const deleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this file?')) {
      storage.deleteFile(id);
      setFiles(storage.getFiles());
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg text-brand-text">
      <header className="bg-brand-panel border-b border-brand-border px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center mr-3">
              <span className="text-black font-black text-xs">GJS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Giant JS</h1>
              <p className="text-brand-muted text-xs uppercase tracking-widest font-medium">v0.2.0 • Code Laboratory</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <span className="text-white border-b-2 border-brand-accent pb-1">Workspaces</span>
            <span className="text-brand-muted hover:text-white cursor-pointer transition-colors">Config</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">Your Projects</span>
            <div className="h-[1px] flex-1 mx-4 bg-brand-border"></div>
            <div className="text-[10px] text-brand-muted font-bold px-2 py-1 bg-brand-border/30 rounded uppercase tracking-tighter">
              {files.length} Total
            </div>
          </div>

          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-brand-panel/50 rounded-2xl border border-brand-border text-brand-muted">
              <FileCode size={48} className="mb-4 opacity-10" />
              <p className="text-sm">Empty Workspace</p>
              <button 
                onClick={() => setShowNewMenu(true)}
                className="mt-4 text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline"
              >
                Create First File
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {files.sort((a, b) => b.lastModified - a.lastModified).map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onOpenFile(file)}
                  className="bg-brand-panel p-5 rounded-xl border border-brand-border hover:border-brand-accent/50 transition-all cursor-pointer group flex items-center gap-5"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${file.type === 'js' ? 'bg-yellow-400/10 text-yellow-500' : 'bg-blue-400/10 text-blue-500'}`}>
                    {file.type === 'js' ? <Terminal size={22} /> : <FileJson size={22} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-brand-text truncate text-lg tracking-tight">{file.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-brand-muted mt-1 font-mono uppercase tracking-tighter">
                      <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                      <span className="opacity-20">•</span>
                      <span className={`${file.type === 'js' ? 'text-yellow-500/70' : 'text-blue-500/70'} font-bold`}>
                        {file.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={(e) => deleteFile(file.id, e)}
                      className="p-2 text-brand-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="p-2 text-brand-accent">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FAB and New Menu */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-4">
        <AnimatePresence>
          {showNewMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="flex flex-col gap-3 mb-2"
            >
              <button 
                onClick={() => createNewFile('jsx')}
                className="bg-white text-black px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3 hover:bg-brand-accent transition-colors"
              >
                <FileJson size={20} /> JSX Component
              </button>
              <button 
                onClick={() => createNewFile('js')}
                className="bg-white text-black px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3 hover:bg-brand-accent transition-colors"
              >
                <Terminal size={20} /> JS Script
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowNewMenu(!showNewMenu)}
          className={`w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${
            showNewMenu ? 'bg-red-500 rotate-[135deg]' : 'bg-brand-accent hover:rotate-90'
          } text-black`}
        >
          <Plus size={36} />
        </button>
      </div>
    </div>
  );
};
