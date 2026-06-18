import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { EditorScreen } from './screens/EditorScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { ProjectFile } from './types';
import { motion, AnimatePresence } from 'motion/react';

type Screen = 'home' | 'editor' | 'preview';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentFile, setCurrentFile] = useState<ProjectFile | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  const handleOpenFile = (file: ProjectFile) => {
    setCurrentFile(file);
    setScreen('editor');
  };

  const handleBack = () => {
    setScreen('home');
    setCurrentFile(null);
  };

  const handleShowPreview = (html: string) => {
    setPreviewHtml(html);
    setScreen('preview');
  };

  return (
    <div className="h-screen w-full bg-slate-950 font-sans selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="h-full w-full"
          >
            <HomeScreen onOpenFile={handleOpenFile} />
          </motion.div>
        )}
        {screen === 'editor' && currentFile && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full"
          >
            <EditorScreen 
              file={currentFile} 
              onBack={handleBack} 
              onPreview={handleShowPreview}
            />
          </motion.div>
        )}
        {screen === 'preview' && currentFile && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="h-full w-full"
          >
            <PreviewScreen 
              html={previewHtml} 
              fileName={currentFile.name} 
              onBack={() => setScreen('editor')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
