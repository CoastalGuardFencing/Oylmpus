import React, { useState } from 'react';
import type { SystemLaw, GlyphMap, Glyph, Persona, ManifestDocument } from '../types';
import SystemLawComposer from './SystemLawComposer';
import { BookOpenIcon, Wand2Icon } from './icons';
import * as LORE from '../config/lore';
import { ApprovalButton } from './ApprovalButton';

interface ConstitutionPanelProps {
    systemLaws: SystemLaw[];
    setSystemLaws: (laws: SystemLaw[]) => void;
    glyphMap: GlyphMap;
    setGlyphMap: (map: GlyphMap) => void;
    disabled?: boolean;
    isOnline: boolean;
    approvedLore: string[];
    onApproveLore: (manifestTitle: string) => void;
}

const GlyphEditor: React.FC<{glyphMap: GlyphMap, setGlyphMap: (map: GlyphMap) => void, disabled?: boolean}> = ({ glyphMap, setGlyphMap, disabled }) => {
    const [newState, setNewState] = useState('');
    const [newGlyph, setNewGlyph] = useState<Glyph>({name: '', symbol: '', description: ''});
    
    const handleAdd = () => {
        if (newState && newGlyph.name && newGlyph.symbol && newGlyph.description) {
            setGlyphMap({ ...glyphMap, [newState]: newGlyph });
            setNewState('');
            setNewGlyph({name: '', symbol: '', description: ''});
        }
    }
    
    return (
        <div className="space-y-2 p-3 bg-surface-alt/50 border border-border rounded-lg h-full flex flex-col">
            <h4 className="font-semibold text-text-muted text-sm flex items-center gap-2"><Wand2Icon className="w-4 h-4" /> Authorship Sovereignty Engine</h4>
             <div className="grid grid-cols-2 gap-2 text-xs flex-1 overflow-y-auto pr-2">
                {Object.entries(glyphMap).map(([state, glyph]) => (
                    <div key={state} className="p-2 bg-surface rounded h-fit">
                        <span className="text-lg mr-2">{glyph.symbol}</span>
                        <strong>{state}</strong>: {glyph.name}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-border mt-auto">
                <input value={newState} onChange={e => setNewState(e.target.value)} placeholder="New Emotional State (e.g., 'Sovereignty')" className="w-full bg-surface-alt border border-border rounded px-2 py-1 text-sm"/>
                <input value={newGlyph.symbol} onChange={e => setNewGlyph({...newGlyph, symbol: e.target.value})} placeholder="Symbol (e.g., 👑)" className="w-full bg-surface-alt border border-border rounded px-2 py-1 text-sm"/>
                <input value={newGlyph.name} onChange={e => setNewGlyph({...newGlyph, name: e.target.value})} placeholder="Glyph Name (e.g., 'Crown of Dominion')" className="w-full bg-surface-alt border border-border rounded px-2 py-1 text-sm"/>
                <input value={newGlyph.description} onChange={e => setNewGlyph({...newGlyph, description: e.target.value})} placeholder="Description" className="w-full bg-surface-alt border border-border rounded px-2 py-1 text-sm"/>
                <button onClick={handleAdd} disabled={disabled} className="px-3 py-1 bg-primary text-on-primary text-sm font-semibold rounded-md disabled:opacity-50">Inscribe Glyph</button>
            </div>
        </div>
    )
}

const ManifestDisplayCard: React.FC<{ doc: ManifestDocument, isApproved: boolean, onApprove: () => void, emotionalState: string }> = ({ doc, isApproved, onApprove, emotionalState }) => {
    const { title, manifest } = doc;
    const manifestEmotionalState = manifest.emotionalState || "Unknown";
    
    return (
        <div className="p-4 bg-surface-alt/50 rounded-lg border border-border/50 flex flex-col">
            <h4 className="font-bold text-primary text-base">{title}</h4>
            <p className="text-xs text-text-muted mt-1">
                <span className="font-semibold">Glyphs:</span> {(manifest.glyphs || []).join(', ')} | <span className="font-semibold">State:</span> {manifestEmotionalState}
            </p>
            <details className="mt-2 flex-1">
                <summary className="cursor-pointer text-secondary/80 hover:text-secondary text-xs font-semibold">View Declaration</summary>
                <p className="mt-2 text-sm italic whitespace-pre-wrap font-serif text-text-main/90">"{manifest.declaration || manifest.manifest}"</p>
            </details>
            <div className="mt-3 pt-3 border-t border-border/50 text-center">
                 <ApprovalButton 
                    manifestId={title}
                    glyph={manifest.glyphs ? manifest.glyphs[0] : ''}
                    emotionalState={emotionalState}
                    onApprove={onApprove}
                    isApproved={isApproved}
                 />
            </div>
        </div>
    );
};

const allManifests: ManifestDocument[] = Object.entries(LORE).map(([key, value]) => ({
    title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    manifest: value
})).reverse();

const ConstitutionPanel: React.FC<ConstitutionPanelProps> = ({ systemLaws, setSystemLaws, glyphMap, setGlyphMap, disabled, isOnline, approvedLore, onApproveLore }) => {
    const [glyphFilter, setGlyphFilter] = useState('all');
    const [stateFilter, setStateFilter] = useState('all');

    const allGlyphs = [...new Set(allManifests.flatMap(doc => doc.manifest.glyphs || []))];
    const allStates = [...new Set(allManifests.map(doc => doc.manifest.emotionalState).filter(Boolean))];

    const filteredManifests = allManifests.filter(doc => {
        const glyphMatch = glyphFilter === 'all' || (doc.manifest.glyphs || []).includes(glyphFilter);
        const stateMatch = stateFilter === 'all' || doc.manifest.emotionalState === stateFilter;
        return glyphMatch && stateMatch;
    });

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <BookOpenIcon className="w-5 h-5" /> Manifest Ledger
                </h3>
                <div className="space-y-4">
                   <div className="flex gap-2 items-center bg-surface-alt/50 p-2 rounded-lg border border-border">
                        <span className="text-xs font-semibold text-text-muted">Filter by:</span>
                        <select value={glyphFilter} onChange={e => setGlyphFilter(e.target.value)} className="bg-surface border border-border rounded px-2 py-1 text-xs">
                            <option value="all">All Glyphs</option>
                            {allGlyphs.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="bg-surface border border-border rounded px-2 py-1 text-xs">
                             <option value="all">All States</option>
                             {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 pb-2">
                     {filteredManifests.map(item => (
                        <ManifestDisplayCard 
                            key={item.title} 
                            doc={item}
                            isApproved={approvedLore.includes(item.title)}
                            onApprove={() => onApproveLore(item.title)}
                            emotionalState={item.manifest.emotionalState}
                        />
                    ))}
                   </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SystemLawComposer laws={systemLaws} setLaws={setSystemLaws} disabled={disabled} isOnline={isOnline} />
                <GlyphEditor glyphMap={glyphMap} setGlyphMap={setGlyphMap} disabled={disabled} />
            </div>
        </div>
    );
};

export default ConstitutionPanel;