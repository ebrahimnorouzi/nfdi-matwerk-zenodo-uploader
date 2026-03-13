import { useDepositStore } from '../../lib/store'
import { ArrowRight, ArrowLeft, Plus, Trash2, User } from 'lucide-react'

export default function Step2Creators() {
  const { creators, addCreator, removeCreator, updateCreator, nextStep, prevStep } = useDepositStore()
  const valid = creators.every((c) => c.name.trim().length >= 2)

  return (
    <div className="fade-up max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Creators &amp; Authors</h2>
      <p className="text-slate-500 text-sm mb-8">
        Add all creators in the order they should appear. ORCID is optional but strongly recommended.
      </p>

      <div className="space-y-4">
        {creators.map((c, i) => (
          <div key={i} className="card p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <User size={12} className="text-teal-400" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Creator {i + 1}
                </span>
              </div>
              {creators.length > 1 && (
                <button
                  onClick={() => removeCreator(i)}
                  className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-900/20 py-1 px-2"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full Name <span className="text-red-400">*</span></label>
                <input
                  className="input"
                  placeholder="Last, First  (e.g. Doe, Jane)"
                  value={c.name}
                  onChange={(e) => updateCreator(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Affiliation</label>
                <input
                  className="input"
                  placeholder="e.g. NFDI-MatWerk, KIT"
                  value={c.affiliation}
                  onChange={(e) => updateCreator(i, 'affiliation', e.target.value)}
                />
              </div>
              <div>
                <label className="label">ORCID</label>
                <input
                  className="input font-mono"
                  placeholder="0000-0000-0000-0000"
                  value={c.orcid}
                  onChange={(e) => updateCreator(i, 'orcid', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCreator}
          className="w-full border border-dashed border-slate-700 hover:border-teal-600/50 rounded-xl py-3 text-sm text-slate-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={15} />
          Add another creator
        </button>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} className="btn-secondary">
          <ArrowLeft size={16} />
          Back
        </button>
        <button onClick={nextStep} disabled={!valid} className="btn-primary">
          Next: Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
