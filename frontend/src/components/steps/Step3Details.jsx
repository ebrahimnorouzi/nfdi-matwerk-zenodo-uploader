import { useDepositStore } from '../../lib/store'
import { ArrowRight, ArrowLeft, X } from 'lucide-react'

const LICENSES = [
  { value: 'cc-by-4.0',    label: 'CC BY 4.0',        desc: 'Attribution required' },
  { value: 'cc-by-sa-4.0', label: 'CC BY-SA 4.0',     desc: 'Attribution + ShareAlike' },
  { value: 'cc-zero',      label: 'CC0 (Public Domain)', desc: 'No restrictions' },
  { value: 'mit',          label: 'MIT',               desc: 'Software / code' },
  { value: 'apache-2.0',   label: 'Apache 2.0',        desc: 'Software / code' },
]

const UPLOAD_TYPES = [
  { value: 'dataset',      label: 'Dataset' },
  { value: 'software',     label: 'Software' },
  { value: 'publication',  label: 'Publication' },
  { value: 'poster',       label: 'Poster' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'image',        label: 'Image' },
]

export default function Step3Details() {
  const {
    keywords, keywordInput, license, upload_type, publication_date,
    setKeywordInput, addKeyword, removeKeyword, setLicense, setUploadType, setPublicationDate,
    nextStep, prevStep,
  } = useDepositStore()

  const handleKeywordKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault()
      addKeyword(keywordInput.trim().replace(/,$/, ''))
    }
  }

  return (
    <div className="fade-up max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Upload Details</h2>
      <p className="text-slate-500 text-sm mb-8">Classify your upload and set discoverability keywords.</p>

      <div className="space-y-7">
        {/* Upload Type */}
        <div>
          <label className="label">Upload Type <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {UPLOAD_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setUploadType(t.value)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  upload_type === t.value
                    ? 'bg-teal-500/20 border-teal-500/60 text-teal-300'
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Publication Date */}
        <div>
          <label className="label">Publication Date <span className="text-red-400">*</span></label>
          <input
            type="date"
            className="input w-48"
            value={publication_date}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>

        {/* License */}
        <div>
          <label className="label">License <span className="text-red-400">*</span></label>
          <div className="space-y-2">
            {LICENSES.map((l) => (
              <label
                key={l.value}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  license === l.value
                    ? 'bg-teal-500/10 border-teal-500/50'
                    : 'bg-slate-900/40 border-slate-700 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="license"
                  value={l.value}
                  checked={license === l.value}
                  onChange={() => setLicense(l.value)}
                  className="accent-teal-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-200">{l.label}</div>
                  <div className="text-xs text-slate-500">{l.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="label">Keywords</label>
          <div className="input min-h-[3rem] flex flex-wrap gap-2 cursor-text" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
            {keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-2.5 py-1 rounded-full">
                {kw}
                <button onClick={() => removeKeyword(kw)} className="hover:text-white">
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              className="bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600 min-w-[120px] flex-1"
              placeholder={keywords.length === 0 ? 'Type a keyword and press Enter…' : ''}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKey}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1.5">Press Enter or comma to add. Suggested: RDF, knowledge graph, materials science</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} className="btn-secondary">
          <ArrowLeft size={16} />
          Back
        </button>
        <button onClick={nextStep} className="btn-primary">
          Next: Upload Files
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
