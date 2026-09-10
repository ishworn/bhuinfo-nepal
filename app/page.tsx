import Link from 'next/link';
import { MapPin, Shield, TrendingUp, BookOpen, Search, ChevronRight, AlertTriangle, CheckCircle, Database, Layers } from 'lucide-react';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Interactive Land Map',
    description: 'Explore fictional land parcels on an interactive map. View risk zones, road networks, and nearby facilities.',
    href: '/explore',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Risk Analysis',
    description: 'Understand flood risk, slope conditions, river proximity, and infrastructure quality with transparent scoring.',
    href: '/risk',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: TrendingUp,
    title: 'Price Estimation',
    description: 'Rule-based price estimation using location, road access, infrastructure, land use, and risk factors.',
    href: '/estimator',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: BookOpen,
    title: 'Due Diligence Guide',
    description: 'Comprehensive checklists covering ownership, legal, environmental, and infrastructure verification.',
    href: '/due-diligence',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

const STATS = [
  { value: '40+', label: 'Sample Parcels' },
  { value: '7', label: 'Provinces' },
  { value: '20+', label: 'Districts' },
  { value: '100%', label: 'Transparent' },
];

const WHY_FEATURES = [
  { icon: Database, text: 'GIS-ready data architecture for future official integration' },
  { icon: Layers, text: 'Transparent risk scoring — every factor explained' },
  { icon: Shield, text: 'Ownership warnings for Guthi, Government, and Unknown land' },
  { icon: CheckCircle, text: 'Clear data status badges: Sample, Estimated, Needs Verification' },
  { icon: TrendingUp, text: 'Rule-based price estimation, never presented as official valuation' },
  { icon: BookOpen, text: 'Educational due diligence checklists before any transaction' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          {/* Sample data notice */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">Prototype — All land data is fictional sample data</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Know the Land{' '}
            <span className="text-emerald-400">Before You Buy</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl leading-relaxed">
            Explore land information, location characteristics, risk indicators, infrastructure,
            ownership category, and estimated value in one place.
          </p>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-emerald-400" />
              <h2 className="text-white font-semibold">Search Land by Location</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="" className="text-slate-900">Province</option>
                <option className="text-slate-900">Bagmati</option>
                <option className="text-slate-900">Koshi</option>
                <option className="text-slate-900">Madhesh</option>
                <option className="text-slate-900">Gandaki</option>
                <option className="text-slate-900">Lumbini</option>
                <option className="text-slate-900">Karnali</option>
                <option className="text-slate-900">Sudurpashchim</option>
              </select>
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="" className="text-slate-900">District</option>
                <option className="text-slate-900">Kathmandu</option>
                <option className="text-slate-900">Lalitpur</option>
                <option className="text-slate-900">Bhaktapur</option>
              </select>
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="" className="text-slate-900">Municipality</option>
              </select>
              <input
                type="text"
                placeholder="Ward number"
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="text"
                placeholder="Kitta Number (e.g. 7-04-23-021)"
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              Search Land
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-emerald-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-emerald-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Land Intelligence Tools</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to understand a piece of land before making a buying,
              selling, construction, or financing decision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href} className="group">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 h-full hover:shadow-lg hover:border-slate-300 transition-all">
                    <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                    <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${feature.color}`}>
                      Learn more <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore land */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Land Across Nepal</h2>
              <p className="text-slate-600 mb-6">
                Browse sample land parcels across all 7 provinces. Filter by area, ownership type,
                road access, flood risk, and more. View parcels on an interactive map.
              </p>
              <ul className="space-y-3 mb-8">
                {['Filter by province, district, and municipality', 'View parcels on interactive map', 'Check ownership categories and warnings', 'See risk scores and infrastructure details'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Explore Land <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-slate-200 rounded-2xl h-64 md:h-80 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-emerald-600" />
                <p className="font-medium">Interactive Map Preview</p>
                <p className="text-sm">Click “Explore Land” to open the full map</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why BhuInfo */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why BhuInfo Nepal?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Built with transparency, trust, and Nepal-specific land context in mind.
              Not a marketplace — a land intelligence platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-700" />
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data disclaimer */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-amber-900 mb-2">Important Data Notice</h3>
          <p className="text-amber-800 max-w-3xl mx-auto text-sm leading-relaxed">
            All land parcels, ownership information, prices, risk scores, and location data shown
            on this platform are <strong>completely fictional and for demonstration purposes only</strong>.
            BhuInfo Nepal does not claim to verify ownership, provide official valuations, or replace
            legal, cadastral, engineering, or financial verification. Always consult qualified
            professionals before making any land transaction decisions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-emerald-200 mb-8 max-w-xl mx-auto">
            Browse sample land parcels, understand risk factors, and prepare for informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Explore Land
            </Link>
            <Link
              href="/due-diligence"
              className="border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Due Diligence Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
