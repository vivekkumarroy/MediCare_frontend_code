import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
  circle?: boolean;
}

const lineWidths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];

export function Skeleton({ className, lines = 1, circle = false }: SkeletonProps) {
  if (circle) {
    return (
      <div
        className={cn('rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse', className)}
      />
    );
  }

  if (lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse',
              lineWidths[i % lineWidths.length]
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse', className)}
    />
  );
}
