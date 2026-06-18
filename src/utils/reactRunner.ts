import * as esbuild from 'esbuild-wasm';

let esbuildInitialized = false;

export const runReact = async (code: string): Promise<string> => {
  try {
    if (!esbuildInitialized) {
      await esbuild.initialize({
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.25.0/esbuild.wasm',
        worker: true,
      });
      esbuildInitialized = true;
    }

    const result = await esbuild.transform(code, {
      loader: 'jsx',
      target: 'es2015',
    });

    // Helper to allow the user's code to work even if they don't import React/ReactDOM manually in the string
    // as they specified in the template "import React from 'react'" which we will strip or map.
    const transpiledCode = result.code
      .replace(/import\s+React\s+from\s+['"]react['"];?/g, '')
      .replace(/import\s+ReactDOM\s+from\s+['"]react-dom['"];?/g, '');

    const wrappedCode = `
      const React = window.React;
      const ReactDOM = window.ReactDOM;
      const { useState, useEffect, useRef, useMemo, useCallback } = React;
      
      ${transpiledCode}
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: system-ui, -apple-system, sans-serif; 
              background: #f8fafc; 
              color: #1e293b;
            }
            #root { min-height: 100vh; }
            button { 
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 6px; 
              cursor: pointer;
              font-weight: 500;
            }
            button:active { background: #2563eb; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            (function() {
              try {
                ${wrappedCode}
              } catch (err) {
                document.getElementById('root').innerHTML = '<div style="color: #ef4444; padding: 20px; background: #fee2e2; border-radius: 8px; font-family: monospace;"><b>Render Error:</b><br/>' + err.message + '</div>';
                console.error(err);
              }
            })();
          </script>
        </body>
      </html>
    `;
  } catch (err: any) {
    return `<html><body><pre style="color: red">Bundling Error: ${err.message}</pre></body></html>`;
  }
};
