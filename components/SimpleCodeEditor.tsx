import React from 'react';

interface SimpleCodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  theme?: string;
}

const SimpleCodeEditor: React.FC<SimpleCodeEditorProps> = ({
  value,
  language = 'plaintext',
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="w-full h-full bg-surface border border-border rounded">
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full h-full p-4 bg-surface text-text-main font-mono text-sm resize-none border-none outline-none"
        style={{ minHeight: '400px' }}
        placeholder={`// ${language} code here...`}
        spellCheck={false}
      />
    </div>
  );
};

export default SimpleCodeEditor;