import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface ResumeUploadProps {
    currentResume?: string;
    onUploadSuccess?: (resumeUrl: string) => void;
    onRemove?: () => void;
}

const ResumeUpload = ({ currentResume, onUploadSuccess, onRemove }: ResumeUploadProps) => {
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; url: string } | null>(
        currentResume ? { name: 'Resume.pdf', size: '', url: currentResume } : null
    );
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const validateAndUpload = useCallback(async (file: File) => {
        // Frontend validation — type
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are accepted.');
            return;
        }

        // Frontend validation — size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Resume must be under 5MB.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await api.post('/users/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(percent);
                },
            });

            const { resumeUrl } = response.data;
            setUploadedFile({
                name: file.name,
                size: formatFileSize(file.size),
                url: resumeUrl,
            });
            toast.success('Resume uploaded!');
            onUploadSuccess?.(resumeUrl);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Upload failed.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [onUploadSuccess]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validateAndUpload(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) validateAndUpload(file);
    }, [validateAndUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleRemove = () => {
        setUploadedFile(null);
        onRemove?.();
    };

    // Uploaded state
    if (uploadedFile && !isUploading) {
        return (
            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 bg-indigo-50/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1D23] truncate">
                            {uploadedFile.name}
                        </p>
                        {uploadedFile.size && (
                            <p className="text-xs text-slate-400 mt-0.5">{uploadedFile.size}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 
                                transition-colors"
                            title="Re-upload"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleRemove}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 
                                transition-colors"
                            title="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
        );
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-200
                ${isDragOver
                    ? 'border-indigo-500 bg-indigo-50/40 scale-[1.01]'
                    : 'border-indigo-300/40 bg-indigo-50/5 hover:border-indigo-400 hover:bg-indigo-50/20'
                }
            `}
        >
            {!isUploading ? (
                <>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-sm font-semibold text-[#1A1D23] mb-1">
                        Drag & Drop your Resume
                    </p>
                    <p className="text-xs text-slate-400">
                        or click to browse · PDF only · Max 5MB
                    </p>
                </>
            ) : (
                <div className="space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-sm font-medium text-[#1A1D23]">Uploading...</p>
                </div>
            )}

            {/* Upload progress bar */}
            {isUploading && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-indigo-100 rounded-b-2xl overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 rounded-b-2xl transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default ResumeUpload;
