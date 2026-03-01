import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const PostProjectForm = () => {
    const [customQuestions, setCustomQuestions] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');

    const addQuestion = () => {
        if (currentQuestion.trim()) {
            setCustomQuestions([...customQuestions, currentQuestion]);
            setCurrentQuestion('');
        }
    };

    const removeQuestion = (index: number) => {
        setCustomQuestions(customQuestions.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Project</h2>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Project Posted!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Project Title</label>
                        <input type="text" placeholder="e.g., AI Research Assistant" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select>
                            <option>Research Project</option>
                            <option>Academic Project</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Domain</label>
                        <input type="text" placeholder="e.g., Machine Learning" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <input type="text" placeholder="e.g., 3 Months" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Skills Required</label>
                        <input type="text" placeholder="e.g., Python, TensorFlow" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">No. of Students</label>
                        <input type="number" min="1" placeholder="e.g., 2" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea rows={4} placeholder="Describe the project goals and responsibilities..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required></textarea>
                </div>

                {/* Custom Questions */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="text-lg font-semibold text-gray-900">Custom Questions</label>
                     <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={currentQuestion}
                            onChange={(e) => setCurrentQuestion(e.target.value)}
                            placeholder="e.g., Why should we select you?" 
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
                        />
                        <button 
                            type="button" 
                            onClick={addQuestion}
                            className="px-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {customQuestions.map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 text-orange-800 rounded-lg">
                                <span>{q}</span>
                                <button type="button" onClick={() => removeQuestion(idx)} className="text-orange-400 hover:text-orange-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
                        Post Project
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostProjectForm;
