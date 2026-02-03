import { useState, useRef } from 'react';
import { Upload, X, FileText, Eye, RefreshCw } from 'lucide-react';

interface ResumeDragDropProps {
  existingResume?: string;
  onFileSelect: (file: File | null) => void;
}

const ResumeDragDrop = ({ existingResume, onFileSelect }: ResumeDragDropProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replacing, setReplacing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateAndSet = (file: File) => {
    setError(null);

    if (file.type !== 'application/pdf') {
      setError('Only PDF files under 5MB are accepted');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Only PDF files under 5MB are accepted');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
    setReplacing(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Show existing resume if present and not replacing
  if (existingResume && !selectedFile && !replacing) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-slate-800 text-sm font-medium">{existingResume}</p>
              <p className="text-slate-500 text-xs">Uploaded resume</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 text-xs hover:bg-slate-200 hover:text-slate-800 transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </button>
            <button
              type="button"
              onClick={() => setReplacing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 shadow-md shadow-indigo-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'
        }`}
      >
        <Upload className={`w-10 h-10 ${isDragOver ? 'text-indigo-600' : 'text-indigo-500'}`} />
        <p className="text-slate-800 font-medium">Drag & Drop your Resume here</p>
        <p className="text-indigo-600 text-sm underline cursor-pointer">or click to browse</p>
        <p className="text-xs text-slate-500 mt-1">PDF only • Max 5MB</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      {selectedFile && (
        <div className="mt-3 flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full shadow-sm shadow-indigo-100/50">
            <FileText className="w-3 h-3" />
            {selectedFile.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="ml-1 text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default ResumeDragDrop;
