import type { ReactNode } from 'react';
import { Search, FolderSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
}

interface SharedApplicationsListProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    actions?: (item: T) => ReactNode;
    emptyMessage?: string;
}

const SharedApplicationsList = <T extends { id: string | number }>({ title, data, columns, actions, emptyMessage = "You haven't applied to any opportunities yet! 🚀" }: SharedApplicationsListProps<T>) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900 transition-all" 
                    />
                 </div>
            </div>
            
            <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">SL. NO.</th>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 border-b border-slate-100 font-medium">
                                    {index + 1}
                                </td>
                                {columns.map((col, idx) => (
                                    <td key={idx} className={`px-6 py-4 whitespace-nowrap text-sm text-slate-700 border-b border-slate-100 ${col.className || ''}`}>
                                        {typeof col.accessor === 'function' 
                                            ? col.accessor(item) 
                                            : (item[col.accessor] as ReactNode)
                                        }
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 border-b border-slate-100 text-right">
                                        <div className="flex justify-end gap-2">
                                            {actions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {data.length === 0 && (
                <div className="p-16 text-center bg-gradient-to-b from-white to-slate-50/80 flex flex-col items-center justify-center border-t border-slate-100">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-200 blur-xl opacity-50 rounded-full"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center shadow-inner relative z-10 border border-white">
                            <FolderSearch className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">It's a bit empty here!</h3>
                    <p className="max-w-md mx-auto text-slate-500 mb-8 leading-relaxed">{emptyMessage}</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-bold shadow-md shadow-blue-200/50 hover:-translate-y-0.5"
                    >
                        Explore Opportunities
                    </button>
                </div>
            )}
        </div>
    );
};

export default SharedApplicationsList;
