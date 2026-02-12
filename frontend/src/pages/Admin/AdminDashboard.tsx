import { Users, ShieldAlert, AlertOctagon, Sparkles, TrendingUp } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h2>
                    <p className="text-slate-500 text-sm mt-1">Real-time metrics and platform health.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    System Online
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users - Blue */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Total Users</p>
                            <h3 className="text-3xl font-bold text-slate-800">0</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 relative z-10">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>—</span>
                    </div>
                </div>

                {/* Pending Approvals - Amber */}
                <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.15)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-amber-700 text-sm font-medium mb-1 flex items-center gap-1.5">
                                Pending Approvals
                                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                            </p>
                            <h3 className="text-3xl font-bold text-amber-900">0</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200">
                            <ShieldAlert className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-amber-700 relative z-10">
                        <span>Requires immediate review</span>
                    </div>
                </div>

                {/* Flagged Spam - Red */}
                <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-rose-700 text-sm font-medium mb-1">Flagged Spam</p>
                            <h3 className="text-3xl font-bold text-rose-900">0</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                            <AlertOctagon className="w-6 h-6 text-rose-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-rose-600 relative z-10">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>—</span>
                    </div>
                </div>

                {/* Active Premium Subs - Purple/Gold */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 border border-indigo-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-indigo-200 text-sm font-medium mb-1">Premium Subs</p>
                            <h3 className="text-3xl font-bold text-white">0</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-800/50 flex items-center justify-center border border-indigo-500">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-indigo-300 relative z-10">
                        <span>—</span>
                    </div>
                </div>
            </div>

            {/* Platform Activity Chart Placeholder */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Platform Activity</h3>
                    <div className="w-40 z-20">
                        <CustomSelect 
                            options={[
                                { label: 'Last 7 Days', value: '7d' },
                                { label: 'Last 30 Days', value: '30d' },
                                { label: 'This Year', value: '1y' }
                            ]}
                        />
                    </div>
                </div>
                
                {/* Simulated Graph area */}
                <div className="h-72 w-full flex items-end justify-between gap-2 px-2 pb-2 border-b border-slate-100 relative">
                    {/* Y-axis markers */}
                    <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
                        <div className="w-full border-b border-slate-50 border-dashed">1000</div>
                        <div className="w-full border-b border-slate-50 border-dashed">750</div>
                        <div className="w-full border-b border-slate-50 border-dashed">500</div>
                        <div className="w-full border-b border-slate-50 border-dashed">250</div>
                        <div>0</div>
                    </div>
                    
                    {/* Bars simulating graph data */}
                    <div className="w-full h-full flex items-end justify-between gap-1 sm:gap-3 z-10 pl-8 pt-4">
                        {[0, 0, 0, 0, 0, 0, 0].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div 
                                    className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t-sm transition-all relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <div 
                                        className="absolute bottom-0 w-full bg-indigo-600 rounded-t-sm transition-all"
                                        style={{ height: `${height * 0.7}%` }}
                                    ></div>
                                    
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        Data: {height * 10}
                                    </div>
                                </div>
                                <span className="text-[10px] sm:text-xs text-slate-500">Day {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
