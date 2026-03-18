import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatsCard({ icon, label, value, trend, trendUp, color = 'bg-primary-500' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-5 flex items-center gap-4"
    >
      <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl text-white shrink-0', color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-navy dark:text-white leading-none mb-0.5">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {trend && (
          <p className={cn('text-xs font-semibold mt-1', trendUp ? 'text-emerald-600' : 'text-red-500')}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </motion.div>
  );
}
