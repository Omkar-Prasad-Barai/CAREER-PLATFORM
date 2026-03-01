import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Building2, BookOpen, Briefcase, UserSearch, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
    { id: 'organization', label: 'ORGANIZATIONS', icon: Building2 },
    { id: 'professor', label: 'PROFESSORS', icon: BookOpen },
    { id: 'professional', label: 'PROFESSIONALS', icon: Briefcase },
    { id: 'recruiter', label: 'RECRUITERS', icon: UserSearch },
    { id: 'others', label: 'OTHERS', icon: Compass }
];

const roleStyles: Record<string, { border: string, icon: string, hoverText: string }> = {
    organization: { border: 'hover:border-emerald-400 hover:shadow-emerald-500/20', icon: 'text-emerald-600', hoverText: 'group-hover:text-emerald-600' },
    professor: { border: 'hover:border-orange-400 hover:shadow-orange-500/20', icon: 'text-orange-600', hoverText: 'group-hover:text-orange-600' },
    professional: { border: 'hover:border-indigo-400 hover:shadow-indigo-500/20', icon: 'text-indigo-600', hoverText: 'group-hover:text-indigo-600' },
    recruiter: { border: 'hover:border-teal-400 hover:shadow-teal-500/20', icon: 'text-teal-600', hoverText: 'group-hover:text-teal-600' },
    others: { border: 'hover:border-slate-400 hover:shadow-slate-500/20', icon: 'text-slate-600', hoverText: 'group-hover:text-slate-600' }
};

const FacilitatorsGrid = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-3/5 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-6 md:p-8 flex flex-col">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Career Facilitators</h3>
                <p className="text-sm text-slate-500">Providing career opportunities</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {ROLES.filter(r => !['recruiter', 'others'].includes(r.id)).map((role) => {
                    const styles = roleStyles[role.id];
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: Math.random() * 0.4 + 0.2 }}
                            key={role.id}
                            onClick={() => navigate(`/auth?role=${role.id}`)}
                            className={clsx(
                                "bg-white backdrop-blur-lg border border-white/50 shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center group w-full",
                                styles.border
                            )}
                        >
                            <role.icon className={clsx("w-8 h-8 mb-2 transition-transform group-hover:scale-110", styles.icon)} />
                            <span className={clsx("text-sm font-semibold text-slate-800 transition-colors text-center", styles.hoverText)}>
                                {role.label}
                            </span>
                        </motion.div>
                    )
                })}
                
                {/* Centered Last Row Items */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col sm:flex-row justify-center gap-6">
                    {ROLES.filter(r => ['recruiter', 'others'].includes(r.id)).map((role) => {
                        const styles = roleStyles[role.id];
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: Math.random() * 0.4 + 0.3 }}
                                key={role.id}
                                onClick={() => navigate(`/auth?role=${role.id}`)}
                                className={clsx(
                                    "bg-white backdrop-blur-lg border border-white/50 shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center group w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)]",
                                    styles.border
                                )}
                            >
                                <role.icon className={clsx("w-8 h-8 mb-2 transition-transform group-hover:scale-110", styles.icon)} />
                                <span className={clsx("text-sm font-semibold text-slate-800 transition-colors text-center", styles.hoverText)}>
                                    {role.label}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default FacilitatorsGrid;
