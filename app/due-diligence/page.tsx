'use client';
import { useState } from 'react';
import { CheckSquare, Square, AlertTriangle, BookOpen, Shield, FileText, MapPin, DollarSign } from 'lucide-react';

const CHECKLIST_SECTIONS = [
  {
    id: 'ownership',
    title: 'Ownership Verification',
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    items: [
      { id: 'o1', text: 'Verify current owner via Lalpurja (Land Ownership Certificate)' },
      { id: 'o2', text: 'Check for multiple ownership or joint ownership claims' },
      { id: 'o3', text: 'Verify Kitta number matches Naapi (Survey Department) records' },
      { id: 'o4', text: 'Confirm ownership type (Private, Guthi, Government, Institutional)' },
      { id: 'o5', text: 'For Guthi land: consult Guthi Sansthan and legal experts' },
      { id: 'o6', text: 'For Government/Institutional land: verify allocation and transfer rights' },
      { id: 'o7', text: 'Check for any undisclosed heirs or succession disputes' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Cadastral',
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    items: [
      { id: 'l1', text: 'Check mortgage or loan status at relevant land revenue office' },
      { id: 'l2', text: 'Verify no court case or legal dispute on the land' },
      { id: 'l3', text: 'Confirm land boundary via Naapi (Survey Department) measurement' },
      { id: 'l4', text: 'Check for any government acquisition notices' },
      { id: 'l5', text: 'Review municipality land use plan and zoning' },
      { id: 'l6', text: 'Verify setback requirements from roads, rivers, and boundaries' },
      { id: 'l7', text: 'Check construction restrictions and FAR (Floor Area Ratio) limits' },
      { id: 'l8', text: 'Review Nala (drainage/water) rights' },
    ],
  },
  {
    id: 'documents',
    title: 'Documents to Collect',
    icon: BookOpen,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    items: [
      { id: 'd1', text: 'Lalpurja (Land Ownership Certificate) — certified copy' },
      { id: 'd2', text: 'Thauni Naksha (Field Map) from Survey Department' },
      { id: 'd3', text: 'Kitta Katauni (Land Registration Extract)' },
      { id: 'd4', text: 'Char-Killa (Four-Boundary) document from neighbors' },
      { id: 'd5', text: 'No Objection Certificate from municipality if applicable' },
      { id: 'd6', text: 'Tax clearance certificate from ward office' },
      { id: 'd7', text: 'Owner identity documents (citizenship, etc.)' },
      { id: 'd8', text: 'Power of Attorney if selling/buying through agent' },
    ],
  },
  {
    id: 'physical',
    title: 'Physical Site Inspection',
    icon: MapPin,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    items: [
      { id: 'p1', text: 'Physically visit and inspect the land' },
      { id: 'p2', text: 'Verify road access quality and ownership of access road' },
      { id: 'p3', text: 'Check distance from nearest all-season road' },
      { id: 'p4', text: 'Assess flood risk during monsoon season' },
      { id: 'p5', text: 'Check river or stream proximity and historical flood marks' },
      { id: 'p6', text: 'Assess slope stability and landslide history' },
      { id: 'p7', text: 'Verify electricity connection availability' },
      { id: 'p8', text: 'Check drinking water source and quality' },
      { id: 'p9', text: 'Inspect drainage system and waste disposal' },
      { id: 'p10', text: 'Check soil quality if intended for construction' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial & Transaction',
    icon: DollarSign,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    items: [
      { id: 'f1', text: 'Get independent land valuation from certified assessor' },
      { id: 'f2', text: 'Compare with recent comparable transactions in the area' },
      { id: 'f3', text: 'Confirm bank financing eligibility before committing' },
      { id: 'f4', text: 'Verify seller’s ability to transfer (no encumbrances)' },
      { id: 'f5', text: 'Calculate total transaction costs (registration, tax, agent fees)' },
      { id: 'f6', text: 'Use formal payment channels and get receipts' },
      { id: 'f7', text: 'Register transaction at relevant Land Revenue Office' },
    ],
  },
];

export default function DueDiligencePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const totalItems = CHECKLIST_SECTIONS.flatMap(s => s.items).length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const toggle = (id: string) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Land Due Diligence Guide</h1>
        </div>
        <p className="text-slate-600">A comprehensive checklist of verification steps before any land transaction in Nepal.</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Important Disclaimer</p>
            <p className="text-sm text-amber-800 mt-1">
              BhuInfo Nepal does not replace legal, cadastral, engineering, or financial verification.
              This checklist is educational and informational only. Always consult qualified lawyers,
              surveyors, engineers, and financial advisors before making land transaction decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Your Progress</span>
          <span className="text-sm font-bold text-emerald-600">{checkedCount} / {totalItems} items</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {CHECKLIST_SECTIONS.map(section => {
          const Icon = section.icon;
          const sectionChecked = section.items.filter(i => checked[i.id]).length;
          return (
            <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${section.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${section.color}`} />
                  </div>
                  <h2 className="font-semibold text-slate-800">{section.title}</h2>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  sectionChecked === section.items.length ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {sectionChecked}/{section.items.length}
                </span>
              </div>
              <div className="p-5 space-y-3">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="flex items-start gap-3 w-full text-left group"
                  >
                    {checked[item.id]
                      ? <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      : <Square className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5 group-hover:text-slate-400" />
                    }
                    <span className={`text-sm leading-relaxed ${
                      checked[item.id] ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-slate-900 rounded-xl p-6 text-center">
        <p className="text-slate-300 text-sm">
          Remember: This checklist is a starting point. Land transactions in Nepal involve complex legal,
          cultural, and administrative considerations. <strong className="text-white">Always engage qualified
          professionals</strong> — lawyers, licensed surveyors, and financial advisors.
        </p>
      </div>
    </div>
  );
}
