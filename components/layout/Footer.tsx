import Link from 'next/link';
import { MapPin, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">BhuInfo Nepal</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 max-w-md">
              Nepal&apos;s Land Intelligence &amp; Due-Diligence platform. Explore land information,
              risk indicators, and estimated values in one place.
            </p>
            <div className="flex items-start gap-2 bg-amber-900/30 border border-amber-700/30 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                <strong>Disclaimer:</strong> All land information on this platform is fictional sample data
                for demonstration purposes only. BhuInfo Nepal does not replace legal, cadastral,
                engineering, or financial verification.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/explore', 'Explore Land'], ['/listings', 'Listings'], ['/compare', 'Compare Land'], ['/risk', 'Risk Analysis']].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Tools & Info</h3>
            <ul className="space-y-2 text-sm">
              {[['/estimator', 'Price Estimator'], ['/calculator', 'Area Calculator'], ['/due-diligence', 'Due Diligence Guide'], ['/about', 'About BhuInfo']].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© 2025 BhuInfo Nepal. Prototype demonstration platform. All data is fictional.</p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Version 1.0 (Prototype)</span>
            <span>•</span>
            <span>Sample Data Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
