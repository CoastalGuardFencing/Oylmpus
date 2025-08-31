import React, { useState } from 'react';
import { CompassIcon, SparklesIcon } from './icons';

interface ApiKeyGuidancePanelProps {
    isOnline: boolean;
    onGenerate: (request: string) => void;
    guidance: string;
    isGenerating: boolean;
}

const ApiKeyGuidancePanel: React.FC<ApiKeyGuidancePanelProps> = ({ isOnline, onGenerate, guidance, isGenerating }) => {
    const [request, setRequest] = useState('');

    const handleSubmit = () => {
        if (request.trim() && !isGenerating) {
            onGenerate(request);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <CompassIcon className="w-5 h-5" /> API Key Guidance Engine
                </h3>
                <p className="text-sm text-text-muted mb-4">
                    Request guidance and code snippets for implementing external APIs.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <textarea
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="e.g., 'I need a key for Gemini-Pro on Cloud Run'"
                    className="w-full h-24 p-2 bg-surface-alt border border-border rounded-md text-text-main font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
                    disabled={isGenerating || !isOnline}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isGenerating || !isOnline || !request.trim()}
                    className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                    <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating Guidance...' : 'Generate Guidance'}
                </button>
            </div>

            {guidance && (
                <div className="flex-1 mt-4 min-h-0">
                    <pre className="w-full h-full bg-surface-alt p-4 rounded-lg text-text-main font-mono text-sm overflow-auto border border-border">
                        <code>{guidance}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ApiKeyGuidancePanel;
