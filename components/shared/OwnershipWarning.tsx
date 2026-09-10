import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { OwnershipType } from '@/lib/types';
import { OWNERSHIP_WARNINGS } from '@/lib/constants';

interface OwnershipWarningProps {
  ownershipType: OwnershipType;
}

export function OwnershipWarning({ ownershipType }: OwnershipWarningProps) {
  const warning = OWNERSHIP_WARNINGS[ownershipType];
  if (!warning?.show) return null;

  const isHighRisk = ownershipType === 'Unknown' || ownershipType === 'Government';

  return (
    <div className={`rounded-lg border p-4 ${
      isHighRisk
        ? 'bg-red-50 border-red-200'
        : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-start gap-3">
        {isHighRisk
          ? <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          : <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        }
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${
              isHighRisk ? 'text-red-800' : 'text-amber-800'
            }`}>
              Ownership: {ownershipType} — Legal Verification Required
            </span>
          </div>
          <p className={`text-sm ${
            isHighRisk ? 'text-red-700' : 'text-amber-700'
          }`}>
            {warning.message}
          </p>
          {warning.financingNote && (
            <div className="flex items-center gap-1.5 mt-2">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-xs text-slate-600">{warning.financingNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
