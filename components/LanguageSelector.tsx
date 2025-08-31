import React, { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (selected: string[]) => void;
  options: string[];
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguages, onChange, options, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (lang: string) => {
    const newSelection = selectedLanguages.includes(lang)
      ? selectedLanguages.filter(l => l !== lang)
      : [...selectedLanguages, lang];
    onChange(newSelection);
  };

  const getButtonLabel = () => {
    if (selectedLanguages.length === 0) return "Select Languages";
    if (selectedLanguages.length > 2) return `${selectedLanguages.length} languages selected`;
    return selectedLanguages.join(', ');
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-left text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-alt/50 disabled:cursor-not-allowed flex justify-between items-center"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{getButtonLabel()}</span>
        <svg className={`w-4 h-4 transition-transform text-text-muted ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-surface-alt border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul role="listbox" className="p-2">
            {options.map(lang => (
              <li key={lang} role="option" aria-selected={selectedLanguages.includes(lang)}>
                <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => handleSelect(lang)}
                    className="h-4 w-4 rounded bg-surface border-border text-primary focus:ring-primary"
                  />
                  <span className="text-text-main">{lang}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;