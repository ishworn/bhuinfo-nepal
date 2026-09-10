'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/listings', label: 'Listings' },
  { href: '/compare', label: 'Compare' },
  {
    label: 'Tools',
    children: [
      { href: '/estimator', label: 'Price Estimator' },
      { href: '/calculator', label: 'Area Calculator' },
      { href: '/risk', label: 'Risk Analysis' },
    ],
  },
  { href: '/due-diligence', label: 'Due Diligence' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg leading-none">BhuInfo</span>
              <span className="text-emerald-600 font-bold text-lg leading-none"> Nepal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setToolsOpen(!toolsOpen)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {toolsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setToolsOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/admin"
              className="ml-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{link.label}</div>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block pl-6 pr-3 py-2 text-sm text-slate-600 hover:text-emerald-700"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-emerald-700 font-semibold"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
