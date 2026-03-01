import { useState, useEffect, useCallback } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCompensation: string[];
  setSelectedCompensation: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  onApply: () => void;
  onClear: () => void;
}

const OPPORTUNITY_TYPES = ['Internship', 'Full-time', 'Part-time', 'Contract', 'Freelance'];
const COMPENSATION_OPTIONS = ['Paid', 'Unpaid', 'Negotiable'];

const FilterDrawer = ({
  isOpen,
  onClose,
  selectedTypes,
  setSelectedTypes,
  selectedCompensation,
  setSelectedCompensation,
  selectedSkills,
  setSelectedSkills,
  onApply,
  onClear,
}: FilterDrawerProps) => {
  const [skillInput, setSkillInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const toggleFilter = useCallback((
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }, []);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const handleClear = () => {
    onClear();
  };

  const activeFilterCount = selectedTypes.length + selectedCompensation.length + selectedSkills.length;

  // ── Filter Content (shared between desktop & mobile) ──
  const filterContent = (
    <>
      {/* Section 1 — Opportunity Type */}
      <div className="border-b border-slate-200 pb-5 mb-5">
        <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">
          Opportunity Type
        </label>
        <div className="space-y-2">
          {OPPORTUNITY_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group min-h-[44px] md:min-h-0">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                className="w-5 h-5 md:w-4 md:h-4 rounded border-slate-300 bg-white accent-indigo-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-200">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 2 — Compensation */}
      <div className="border-b border-slate-200 pb-5 mb-5">
        <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">
          Compensation
        </label>
        <div className="space-y-2">
          {COMPENSATION_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group min-h-[44px] md:min-h-0">
              <input
                type="checkbox"
                checked={selectedCompensation.includes(option)}
                onChange={() => toggleFilter(option, selectedCompensation, setSelectedCompensation)}
                className="w-5 h-5 md:w-4 md:h-4 rounded border-slate-300 bg-white accent-indigo-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-200">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 3 — Skills */}
      <div className="pb-5">
        <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">
          Skills
        </label>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-3 py-3 md:py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
          />
        </div>
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1.5 text-xs shadow-sm shadow-indigo-100/50"
              >
                {skill}
                <button
                  onClick={() => setSelectedSkills((prev) => prev.filter((s) => s !== skill))}
                  className="text-indigo-400 hover:text-indigo-700 transition-colors p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // ── Footer Buttons (shared) ──
  const footerButtons = (
    <div className="p-4 md:p-6 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="flex-1 bg-slate-100 border border-[#1A1D23]/20 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl py-3 md:py-2.5 text-sm font-medium transition-all duration-200"
        >
          Clear All
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 md:py-2.5 text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════
  //  MOBILE: Bottom Sheet
  // ════════════════════════════════════════════════
  if (isMobile) {
    return (
      <>
        {/* Floating trigger button (visible when drawer is closed) */}
        {!isOpen && (
          <button
            onClick={() => {/* Parent controls isOpen via its own state */}}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 text-white 
              px-5 py-3 rounded-full shadow-lg shadow-indigo-300/50 flex items-center gap-2 
              hover:bg-indigo-700 transition-all duration-200"
            style={{ display: 'none' }} // Hidden — parent renders its own trigger
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-indigo-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />

        {/* Bottom Sheet Drawer */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-[#F5F4F0] rounded-t-3xl shadow-2xl 
            flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ maxHeight: '85vh' }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-[#1A1D23]/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-[#1A1D23]">Filters</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {filterContent}
          </div>

          {/* Sticky Footer */}
          {footerButtons}
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════
  //  DESKTOP: Right-Slide Panel
  // ════════════════════════════════════════════════
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 z-50 bg-gradient-to-b from-white to-slate-50 
          border-l border-slate-200 shadow-2xl shadow-slate-300/50 flex flex-col 
          transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Filters</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filterContent}
        </div>

        {/* Footer */}
        {footerButtons}
      </div>
    </>
  );
};

export default FilterDrawer;
