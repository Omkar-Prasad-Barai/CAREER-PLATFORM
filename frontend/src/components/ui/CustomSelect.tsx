import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

interface CustomSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
    className?: string;
}

export const CustomSelect = ({ value, onChange, options, placeholder = "Select an option", className }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value || options[0]?.value);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const actualValue = value !== undefined ? value : internalValue;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === actualValue);

    const handleSelect = (val: string) => {
        setInternalValue(val);
        if (onChange) onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={clsx("relative", className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm flex items-center justify-between transition-all"
            >
                <span className={!selectedOption ? "text-slate-400" : "truncate pr-2"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={clsx("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSelect(option.value);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center justify-between"
                                >
                                    <span className="truncate">{option.label}</span>
                                    {actualValue === option.value && <Check className="w-4 h-4 text-indigo-600 ml-2" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
