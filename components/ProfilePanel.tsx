import React, { useState, useEffect } from 'react';
import type { UserProfile, Theme } from '../types';
import ThemeSelector from './ThemeSelector';
import { UserIcon } from './icons';

interface ProfilePanelProps {
    profile: UserProfile;
    onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultAvatars = [
    'https://source.boringavatars.com/beam/120/Maria%20Mitchell?colors=264653,2a9d8f,e9c46a,f4a261,e76f51',
    'https://source.boringavatars.com/marble/120/Margaret%20Hamilton?colors=264653,2a9d8f,e9c46a,f4a261,e76f51',
    'https://source.boringavatars.com/pixel/120/Grace%20Hopper?colors=264653,2a9d8f,e9c46a,f4a261,e76f51',
    'https://source.boringavatars.com/sunset/120/Hedy%20Lamarr?colors=264653,2a9d8f,e9c46a,f4a261,e76f51',
    'https://source.boringavatars.com/ring/120/Ada%20Lovelace?colors=264653,2a9d8f,e9c46a,f4a261,e76f51',
];

const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, onUpdateProfile }) => {
    const [localProfile, setLocalProfile] = useState(profile);

    useEffect(() => {
        setLocalProfile(profile);
    }, [profile]);

    const handleSave = () => {
        onUpdateProfile(localProfile);
    };

    const handleThemeChange = (theme: Theme) => {
        setLocalProfile(prev => ({ ...prev, theme }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: value }));
    }
    
    const isChanged = JSON.stringify(localProfile) !== JSON.stringify(profile);

    return (
        <div className="h-full p-6 overflow-y-auto space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" /> Sovereign Profile
                </h3>
                <p className="text-sm text-text-muted">
                    Customize your identity within the PraxisOS. Changes are saved locally.
                </p>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-surface-alt/50 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-text-main mb-3">Identity</h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="displayName" className="text-sm font-medium text-text-muted">Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={localProfile.displayName}
                                onChange={handleInputChange}
                                className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="avatar" className="text-sm font-medium text-text-muted">Avatar URL</label>
                            <input
                                type="text"
                                id="avatar"
                                name="avatar"
                                value={localProfile.avatar}
                                onChange={handleInputChange}
                                placeholder="https://..."
                                className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                             <p className="text-sm font-medium text-text-muted mb-2">Or select a default</p>
                             <div className="flex gap-2">
                                {defaultAvatars.map(url => (
                                    <button key={url} onClick={() => setLocalProfile(p => ({...p, avatar: url}))} className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${localProfile.avatar === url ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                                        <img src={url} alt="Default avatar option" className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-alt/50 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-text-main mb-3">Preferences</h4>
                     <ThemeSelector currentTheme={localProfile.theme} onThemeChange={handleThemeChange} />
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button 
                    onClick={() => setLocalProfile(profile)}
                    disabled={!isChanged}
                    className="px-4 py-2 text-sm font-semibold text-text-muted bg-surface-alt hover:bg-border rounded-lg disabled:opacity-50"
                >
                    Reset
                </button>
                 <button 
                    onClick={handleSave}
                    disabled={!isChanged}
                    className="px-6 py-2 text-sm font-semibold text-on-primary bg-primary hover:bg-primary-hover rounded-lg shadow-md disabled:opacity-50"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfilePanel;