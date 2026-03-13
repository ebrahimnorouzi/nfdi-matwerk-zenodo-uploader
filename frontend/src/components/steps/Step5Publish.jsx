import { useState } from 'react'
import { useDepositStore } from '../../lib/store'
import { publishDeposit, discardDeposit, formatBytes } from '../../lib/api'
import {
  ArrowLeft, Send, CheckCircle, ExternalLink, Loader2,
  AlertCircle, FileText, Tag, User, Calendar, BookOpen, Trash2
} from 'lucide-react'

export default function Step5Publish() {
  const {
    title, description, creators, keywords, license, upload_type, publication_date,
    files, uploadProgress, depositionId, reservedDoi, htmlUrl,
    publishResult, setPublishResult,
    prevStep, reset,
  } = useDepositStore()

  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [discarding, setDiscarding] = useState(false)

  const uploadedFiles = files.filter((f) => uploadProgress[f.name]?.done)
  const totalSize = uploadedFiles.reduce((s, f) => s + f.size, 0)

  const handlePublish = async () => {
    if (!depositionId) return
    setPublishing(true)
    setError('')
    try {
      const result = await publishDeposit(depositionId)
      setPublishResult(result)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  const handleDiscard = async () => {
    if (!depositionId || !window.confirm('Discard this draft and delete all uploaded files?')) return
    setDiscarding(true)
    try {
      await discardDeposit(depositionId)
      reset()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Discard failed')
    } finally {
      setDiscarding(false)
    }
  }

  // ── Published success screen ───────────────────────────────────────────────
  if (publishResult) {
    return (
      <div className="fade-up max-w-xl mx-auto text-center py-10">
        <div className="w-20 h-20 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-teal-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-3">Published! 🎉</h2>
        <p className="text-slate-400 mb-8">
          Your dataset has been submitted to the{' '}
          <span className="text-teal-400 font-semibold">nfdi-matwerk</span> community on Zenodo.
        </p>

        {publishResult.doi && (
          <div className="card p-5 mb-6 text-left">
            <div className="label mb-2">DOI</div>
            <a
              href={`https://doi.org/${publishResult.doi}`}
              target="_blank" rel="noopener"
              className="text-teal-400 font-mono text-sm hover:underline flex items-center gap-2"
            >
              {publishResult.doi}
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {publishResult.html_url && (
            <a href={publishResult.html_url} target="_blank" rel="noopener" className="btn-primary">
              View on Zenodo
              <ExternalLink size={15} />
            </a>
          )}
          <button onClick={reset} className="btn-secondary">
            Start new upload
          </button>
        </div>
      </div>
    )
  }

  // ── Review ─────────────────────────────────────────────────────────────────
  return (
    <div className="fade-up max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Review &amp; Publish</h2>
      <p className="text-slate-500 text-sm mb-8">
        Review your deposit before submitting to the MatWerk community.
      </p>

      {/* Reserved DOI */}
      {reservedDoi && (
        <div className="bg-teal-900/20 border border-teal-700/30 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <Tag size={14} className="text-teal-400 flex-shrink-0" />
          <span className="text-xs text-slate-400">Reserved DOI:</span>
          <span className="text-xs font-mono text-teal-300">{reservedDoi}</span>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {/* Title + description */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-teal-400" />
            <span className="label mb-0">Basic Info</span>
          </div>
          <p className="text-sm font-semibold text-slate-200 mb-2">{title}</p>
          <p className="text-xs text-slate-500 line-clamp-3">{description}</p>
        </div>

        {/* Creators */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-teal-400" />
            <span className="label mb-0">Creators</span>
          </div>
          <div className="space-y-1.5">
            {creators.filter((c) => c.name.trim()).map((c, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                <span className="font-semibold">{c.name}</span>
                {c.affiliation && <span className="text-slate-500">· {c.affiliation}</span>}
                {c.orcid && <span className="text-slate-600 font-mono">{c.orcid}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-teal-400" />
            <span className="label mb-0">Details</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <span className="text-slate-500">Type</span>
            <span className="text-slate-300 capitalize">{upload_type}</span>
            <span className="text-slate-500">Date</span>
            <span className="text-slate-300">{publication_date}</span>
            <span className="text-slate-500">License</span>
            <span className="text-slate-300">{license}</span>
            <span className="text-slate-500">Community</span>
            <span className="text-teal-400">nfdi-matwerk</span>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {keywords.map((kw) => (
                <span key={kw} className="bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] px-2 py-0.5 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Files */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-teal-400" />
            <span className="label mb-0">Files — {uploadedFiles.length} uploaded · {formatBytes(totalSize)}</span>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {uploadedFiles.map((f) => (
              <div key={f.name} className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle size={11} className="text-teal-500 flex-shrink-0" />
                <span className="truncate">{f.name}</span>
                <span className="text-slate-600 font-mono ml-auto">{formatBytes(f.size)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-6 flex gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Draft link */}
      {htmlUrl && (
        <div className="text-center mb-6">
          <a href={htmlUrl} target="_blank" rel="noopener"
             className="text-xs text-slate-500 hover:text-teal-400 flex items-center gap-1 justify-center transition-colors">
            Preview draft on Zenodo
            <ExternalLink size={11} />
          </a>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-2">
          <button onClick={prevStep} disabled={publishing} className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </button>
          {depositionId && (
            <button
              onClick={handleDiscard}
              disabled={discarding || publishing}
              className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 size={14} />
              {discarding ? 'Discarding…' : 'Discard draft'}
            </button>
          )}
        </div>

        <button
          onClick={handlePublish}
          disabled={publishing || !depositionId}
          className="btn-primary bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500"
        >
          {publishing ? (
            <><Loader2 size={16} className="animate-spin" /> Publishing…</>
          ) : (
            <><Send size={16} /> Publish to MatWerk community</>
          )}
        </button>
      </div>
    </div>
  )
}
