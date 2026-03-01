import { Briefcase, DollarSign, Code, Filter, CheckSquare } from 'lucide-react';

interface FilterCheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

const FilterCheckbox = ({ label, checked }: FilterCheckboxProps) => (
    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
            {checked && <CheckSquare className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
    </label>
);

const AdvancedFiltersSidebar = () => {
    return (
        <div className="w-full lg:w-72 shrink-0 space-y-6 hidden lg:block animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Advanced Filters</h3>
                </div>

                <div className="p-5 space-y-6">
                    {/* Job Type Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                            <Briefcase className="w-4 h-4 text-slate-400" /> Job Type
                        </div>
                        <div className="space-y-1">
                            <FilterCheckbox label="Remote" checked={true} onChange={() => {}} />
                            <FilterCheckbox label="Hybrid" checked={false} onChange={() => {}} />
                            <FilterCheckbox label="On-site" checked={false} onChange={() => {}} />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Salary/Stipend Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                            <DollarSign className="w-4 h-4 text-slate-400" /> Target Compensation
                        </div>
                        <div className="space-y-1">
                            <FilterCheckbox label="$0 - $50k" checked={false} onChange={() => {}} />
                            <FilterCheckbox label="$50k - $100k" checked={true} onChange={() => {}} />
                            <FilterCheckbox label="$100k - $150k" checked={false} onChange={() => {}} />
                            <FilterCheckbox label="$150k+" checked={false} onChange={() => {}} />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Skills Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                            <Code className="w-4 h-4 text-slate-400" /> Required Skills
                        </div>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            <FilterCheckbox label="React" checked={true} onChange={() => {}} />
                            <FilterCheckbox label="TypeScript" checked={true} onChange={() => {}} />
                            <FilterCheckbox label="Node.js" checked={false} onChange={() => {}} />
                            <FilterCheckbox label="Python" checked={false} onChange={() => {}} />
                            <FilterCheckbox label="AWS" checked={false} onChange={() => {}} />
                            <FilterCheckbox label="Docker" checked={false} onChange={() => {}} />
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        Apply Filters
                    </button>
                    <button className="w-full mt-2 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFiltersSidebar;
