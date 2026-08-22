import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  accentColor?: 'primary' | 'success' | 'warning' | 'error' | 'brown';
}

const accentStyles = {
  primary: 'border-l-primary-500 dark:border-l-primary-50',
  success: 'border-l-success dark:border-l-primary-50',
  warning: 'border-l-warning dark:border-l-primary-50',
  error: 'border-l-error dark:border-l-primary-50',
  brown: 'border-l-primary-700 dark:border-l-primary-50',
};

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'primary',
}: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 border-l-4 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer dark:bg-neutral-600',
        accentStyles[accentColor]
      )}
    >
      {/* Title and Icon */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-white">{title}</h3>
        {icon && (
          <span className="text-neutral-400 dark:text-neutral-200">{icon}</span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-neutral-900 dark:text-success">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' ? 'text-success' : 'text-error'
            )}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>

      {/* Subtitle or trend label */}
      {(subtitle || trend?.label) && (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {subtitle || trend?.label}
        </p>
      )}
    </div>
  );
}