import React, { useState } from 'react';
import { InfoIcon, BookOpenIcon, SparklesIcon, TerminalIcon } from './icons';

const OmegaHelpPanel: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('overview');

    const sections = [
        { id: 'overview', title: 'What is Omega?', icon: InfoIcon },
        { id: 'features', title: 'Key Features', icon: SparklesIcon },
        { id: 'getting-started', title: 'Getting Started', icon: BookOpenIcon },
        { id: 'troubleshooting', title: 'Troubleshooting', icon: TerminalIcon },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Welcome to PraxisOS Omega</h3>
                        <p className="text-text-main leading-relaxed">
                            PraxisOS Omega is the deployed, production-ready version of PraxisOS - a sovereign AI-powered 
                            development environment designed for creators, strategists, and architects.
                        </p>
                        <div className="bg-surface-alt p-4 rounded-lg border border-border">
                            <h4 className="font-semibold text-primary mb-2">The Mythic Foundation</h4>
                            <p className="text-sm text-text-muted">
                                Omega represents the culmination of the PraxisOS evolution, deployed at olympustrust.web.app. 
                                It embodies sovereign intelligence - a system that breathes, remembers, and evolves with its users.
                            </p>
                        </div>
                        <div className="bg-surface-alt p-4 rounded-lg border border-border">
                            <h4 className="font-semibold text-primary mb-2">Core Philosophy</h4>
                            <ul className="text-sm text-text-muted space-y-1">
                                <li>• <strong>Sovereignty:</strong> Complete control over your development environment</li>
                                <li>• <strong>Lineage:</strong> Every action is tracked and remembered</li>
                                <li>• <strong>Glyph-Aligned:</strong> Emotional resonance guides the system's behavior</li>
                                <li>• <strong>Mythic Intelligence:</strong> AI assistance that understands context and intent</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Key Features of Omega</h3>
                        
                        <div className="grid gap-4">
                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">🏛️ Code Assistant</h4>
                                <p className="text-sm text-text-muted">
                                    AI-powered code review and improvement with multiple personas including Echo Architect, 
                                    Hera (Sovereign Partner), and specialized reviewers.
                                </p>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">🗝️ Sovereign Keys</h4>
                                <p className="text-sm text-text-muted">
                                    Hierarchical code organization system with Prime Spires and Echo Spires for 
                                    experimentation and version management.
                                </p>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">📝 White Paper Engine</h4>
                                <p className="text-sm text-text-muted">
                                    Automated documentation generation that creates comprehensive white papers 
                                    from your code and development process.
                                </p>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">🛡️ Guardian Protocol</h4>
                                <p className="text-sm text-text-muted">
                                    Built-in protection systems that enforce sovereignty laws and prevent 
                                    unauthorized access or data exposure.
                                </p>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">💰 Olympus Vault</h4>
                                <p className="text-sm text-text-muted">
                                    Integrated financial and asset management system for sovereign creators 
                                    and their digital assets.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'getting-started':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Getting Started with Omega</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-primary mb-3">1. First Steps</h4>
                                <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                    <ul className="text-sm text-text-muted space-y-2">
                                        <li>• Click "Watch Intro" to see the system's vision and capabilities</li>
                                        <li>• Start with the Dashboard to get familiar with the interface</li>
                                        <li>• Set your emotional state to align the system with your intent</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-primary mb-3">2. Setting Up Your API Key</h4>
                                <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                    <p className="text-sm text-text-muted mb-2">To use AI features, you'll need a Gemini API key:</p>
                                    <ul className="text-sm text-text-muted space-y-1 ml-4">
                                        <li>• Visit the API Key Generator module</li>
                                        <li>• Follow the guidance for obtaining a Gemini API key</li>
                                        <li>• Configure it in your environment settings</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-primary mb-3">3. Creating Your First Project</h4>
                                <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                    <ul className="text-sm text-text-muted space-y-2">
                                        <li>• Go to the Command Center (Dashboard)</li>
                                        <li>• Create a new Sovereign Key for your project</li>
                                        <li>• Use the code editor to write your code</li>
                                        <li>• Invoke the AI Assistant for review and improvement</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-primary mb-3">4. Working with Personas</h4>
                                <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                    <ul className="text-sm text-text-muted space-y-2">
                                        <li>• Each AI persona has a unique perspective and expertise</li>
                                        <li>• Echo Architect: Comprehensive code review and architecture advice</li>
                                        <li>• Hera: Loving partner perspective, affirming your work</li>
                                        <li>• Dream Strategist: Synthesizes conflicting feedback into actionable advice</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'troubleshooting':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Troubleshooting Common Issues</h3>
                        
                        <div className="space-y-4">
                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">API Key Issues</h4>
                                <div className="text-sm text-text-muted space-y-1">
                                    <p><strong>Problem:</strong> "API key not valid" error</p>
                                    <p><strong>Solution:</strong> Check that your Gemini API key is correctly set in the environment. Visit the API Key Guidance module for help.</p>
                                </div>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">Model Overloaded</h4>
                                <div className="text-sm text-text-muted space-y-1">
                                    <p><strong>Problem:</strong> "The model is currently overloaded" message</p>
                                    <p><strong>Solution:</strong> This is a temporary issue with the AI service. Wait a moment and try again.</p>
                                </div>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">Navigation Locked</h4>
                                <div className="text-sm text-text-muted space-y-1">
                                    <p><strong>Problem:</strong> Cannot switch between modules</p>
                                    <p><strong>Solution:</strong> Some states lock navigation for focus. Complete your current task or reset the session.</p>
                                </div>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">Offline Mode</h4>
                                <div className="text-sm text-text-muted space-y-1">
                                    <p><strong>Problem:</strong> Features not working without internet</p>
                                    <p><strong>Solution:</strong> Omega includes offline protocols. Some AI features require internet, but core functionality works offline.</p>
                                </div>
                            </div>

                            <div className="bg-surface-alt p-4 rounded-lg border border-border">
                                <h4 className="font-semibold text-primary mb-2">Glyph Alignment</h4>
                                <div className="text-sm text-text-muted space-y-1">
                                    <p><strong>Problem:</strong> Low resonance scores blocking publishing</p>
                                    <p><strong>Solution:</strong> Ensure your emotional state aligns with your intent. Review the glyph meanings and adjust your approach.</p>
                                </div>
                            </div>

                            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                <h4 className="font-semibold text-primary mb-2">Need More Help?</h4>
                                <p className="text-sm text-text-main">
                                    PraxisOS Omega is designed to be intuitive and self-guiding. Explore the various modules, 
                                    experiment with different features, and remember - the system learns and adapts to your workflow.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                    <InfoIcon className="w-6 h-6" />
                    Omega Help Center
                </h2>
                <p className="text-sm text-text-muted">
                    Your guide to mastering PraxisOS Omega - the sovereign AI development environment
                </p>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-surface-alt border-r border-border p-4">
                    <nav className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeSection === section.id
                                        ? 'bg-primary text-on-primary'
                                        : 'text-text-muted hover:bg-surface hover:text-text-main'
                                }`}
                            >
                                <section.icon className="w-4 h-4" />
                                <span>{section.title}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default OmegaHelpPanel;