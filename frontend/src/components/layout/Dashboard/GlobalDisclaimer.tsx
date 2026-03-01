import { ShieldAlert } from 'lucide-react';

const GlobalDisclaimer = () => {
    return (
        <div className="mt-12 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-amber-800 dark:text-amber-200 shadow-sm backdrop-blur-sm">
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm leading-relaxed text-center sm:text-left">
                <strong className="font-semibold block mb-0.5">Trust & Safety Disclaimer</strong>
                CareerConnect acts solely as a platform to connect seekers and facilitators. Please independently verify all organizations, profiles, and opportunities before committing. We do not guarantee the authenticity of every listing or user.
            </div>
        </div>
    );
};

export default GlobalDisclaimer;
