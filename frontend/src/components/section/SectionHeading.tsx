
const SectionHeading = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-6 rounded-full"></div>
    </div>
);

export default SectionHeading;
