import React from 'react';
import { SunIcon, MoonIcon, StarIcon, BrainCircuitIcon } from './icons';

type Theme = 'cyber-monastery' | 'olympian' | 'dream-forge' | 'aetherium';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  disabled?: boolean;
}

const themes: { id: Theme; name: string; icon: React.ReactNode }[] = [
  { id: 'cyber-monastery', name: 'Cyber', icon: <MoonIcon className="w-5 h-5" /> },
  { id: 'olympian', name: 'Olympian', icon: <SunIcon className="w-5 h-5" /> },
  { id: 'dream-forge', name: 'Dream', icon: <StarIcon className="w-5 h-5" /> },
  { id: 'aetherium', name: 'Aetherium', icon: <BrainCircuitIcon className="w-5 h-5" /> },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange, disabled }) => {
  return (
    <div className="flex items-center gap-1 bg-surface-alt p-1 rounded-lg border border-border">
      {themes.map(theme => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          disabled={disabled}
          title={theme.name}
          aria-pressed={currentTheme === theme.id}
          className={`flex-1 flex justify-center items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
            currentTheme === theme.id
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-text-muted hover:bg-surface hover:text-text-main'
          }`}
        >
          {theme.icon}
          <span className="hidden sm:inline">{theme.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;