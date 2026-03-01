import { useState, useEffect } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import InitialsAvatar from '../../../components/ui/InitialsAvatar';
import { getTestimonials } from '../../../services/apiService';
import type { Testimonial } from '../../../services/apiService';


const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getTestimonials();
                setTestimonials(data);
            } catch {
                setTestimonials([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-semibold text-sm px-4 py-1.5 rounded-full border border-blue-100 mb-4">
                        <Quote className="w-4 h-4" /> Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        What Our Community Says
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Real stories from real users. Let their journeys inspire yours.
                    </p>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && testimonials.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Quote className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">No testimonials yet</h3>
                        <p className="text-sm text-slate-400">Be the first to share your success story from the dashboard!</p>
                    </div>
                )}

                {/* Testimonials Grid */}
                {!isLoading && testimonials.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
                            >
                                {/* Stars */}
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                                        <Star key={`e-${i}`} className="w-4 h-4 fill-slate-100 text-slate-200" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-4">
                                    "{testimonial.quote}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <InitialsAvatar fullName={testimonial.fullName} size="sm" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{testimonial.fullName}</h4>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <span>{testimonial.role}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-blue-600 font-semibold">{testimonial.company}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimonialsSection;
