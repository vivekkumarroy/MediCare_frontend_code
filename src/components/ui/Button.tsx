import { cn } from '@/lib/cn';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 shadow-sm active:scale-[0.98]',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  danger:
    'bg-danger text-white hover:bg-red-600 shadow-sm active:scale-[0.98]',
  ghost:
    'bg-transparent text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  outline:
    'bg-transparent border border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  muted:
    'bg-[#e8f4f7] text-primary-700 hover:bg-[#d4ecf2] border border-[#c5e4ec]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
