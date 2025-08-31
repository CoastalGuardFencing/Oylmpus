import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PromptAnalysis } from '../types';
import { SparklesIcon, Wand2Icon, BrainCircuitIcon } from './icons';
import { remixPrompt, analyzePrompt } from '../services/geminiService';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isChatting: boolean;
  onApplyCodeSuggestion: (code: string) => void;
  isOnline: boolean;
}

const ChatMessageRenderer: React.FC<{ message: ChatMessage; onApplyCodeSuggestion: (code: string) => void }> = ({ message, onApplyCodeSuggestion }) => {
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg break-words bg-primary text-on-primary">
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  }

  const text = message.text;
  const codeBlockRegex = /```(?:[a-zA-Z0-9-]+\n)?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[1].trim() });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
      parts.push({ type: 'text', content: text });
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg break-words bg-surface-alt text-text-main">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return <p key={index} className="whitespace-pre-wrap">{part.content}</p>;
          }
          if (part.type === 'code') {
            return (
              <div key={index} className="bg-surface rounded-md my-2 relative group">
                <pre className="p-3 pr-16 text-xs overflow-x-auto bg-surface-alt rounded-md font-mono text-text-main">
                  <code>{part.content}</code>
                </pre>
                <button onClick={() => onApplyCodeSuggestion(part.content)} className="absolute top-2 right-2 bg-primary text-on-primary px-2 py-1 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                  Apply
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isChatting, onApplyCodeSuggestion, isOnline }) => {
  const [input, setInput] = useState('');
  const [remixes, setRemixes] = useState<string[]>([]);
  const [isRemixing, setIsRemixing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isChatting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isChatting) {
      onSendMessage(input);
      setInput('');
      setRemixes([]);
      setAnalysis(null);
    }
  };

  const handleRemix = async () => {
    if (isRemixing || !input.trim()) return;
    setIsRemixing(true);
    setAnalysis(null);
    setRemixes([]);
    try {
        const remixedPrompts = await remixPrompt(input, isOnline);
        setRemixes(remixedPrompts);
    } finally {
        setIsRemixing(false);
    }
  };
  
  const handleAnalyze = async () => {
    if (isAnalyzing || !input.trim()) return;
    setIsAnalyzing(true);
    setRemixes([]);
    setAnalysis(null);
    try {
        const result = await analyzePrompt(input, isOnline);
        setAnalysis(result);
    } finally {
        setIsAnalyzing(false);
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <ChatMessageRenderer key={index} message={msg} onApplyCodeSuggestion={onApplyCodeSuggestion} />
        ))}
        {isChatting && (
            <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-surface-alt text-text-main flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 animate-pulse" />
                    <span>Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border bg-surface">
        {isRemixing && (
            <div className="text-center text-text-muted p-2 mb-3 text-sm flex items-center justify-center gap-2">
                <SparklesIcon className="w-4 h-4 animate-pulse" />
                Remixing your prompt...
            </div>
        )}
        {remixes.length > 0 && !isRemixing && (
            <div className="mb-3 p-3 bg-surface-alt border border-border rounded-lg space-y-2 max-h-48 overflow-y-auto">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-text-main">Prompt Remixes</h4>
                    <button onClick={() => setRemixes([])} title="Close remixes" className="text-text-muted hover:text-text-main text-lg leading-none">&times;</button>
                </div>
                {remixes.map((remix, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setInput(remix);
                            setRemixes([]);
                        }}
                        className="w-full text-left p-2 rounded-md bg-surface hover:bg-border transition-colors text-sm text-text-muted"
                    >
                        {remix}
                    </button>
                ))}
            </div>
        )}
        {isAnalyzing && (
            <div className="text-center text-text-muted p-2 mb-3 text-sm flex items-center justify-center gap-2">
                <BrainCircuitIcon className="w-4 h-4 animate-pulse" />
                Analyzing prompt DNA...
            </div>
        )}
        {analysis && !isAnalyzing && (
            <div className="mb-3 p-3 bg-surface-alt border border-border rounded-lg space-y-2">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-text-main">Prompt DNA</h4>
                    <button onClick={() => setAnalysis(null)} title="Close analysis" className="text-text-muted hover:text-text-main text-lg leading-none">&times;</button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <strong className="text-text-muted">Concept:</strong> <span className="text-text-main">{analysis.concept}</span>
                    <strong className="text-text-muted">Tone:</strong> <span className="text-text-main">{analysis.tone}</span>
                    <strong className="text-text-muted">Constraint:</strong> <span className="text-text-main">{analysis.constraint}</span>
                    <strong className="text-text-muted">Rhythm:</strong> <span className="text-text-main">{analysis.rhythm}</span>
                </div>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a coding question..."
              className="flex-1 bg-surface-alt border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={isChatting || isRemixing || isAnalyzing}
            />
            <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isChatting || isRemixing || !input.trim() || !isOnline}
                title="Analyze Prompt DNA"
                className="p-2.5 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md transition-all disabled:bg-surface-alt disabled:cursor-not-allowed flex items-center justify-center"
            >
                <BrainCircuitIcon className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={handleRemix}
                disabled={isRemixing || isChatting || isAnalyzing || !input.trim() || !isOnline}
                title="Remix Prompt"
                className="p-2.5 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md transition-all disabled:bg-surface-alt disabled:cursor-not-allowed flex items-center justify-center"
            >
                <Wand2Icon className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isChatting || isRemixing || isAnalyzing || !input.trim()}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md transition-all disabled:bg-surface-alt disabled:cursor-not-allowed"
            >
              Send
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;