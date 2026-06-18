import React from 'react';

interface PreviewWebViewProps {
  html: string;
}

export const PreviewWebView: React.FC<PreviewWebViewProps> = ({ html }) => {
  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-col">
       <div className="bg-[#F0F0F0] px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter truncate max-w-[200px]">localhost:19006/preview</span>
        <div className="w-8" /> {/* Balance */}
      </div>
      <iframe
        title="preview"
        srcDoc={html}
        className="w-full flex-1 border-none"
        sandbox="allow-scripts"
      />
    </div>
  );
};
