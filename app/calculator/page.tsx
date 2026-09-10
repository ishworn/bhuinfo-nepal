'use client';
import { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { sqftToAll, ropaniToSqft, sqmToSqft } from '@/lib/utils/area';

type InputUnit = 'ropani' | 'aana' | 'sqft' | 'sqm' | 'hectare' | 'acre' | 'bigha';

export default function CalculatorPage() {
  const [inputUnit, setInputUnit] = useState<InputUnit>('ropani');
  const [ropani, setRopani] = useState(0);
  const [aana, setAana] = useState(0);
  const [paisa, setPaisa] = useState(0);
  const [daam, setDaam] = useState(0);
  const [simpleVal, setSimpleVal] = useState('');

  const getSqft = (): number => {
    if (inputUnit === 'ropani') return ropaniToSqft(ropani, aana, paisa, daam);
    const n = parseFloat(simpleVal) || 0;
    if (inputUnit === 'aana') return n * 342.25;
    if (inputUnit === 'sqft') return n;
    if (inputUnit === 'sqm') return sqmToSqft(n);
    if (inputUnit === 'hectare') return n * 107639;
    if (inputUnit === 'acre') return n * 43560;
    if (inputUnit === 'bigha') return n * 72900;
    return 0;
  };

  const result = sqftToAll(getSqft());

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-purple-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nepal Land Area Calculator</h1>
        </div>
        <p className="text-slate-600">Convert between Ropani-Aana-Paisa-Daam (Hill) and Bigha-Kattha (Terai) systems, and metric units.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Enter Area</h2>
          <div className="mb-4">
            <label className="text-sm text-slate-600 block mb-1">Input Unit</label>
            <select
              value={inputUnit}
              onChange={e => { setInputUnit(e.target.value as InputUnit); setSimpleVal(''); setRopani(0); setAana(0); setPaisa(0); setDaam(0); }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="ropani">Ropani-Aana-Paisa-Daam (Hill System)</option>
              <option value="aana">Aana only</option>
              <option value="bigha">Bigha (Terai System)</option>
              <option value="sqft">Square Feet</option>
              <option value="sqm">Square Meter</option>
              <option value="hectare">Hectare</option>
              <option value="acre">Acre</option>
            </select>
          </div>

          {inputUnit === 'ropani' ? (
            <div className="grid grid-cols-2 gap-3">
              {[['Ropani', ropani, setRopani], ['Aana', aana, setAana], ['Paisa', paisa, setPaisa], ['Daam', daam, setDaam]].map(([label, val, setter]) => (
                <div key={label as string}>
                  <label className="text-xs text-slate-500 block mb-1">{label as string}</label>
                  <input
                    type="number"
                    min={0}
                    value={val as number}
                    onChange={e => (setter as (v: number) => void)(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                {inputUnit === 'bigha' ? 'Bigha' : inputUnit === 'sqft' ? 'Square Feet' : inputUnit === 'sqm' ? 'Square Meters' : inputUnit === 'aana' ? 'Aana' : inputUnit.charAt(0).toUpperCase() + inputUnit.slice(1)}
              </label>
              <input
                type="number"
                min={0}
                step="0.001"
                value={simpleVal}
                onChange={e => setSimpleVal(e.target.value)}
                placeholder={`Enter value in ${inputUnit}`}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 font-semibold mb-1">Reference</p>
            <p className="text-xs text-slate-500">1 Ropani = 16 Aana = 64 Paisa = 256 Daam</p>
            <p className="text-xs text-slate-500">1 Aana = 342.25 sq ft = 31.8 sq m</p>
            <p className="text-xs text-slate-500">1 Ropani = 5,476 sq ft ≈ 0.051 hectare</p>
            <p className="text-xs text-slate-500">1 Bigha = 72,900 sq ft = 6.77 hectare (Terai)</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Conversion Results</h2>
          <div className="space-y-3">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-xs text-purple-600 font-semibold mb-1">Hill System (Ropani)</div>
              <div className="text-lg font-bold text-purple-900">
                {result.ropani}R - {result.aana}A - {result.paisa}P - {result.daam}D
              </div>
            </div>

            {[['Square Feet', `${result.sqft.toLocaleString()} sq ft`], ['Square Meters', `${result.sqm.toLocaleString()} sq m`], ['Hectare', `${result.hectare} ha`], ['Acre', `${result.acre} ac`], ['Bigha (approx)', `${result.bigha} Bigha`], ['Kattha (approx)', `${result.kattha} Kattha`]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common sizes */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Common Land Sizes Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-3 py-2 text-slate-600 font-medium">Description</th>
                <th className="text-left px-3 py-2 text-slate-600 font-medium">Ropani-Aana</th>
                <th className="text-left px-3 py-2 text-slate-600 font-medium">Sq Ft</th>
                <th className="text-left px-3 py-2 text-slate-600 font-medium">Sq M</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Small urban plot', '0R-2A', '685', '64'],
                ['Medium urban plot', '0R-4A', '1,369', '127'],
                ['Large urban plot', '0R-8A', '2,738', '254'],
                ['1 Ropani', '1R-0A', '5,476', '509'],
                ['2 Ropani', '2R-0A', '10,952', '1,017'],
                ['5 Ropani', '5R-0A', '27,380', '2,544'],
              ].map(([desc, rp, sqft, sqm]) => (
                <tr key={desc} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-700">{desc}</td>
                  <td className="px-3 py-2 text-slate-800 font-mono">{rp}</td>
                  <td className="px-3 py-2 text-slate-700">{sqft}</td>
                  <td className="px-3 py-2 text-slate-700">{sqm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
