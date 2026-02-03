import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { resolveFileUrl } from '../../utils/resolveFileUrl';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  userName: string;
  onFileSelect: (file: File | null) => void;
}

const ProfilePhotoUpload = ({ currentPhotoUrl, userName, onFileSelect }: ProfilePhotoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > MAX_SIZE) {
      setError('File exceeds 2MB limit');
      onFileSelect(null);
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG or PNG files are accepted');
      onFileSelect(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  const displayUrl = previewUrl || resolveFileUrl(currentPhotoUrl);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-28 h-28 rounded-full ring-2 ring-indigo-400 ring-offset-2 ring-offset-white cursor-pointer group shadow-md shadow-slate-200"
        onClick={() => inputRef.current?.click()}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold select-none">
              {getInitials(userName)}
            </span>
          </div>
        )}

        {/* Hover overlay — intentionally dark for contrast over avatar */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
          <Camera className="w-5 h-5 text-white" />
          <span className="text-white text-xs">Change Photo</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <p className="text-xs text-slate-500 text-center mt-2">JPG or PNG • Max 2MB</p>

      {error && (
        <p className="text-red-500 text-xs text-center">{error}</p>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
