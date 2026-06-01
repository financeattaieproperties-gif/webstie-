import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'available' | 'pending' | 'sold' | 'rented';
  type?: string;
}

export const Badge = ({ status, type, className, children, ...props }: BadgeProps) => {
  const statusColors = {
    available: "bg-status-available/10 text-status-available border-status-available/20",
    pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
    sold: "bg-status-sold/10 text-status-sold border-status-sold/20",
    rented: "bg-status-rented/10 text-status-rented border-status-rented/20"
  };

  const baseStyle = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider";

  if (status) {
    return (
      <div className={cn(baseStyle, statusColors[status], className)} {...props}>
        {status}
      </div>
    );
  }

  // Type badge (neutral)
  return (
    <div className={cn(baseStyle, "bg-neutral-100 text-neutral-900 border-neutral-300", className)} {...props}>
      {type || children}
    </div>
  );
};
