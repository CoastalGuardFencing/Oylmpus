import React, { useRef, useEffect } from 'react';

declare const monaco: any;

interface DiffEditorProps {
  original: string;
  modified: string;
  language?: string;
}

const DiffEditor: React.FC<DiffEditorProps> = ({ original, modified, language = 'plaintext' }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstanceRef = useRef<any>(null);

  const appTheme = document.body.classList.contains('theme-olympian') ? 'light' : 'vs-dark';

  useEffect(() => {
    if (editorRef.current) {
      (window as any).require(['vs/editor/editor.main'], () => {
        if (!editorRef.current) return;

        if (monacoInstanceRef.current) {
          monacoInstanceRef.current.dispose();
        }

        monaco.editor.defineTheme('praxis-dark-diff', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: { 'editor.background': '#00000000' }
        });
        monaco.editor.defineTheme('praxis-light-diff', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: { 'editor.background': '#00000000' }
        });
        
        const diffEditor = monaco.editor.createDiffEditor(editorRef.current, {
          originalEditable: false,
          readOnly: true,
          theme: appTheme === 'light' ? 'praxis-light-diff' : 'praxis-dark-diff',
          automaticLayout: true,
          minimap: { enabled: false },
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12,
          wordWrap: 'on',
          renderSideBySide: true,
        });

        monacoInstanceRef.current = diffEditor;

        const originalModel = monaco.editor.createModel(original, language);
        const modifiedModel = monaco.editor.createModel(modified, language);
        
        diffEditor.setModel({
          original: originalModel,
          modified: modifiedModel
        });
      });
    }

    return () => {
      if (monacoInstanceRef.current) {
        monacoInstanceRef.current.dispose();
        monacoInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [original, modified, language, appTheme]);

  return <div ref={editorRef} className="w-full h-full bg-surface-alt border border-border rounded-md" />;
};

export default DiffEditor;
