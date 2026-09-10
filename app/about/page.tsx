import { Shield, Database, Layers, Users, MapPin, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">About BhuInfo Nepal</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          A Nepal-focused Land Intelligence and Due-Diligence platform designed to help
          users understand a piece of land before making critical decisions.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-emerald-900 mb-3">Our Mission</h2>
        <p className="text-emerald-800">
          BhuInfo Nepal is NOT a real-estate marketplace. Our goal is to help people
          understand a piece of land — its risk profile, ownership category, infrastructure,
          location, and estimated value — before making a buying, selling, construction,
          or financing decision.
        </p>
      </div>

      {/* Data Policy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-3">Data Policy</h2>
            <div className="space-y-2 text-amber-800 text-sm">
              <p>✓ All land data on this prototype is <strong>completely fictional</strong> — no real ownership records.</p>
              <p>✓ No real personal information is stored or displayed.</p>
              <p>✓ No government cadastral data is used.</p>
              <p>✓ Price estimates are rule-based approximations, never official valuations.</p>
              <p>✓ Risk scores are indicative assessments, not legal safety guarantees.</p>
              <p>✓ Every data item is clearly labeled: Sample, Estimated, or Needs Verification.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          {
            icon: Layers, title: 'GIS-Ready Architecture',
            desc: 'Built for future integration with authorized government GIS datasets, PostGIS, satellite data, and official land records without rewriting the application.'
          },
          {
            icon: Shield, title: 'Trust & Transparency',
            desc: 'Every data section shows its source and status. We never claim to legally verify ownership or provide official valuations.'
          },
          {
            icon: Database, title: 'Provider Interface',
            desc: 'Data providers are pluggable. DummyDataProvider is active now. Future providers (GIS, Official Government) can slot in without UI changes.'
          },
          {
            icon: Users, title: 'Nepal-Focused',
            desc: 'Built for Nepali land context: Ropani-Aana system, Guthi land handling, province/district/municipality structure, and local risk factors.'
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </div>

      {/* Technology */}
      <div className="bg-slate-900 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Next.js 14 (App Router)', 'TypeScript', 'Tailwind CSS',
            'React-Leaflet (Maps)', 'Recharts (Charts)', 'Prisma (ORM)',
            'PostgreSQL-ready', 'GeoJSON Data Structures', 'OpenStreetMap'
          ].map(tech => (
            <div key={tech} className="bg-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Future */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Future Roadmap</h2>
        <div className="space-y-2">
          {[
            'Integration with authorized government GIS datasets',
            'PostGIS spatial database for real parcel geometry',
            'Satellite and environmental risk datasets',
            'Official flood-risk and road network data',
            'Authorized transaction and market data',
            'Bilingual interface (Nepali & English)',
            'Mobile application',
            'Verified ownership status (with government authorization)',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
