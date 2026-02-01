
import { ArrowRight, MapPin, Clock, DollarSign, Star, Briefcase } from 'lucide-react';
import clsx from 'clsx';

const iconMap: any = {
    MapPin, Clock, DollarSign, Star, Briefcase
};

const Card = ({ badge, title, subtitle, details, cta, color }: any) => {
    const colorStyles = {
        blue: { badge: 'bg-blue-100 text-blue-700', btn: 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50' },
        teal: { badge: 'bg-teal-100 text-teal-700', btn: 'bg-white border-teal-600 text-teal-600 hover:bg-teal-50' },
        orange: { badge: 'bg-orange-100 text-orange-700', btn: 'bg-white border-orange-600 text-orange-600 hover:bg-orange-50' },
        purple: { badge: 'bg-purple-100 text-purple-700', btn: 'bg-white border-purple-600 text-purple-600 hover:bg-purple-50' }
    };

    const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border border-slate-100 group-hover:scale-110 transition-transform duration-300", style.badge.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-'))}>
                         {title.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">{title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
                    </div>
                </div>
                {badge && <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 shadow-sm", style.badge.replace('bg-', 'bg-opacity-50 bg-'))}>{badge}</span>}
            </div>
            
            <div className="space-y-3 mb-6 flex-grow relative z-10">
                {details.map((detail: any, idx: number) => {
                    const Icon = iconMap[detail.icon] || MapPin;
                    return (
                        <div key={idx} className="flex items-center text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span className="ml-2 font-medium">{detail.text}</span>
                        </div>
                    );
                })}
            </div>

            <button className="w-full py-3 rounded-xl font-semibold bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 mt-auto shadow-sm hover:shadow-md relative z-10">
                {cta} <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Card;
