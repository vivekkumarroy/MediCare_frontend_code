import { cn } from '@/lib/cn';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ className, children, onClick, hoverable }: CardProps) {
  const base = (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-card p-6',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (hoverable) {
    return (
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        {base}
      </motion.div>
    );
  }

  return base;
}
