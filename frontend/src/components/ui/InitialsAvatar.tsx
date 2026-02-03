/**
 * InitialsAvatar — Premium CSS-only avatar using user initials.
 * Extracts first letter of first + last name from fullName.
 * Uses gradient background with configurable size.
 */

interface InitialsAvatarProps {
  fullName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-28 h-28 text-3xl',
};

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || 'U';
}

const InitialsAvatar = ({ fullName, size = 'md', className = '' }: InitialsAvatarProps) => {
  const initials = getInitials(fullName);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-indigo-500 to-purple-600
        text-white font-bold rounded-full
        flex items-center justify-center
        select-none shadow-md shadow-indigo-200/50
        ring-2 ring-indigo-400/30 ring-offset-2 ring-offset-white
        ${className}
      `}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
