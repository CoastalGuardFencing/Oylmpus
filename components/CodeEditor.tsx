import React, { useRef, useEffect } from 'react';

// Define the Monaco editor interfaces we need, to avoid importing the whole package.
// This is a common practice in environments where you can't easily add type packages.
declare const monaco: any;

interface MonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  theme?: string;
}

const CodeEditor: React.FC<MonacoEditorProps> = ({
  value,
  language = 'plaintext',
  onChange,
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstanceRef = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);

  const appTheme = document.body.classList.contains('theme-olympian') ? 'light' : 'vs-dark';

  useEffect(() => {
    if (editorRef.current) {
      // Use require from the loader script in index.html
      (window as any).require(['vs/editor/editor.main'], () => {
        if (!editorRef.current) return;

        // Dispose of the previous instance if it exists
        if (monacoInstanceRef.current) {
            monacoInstanceRef.current.dispose();
        }
        
        monaco.editor.defineTheme('praxis-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#00000000', // Transparent background
            }
        });
        monaco.editor.defineTheme('praxis-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#00000000',
            }
        });
        
        const editor = monaco.editor.create(editorRef.current, {
          value,
          language,
          readOnly,
          theme: appTheme === 'light' ? 'praxis-light' : 'praxis-dark',
          automaticLayout: true,
          minimap: { enabled: false },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 14,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          backgroundColor: 'transparent',
          lineNumbers: 'on',
        });

        monacoInstanceRef.current = editor;

        // If onChange is provided, set up a listener
        if (onChange) {
            // Dispose of old subscription
            if (subscriptionRef.current) {
                subscriptionRef.current.dispose();
            }
            subscriptionRef.current = editor.onDidChangeModelContent(() => {
                const currentValue = editor.getValue();
                // Prevent calling onChange if the change was triggered by a prop update
                if (currentValue !== value) {
                    onChange(currentValue);
                }
            });
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }
      if (monacoInstanceRef.current) {
        monacoInstanceRef.current.dispose();
        monacoInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once to initialize the editor container

  // Update editor value when the prop changes
  useEffect(() => {
    const editor = monacoInstanceRef.current;
    if (editor && editor.getValue() !== value) {
        // Push the new value to the editor's model.
        // This is safer than setValue as it can be pushed to the undo stack.
        editor.getModel()?.pushEditOperations(
            [],
            [{
                range: editor.getModel().getFullModelRange(),
                text: value
            }],
            () => null
        );
    }
  }, [value]);

  // Update readOnly status
  useEffect(() => {
    monacoInstanceRef.current?.updateOptions({ readOnly });
  }, [readOnly]);
  
  // Update language
  useEffect(() => {
      if (monacoInstanceRef.current && (window as any).monaco) {
          (window as any).monaco.editor.setModelLanguage(monacoInstanceRef.current.getModel(), language);
      }
  }, [language]);

  // Update theme
  useEffect(() => {
    if ((window as any).monaco) {
        (window as any).monaco.editor.setTheme(appTheme === 'light' ? 'praxis-light' : 'praxis-dark');
    }
  }, [appTheme]);

  return <div ref={editorRef} className="w-full h-full" />;
};

export default CodeEditor;