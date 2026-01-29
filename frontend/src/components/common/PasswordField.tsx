import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import clsx from 'clsx';

interface PasswordFieldProps {
  placeholder?: string;
  name?: string;
  required?: boolean;
  className?: string; // Additional classes for the input wrapper or focus color
  focusRingColor?: string; // e.g. 'focus:border-indigo-500 focus:ring-indigo-200'
}

const PasswordField = ({
  placeholder = "e.g., Abc@123",
  name = "password",
  required = true,
  className,
  focusRingColor = "focus:ring-blue-500", // Default to a standard blue if none provided
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        className={clsx(
          "w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 outline-none transition-all focus:border-transparent",
          focusRingColor,
          className
        )}
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
