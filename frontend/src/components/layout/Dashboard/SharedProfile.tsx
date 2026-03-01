import type { ReactNode } from 'react';
import { User } from 'lucide-react';

interface SharedProfileProps {
    name: string;
    role: string;
    avatar?: ReactNode;
    stats?: { label: string; value: string }[];
    children?: ReactNode;
}

const SharedProfile = ({ name, role, avatar, stats, children }: SharedProfileProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8 pb-8 border-b border-gray-100">
                <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 ring-4 ring-gray-100 overflow-hidden text-gray-500 shadow-inner">
                    {avatar || <User className="w-16 h-16" />}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{name}</h2>
                <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100 mb-4">{role}</span>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {children && (
                <div className="space-y-8">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SharedProfile;
