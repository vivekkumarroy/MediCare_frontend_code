import { cn } from '@/lib/cn';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'default' | 'upcoming' | 'completed' | 'cancelled' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  danger:    'bg-red-50 text-red-700 ring-1 ring-red-200',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  warning:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  upcoming:  'bg-[#e8f4f7] text-primary-700 ring-1 ring-[#c5e4ec]',
  default:   'bg-[#e8f4f7] text-primary-700 ring-1 ring-[#c5e4ec]',
  info:      'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
};

export function Badge({ variant = 'default', label, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', variantClasses[variant], className)}>
      {label}
    </span>
  );
}
