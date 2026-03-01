import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { GraduationCap, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
    { id: 'student', label: 'STUDENTS', icon: GraduationCap },
    { id: 'aspirant', label: 'ASPIRANTS', icon: Compass }
];

const roleStyles: Record<string, { border: string, icon: string, hoverText: string }> = {
    student: { border: 'hover:border-blue-400 hover:shadow-blue-500/20', icon: 'text-blue-600', hoverText: 'group-hover:text-blue-600' },
    aspirant: { border: 'hover:border-fuchsia-400 hover:shadow-fuchsia-500/20', icon: 'text-fuchsia-600', hoverText: 'group-hover:text-fuchsia-600' }
};

const SeekersGrid = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-2/5 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-6 md:p-8 flex flex-col h-full">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Career Seekers</h3>
                <p className="text-sm text-slate-500">I am looking for opportunities</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 h-full flex-1">
                {ROLES.map((role) => {
                    const styles = roleStyles[role.id];
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: Math.random() * 0.3 + 0.1 }}
                            key={role.id}
                            onClick={() => navigate(`/auth?role=${role.id}`)}
                            className={clsx(
                                "flex-1 flex flex-col items-center justify-center bg-white backdrop-blur-lg border border-white/50 shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-2xl p-4 group w-full",
                                styles.border
                            )}
                        >
                            <role.icon className={clsx("w-10 h-10 mb-3 transition-transform group-hover:scale-110", styles.icon)} />
                            <span className={clsx("text-base font-bold text-slate-800 transition-colors", styles.hoverText)}>
                                {role.label}
                            </span>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
};

export default SeekersGrid;
