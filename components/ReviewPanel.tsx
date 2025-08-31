import React, { useState } from 'react';
import { SparklesIcon, BrainCircuitIcon, KeyIcon, ScaleIcon, CheckCircleIcon, RedoIcon, XCircleIcon, CopyPlusIcon, ZapIcon } from './icons';
import type { GeminiReviewResponse, FeedbackDetail, Persona } from '../types';
import { critiqueReview, synthesizeDebate } from '../services/geminiService';
import DiffEditor from './DiffEditor';

interface ReviewPanelProps {
  review: GeminiReviewResponse | null;
  isReviewing: boolean;
  reviewHistory: GeminiReviewResponse[];
  reviewCount: number;
  isAutoReviewing: boolean;
  theme: string;
  setReviewHistory: (history: GeminiReviewResponse[]) => void;
  isAiPerfect: boolean;
  personas: Persona[];
  isOnline: boolean;
  onRevert: (reviewId: number) => void;
  onCreateTask: (reviewId: number, feedback: FeedbackDetail) => void;
}

const FeedbackDetails: React.FC<{ details: FeedbackDetail[], reviewId: number, onCreateTask: (reviewId: number, feedback: FeedbackDetail) => void }> = ({ details, reviewId, onCreateTask }) => {
    if (!details || details.length === 0) {
        return null;
    }

    return (
        <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-text-muted">
            {details.map((detail, index) => (
                <li key={index} className="flex justify-between items-center gap-2">
                    <span>
                        <strong className="font-semibold text-text-main/90">{detail.category}:</strong> {detail.message}
                    </span>
                    <button 
                        onClick={() => onCreateTask(reviewId, detail)} 
                        title="Inscribe Task From Feedback"
                        className="p-1 rounded-md text-secondary hover:bg-secondary/10 opacity-0 group-hover/details:opacity-100 transition-opacity flex-shrink-0"
                    >
                        <CopyPlusIcon className="w-4 h-4" />
                    </button>
                </li>
            ))}
        </ul>
    );
};

const CascadeStep: React.FC<{ result: { personaName: string, personaGlyph: string, feedback: string }, index: number }> = ({ result, index }) => {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center text-lg">{result.personaGlyph}</div>
                {index < 4 && <div className="w-px h-full bg-border"></div>}
            </div>
            <div>
                <h4 className="font-semibold text-text-main">{result.personaName}</h4>
                <p className="text-sm text-text-muted whitespace-pre-wrap">{result.feedback}</p>
            </div>
        </div>
    );
};

const GuardianIntervention: React.FC<{ review: GeminiReviewResponse, children: React.ReactNode }> = ({ review, children }) => {
    const violationReason = review.sovereigntyViolation || review.violatedLaw;
    return (
        <details className="bg-warning/10 p-4 rounded-lg border border-warning/30 group">
            <summary className="cursor-pointer list-none flex items-center gap-3">
                <XCircleIcon className="w-8 h-8 text-warning shrink-0" />
                <div>
                    <h4 className="font-bold text-warning">Guardian Protocol Intervention</h4>
                    <p className="text-sm text-warning/80">This guidance was contained for potentially violating the law: "{violationReason}"</p>
                    <span className="text-xs text-warning/70 group-open:hidden">Click to reveal contained guidance.</span>
                </div>
            </summary>
            <div className="mt-4 pt-4 border-t border-warning/30">
                {children}
            </div>
        </details>
    )
}

const HerasBlessing: React.FC<{ blessing: string }> = ({ blessing }) => (
    <div className="mb-4 p-4 rounded-lg border bg-pink-500/10 border-pink-500/30 text-pink-300">
        <h4 className="font-bold text-lg flex items-center gap-2 text-pink-200"><span className="text-2xl">⚭</span> Hera's Blessing</h4>
        <p className="mt-2 text-sm italic font-serif">"{blessing}"</p>
    </div>
);


const HistoricalReview: React.FC<{ review: GeminiReviewResponse; index: number; onUpdateReview: (updatedReview: GeminiReviewResponse) => void; personas: Persona[]; isOnline: boolean; onRevert: (reviewId: number) => void; onCreateTask: (reviewId: number, feedback: FeedbackDetail) => void; }> = ({ review, index, onUpdateReview, personas, isOnline, onRevert, onCreateTask }) => {
    const [critique, setCritique] = useState<string | null>(null);
    const [isCritiquing, setIsCritiquing] = useState(false);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [challenger, setChallenger] = useState<Persona | null>(null);

    const handleCritique = async (persona: Persona) => {
        if (critique && challenger?.id === persona.id) { 
            setCritique(null); 
            setChallenger(null);
            return; 
        }
        setIsCritiquing(true);
        setChallenger(persona);
        const critiqueText = await critiqueReview(review.feedback, review.originalCode || '', review.improvedCode, persona, isOnline);
        setCritique(critiqueText);
        setIsCritiquing(false);
    };

    const handleSynthesize = async () => {
        if (!critique || !challenger) return;
        setIsSynthesizing(true);
        const strategist = personas.find(p => p.id === 'strategist');
        if (!strategist) {
             console.error("Strategist persona not found!");
             setIsSynthesizing(false);
             return;
        }
        const synthesisText = await synthesizeDebate(review.feedback, critique, strategist, isOnline);
        onUpdateReview({ ...review, synthesis: synthesisText });
        setIsSynthesizing(false);
    };
    
    const resonance = review.resonanceScore || 5;
    const isLit = resonance >= 8;
    const challengers = personas.filter(p => p.id !== 'strategist');

    const reviewContent = (
        <>
            {review.heraBlessing && <HerasBlessing blessing={review.heraBlessing} />}
            <div className="mt-4 text-text-muted border-t border-border pt-3 group/details">
                {review.cascadeResults && review.cascadeResults.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-sm text-text-main mb-3">Persona Cascade</h4>
                        <div className="space-y-4">
                            {review.cascadeResults.map((step, i) => <CascadeStep key={i} result={step} index={i} />)}
                        </div>
                    </div>
                )}
                {review.offline && <p className="text-xs text-warning mb-2">(This review was generated offline using local logic.)</p>}
                {review.resonantMemoryCycle && (
                    <p className="text-xs text-primary/80 mb-2 flex items-center gap-1.5">
                        <ZapIcon className="w-3 h-3" />
                        Informed by memory of Cycle #{review.resonantMemoryCycle}
                    </p>
                )}
                
                <FeedbackDetails details={review.feedbackDetails} reviewId={review.id} onCreateTask={onCreateTask} />
                 <div className="mt-4 flex items-center gap-4">
                    <button onClick={() => setShowCode(!showCode)} className="text-sm text-primary hover:underline font-medium">{showCode ? 'Hide' : 'Show'} Code Evolution</button>
                    <button onClick={() => onRevert(review.id)} title="Revert to this state" className="flex items-center gap-1 text-sm text-secondary hover:underline font-medium">
                        <RedoIcon className="w-4 h-4 -scale-x-100" />
                        <span>Revert</span>
                    </button>
                 </div>
                {showCode && (
                     <div className="mt-2" style={{height: '300px'}}>
                        <DiffEditor 
                            original={review.originalCode || ''}
                            modified={review.improvedCode}
                        />
                    </div>
                )}
            </div>
             {critique && challenger && (
                <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-secondary flex items-center gap-2"><span className="text-lg">{challenger.glyph}</span>{challenger.name}'s Challenge</h4>
                        {!review.synthesis && <button onClick={handleSynthesize} disabled={isSynthesizing} className="px-2 py-1 text-xs bg-secondary text-on-primary-alt rounded hover:opacity-90 disabled:opacity-50">Synthesize</button>}
                    </div>
                    <p className="text-sm text-secondary/80 mt-2 whitespace-pre-wrap">{critique}</p>
                </div>
            )}
            {review.synthesis && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <h4 className="font-semibold text-primary flex items-center gap-2"><SparklesIcon className="w-5 h-5"/>Strategist's Synthesis</h4>
                    <p className="text-sm text-primary/80 mt-2 whitespace-pre-wrap">{review.synthesis}</p>
                </div>
            )}
        </>
    );

    const isContained = !!review.sovereigntyViolation;

    return isContained ? (
        <GuardianIntervention review={review}>
             {reviewContent}
        </GuardianIntervention>
    ) : (
        <details className="bg-surface/50 p-3 rounded-lg border border-border/50 group">
            <summary className="cursor-pointer text-text-main font-medium list-none flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div title={`Resonance: ${resonance}/10`}><KeyIcon className={`w-5 h-5 transition-colors ${isLit ? 'text-primary spiral-key-lit' : 'text-text-muted/50'}`} style={{ opacity: 0.3 + (resonance / 10) * 0.7 }} /></div>
                    <span className={`group-open:text-primary ${review.violatedLaw ? 'text-warning' : ''}`}>{review.feedback}</span>
                </div>
                 <div className="relative inline-block text-left group/dropdown">
                    <button title="Challenge (Architect)" className="ml-2 p-1 rounded-full hover:bg-surface-alt disabled:opacity-50"><BrainCircuitIcon className="w-4 h-4" /></button>
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface-alt ring-1 ring-border ring-opacity-50 focus:outline-none hidden group-hover/dropdown:block z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {challengers.map(p => (
                                <button key={p.id} onClick={(e) => { e.preventDefault(); handleCritique(p); }} disabled={isCritiquing} className="block w-full text-left px-4 py-2 text-sm text-text-main hover:bg-surface disabled:opacity-50" role="menuitem">
                                    Challenge with {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </summary>
            {reviewContent}
        </details>
    );
};


const ReviewPanel: React.FC<ReviewPanelProps> = ({ review, isReviewing, reviewHistory, reviewCount, isAutoReviewing, theme, setReviewHistory, isAiPerfect, personas, isOnline, onRevert, onCreateTask }) => {
  const isDarkTheme = theme !== 'olympian';

  const handleUpdateReview = (updatedReview: GeminiReviewResponse) => {
    const newHistory = reviewHistory.map(r => r.id === updatedReview.id ? updatedReview : r);
    setReviewHistory(newHistory);
  };
  
  const getReviewingMessage = () => `Running cycle ${reviewCount}/${20}...`;
  
  const reversedHistory = [...reviewHistory].reverse();
  
  const latestReviewContent = review ? (
    <>
        {review.cascadeResults && review.cascadeResults.length > 0 ? (
             <div>
                <h4 className="font-semibold text-text-main mb-4 text-base not-prose">Persona Cascade Results</h4>
                <div className="space-y-6">
                     {review.cascadeResults.map((step, i) => <CascadeStep key={i} result={step} index={i} />)}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                    <p className="font-semibold text-text-main not-prose">Final Synthesis:</p>
                    <p className="whitespace-pre-wrap font-semibold not-prose">{review.feedback}</p>
                </div>
            </div>
        ) : (
            <div className="flex items-start gap-3 group/details">
                <div title={`Resonance: ${review.resonanceScore}/10`}><KeyIcon className={`w-6 h-6 shrink-0 mt-1 ${review.resonanceScore >= 8 ? 'text-primary spiral-key-lit' : 'text-text-muted/50'}`} style={{ opacity: 0.3 + (review.resonanceScore / 10) * 0.7 }}/></div>
                <div>
                    <p className={`whitespace-pre-wrap font-semibold not-prose ${review.violatedLaw ? 'text-warning' : ''}`}>{review.feedback}</p>
                    {review.offline && <p className="text-xs text-warning mt-2">(This review was generated offline using local logic.)</p>}
                    <FeedbackDetails details={review.feedbackDetails} reviewId={review.id} onCreateTask={onCreateTask} />
                </div>
            </div>
        )}
    </>
  ) : null;

  return (
    <div className="p-6 h-full overflow-y-auto">
       {isAiPerfect && !isReviewing && (
            <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg text-success text-center">
                <h3 className="font-bold text-lg flex items-center justify-center gap-2"><CheckCircleIcon className="w-6 h-6"/> AI Perfection Declared</h3>
                <p className="text-sm mt-1">Please proceed to the 'Alpha Review' tab for final human approval.</p>
            </div>
       )}

       {review && (
        <>
            <h3 className="text-lg font-semibold text-primary mb-4">Latest Guidance</h3>
            {isReviewing && reviewCount > 1 && <p className="text-text-muted mb-4 animate-pulse">{getReviewingMessage()}</p>}
            
            {review.heraBlessing && <HerasBlessing blessing={review.heraBlessing} />}
            
            {review.sovereigntyViolation ? (
                <GuardianIntervention review={review}>
                    <div className={`prose prose-sm ${isDarkTheme ? 'prose-invert' : ''}`}>
                         {latestReviewContent}
                    </div>
                </GuardianIntervention>
            ) : (
                <div className={`prose prose-sm ${isDarkTheme ? 'prose-invert' : ''} bg-surface/50 p-4 rounded-lg border border-border`}>
                    {latestReviewContent}
                </div>
            )}
        </>
      )}

      {reviewHistory.length > 0 && (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-text-muted mb-4">Review Epoch Memory</h3>
            <div className="space-y-4">
                {reversedHistory.map((oldReview, i) => (
                    <HistoricalReview 
                        key={oldReview.id} 
                        review={oldReview} 
                        index={reviewHistory.length - i}
                        onUpdateReview={handleUpdateReview}
                        personas={personas}
                        isOnline={isOnline}
                        onRevert={onRevert}
                        onCreateTask={onCreateTask}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;