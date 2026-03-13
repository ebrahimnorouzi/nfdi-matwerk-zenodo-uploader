import { useDepositStore } from '../../lib/store'
import { ArrowRight } from 'lucide-react'

export default function Step1BasicInfo() {
  const { title, description, setTitle, setDescription, nextStep } = useDepositStore()
  const valid = title.trim().length >= 3 && description.trim().length >= 10

  return (
    <div className="fade-up max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Basic Information</h2>
      <p className="text-slate-500 text-sm mb-8">Give your dataset a clear, descriptive title and abstract.</p>

      <div className="space-y-6">
        <div>
          <label className="label">Title <span className="text-red-400">*</span></label>
          <input
            className="input"
            placeholder="e.g. Molecular dynamics simulation results for Fe-C alloys at 800K"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-600">Minimum 3 characters</span>
            <span className="text-xs text-slate-600 font-mono">{title.length}/500</span>
          </div>
        </div>

        <div>
          <label className="label">Description / Abstract <span className="text-red-400">*</span></label>
          <textarea
            className="input resize-none"
            rows={6}
            placeholder="Describe your dataset: what it contains, how it was generated, what it can be used for…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="text-xs text-slate-600 mt-1 block">Minimum 10 characters. Markdown is supported by Zenodo.</span>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={nextStep} disabled={!valid} className="btn-primary">
          Next: Creators
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
