import { CheckCircle, Clock, AlertCircle, FlaskConical } from 'lucide-react';
import { DataStatus } from '@/lib/types';

interface DataBadgeProps {
  status: DataStatus;
  className?: string;
  size?: 'sm' | 'md';
}

const CONFIG = {
  Sample: {
    label: 'Sample Data',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Icon: FlaskConical,
  },
  Estimated: {
    label: 'Estimated',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    Icon: Clock,
  },
  'Needs Verification': {
    label: 'Needs Verification',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
    Icon: AlertCircle,
  },
  Verified: {
    label: 'Verified',
    className: 'bg-green-100 text-green-800 border-green-200',
    Icon: CheckCircle,
  },
};

export function DataBadge({ status, className = '', size = 'sm' }: DataBadgeProps) {
  const config = CONFIG[status];
  const { Icon } = config;
  return (
    <span className={`inline-flex items-center gap-1 border rounded-full font-medium ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    } ${config.className} ${className}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label}
    </span>
  );
}
