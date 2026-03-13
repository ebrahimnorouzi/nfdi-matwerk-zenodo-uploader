import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDepositStore } from '../../lib/store'
import { createDeposit, uploadFile, formatBytes } from '../../lib/api'
import { ArrowRight, ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const MAX_FILES = 100
const MAX_TOTAL = 50 * 1024 ** 3  // 50 GiB

export default function Step4Files() {
  const {
    files, addFiles, removeFile,
    title, description, creators, keywords, license, upload_type, publication_date,
    depositionId, setDepositionId, setReservedDoi, setHtmlUrl,
    uploadProgress, setFileProgress,
    nextStep, prevStep,
  } = useDepositStore()

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const totalSize = files.reduce((s, f) => s + f.size, 0)
  const overLimit = files.length > MAX_FILES || totalSize > MAX_TOTAL
  const allUploaded = files.length > 0 && files.every((f) => uploadProgress[f.name]?.done)

  const onDrop = useCallback((accepted) => {
    setError('')
    addFiles(accepted)
  }, [addFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: MAX_FILES,
  })

  const handleUploadAll = async () => {
    if (!files.length || overLimit) return
    setUploading(true)
    setError('')

    try {
      // Create the deposition if not yet created
      let depId = depositionId
      if (!depId) {
        const metadata = {
          title, description,
          creators: creators.filter((c) => c.name.trim()),
          keywords: keywords.filter(Boolean),
          license, upload_type, publication_date,
        }
        const dep = await createDeposit(metadata)
        depId = dep.id
        setDepositionId(dep.id)
        setReservedDoi(dep.doi)
        setHtmlUrl(dep.html_url)
      }

      // Upload files sequentially (could be parallelised, but sequential is safer for large files)
      for (const file of files) {
        if (uploadProgress[file.name]?.done) continue
        setFileProgress(file.name, { done: false, error: null, progress: 0 })
        try {
          await uploadFile(depId, file, (pct) =>
            setFileProgress(file.name, { done: false, error: null, progress: pct })
          )
          setFileProgress(file.name, { done: true, error: null, progress: 100 })
        } catch (err) {
          const msg = err.response?.data?.detail || err.message || 'Upload failed'
          setFileProgress(file.name, { done: false, error: msg, progress: 0 })
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to create deposit')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fade-up max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Upload Files</h2>
      <p className="text-slate-500 text-sm mb-8">
        Add up to <span className="text-teal-400 font-semibold">100 files</span>, max{' '}
        <span className="text-teal-400 font-semibold">50 GB</span> total.
      </p>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-5 ${
          isDragActive
            ? 'border-teal-500 bg-teal-500/10'
            : 'border-slate-700 hover:border-slate-600 bg-slate-900/30'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={32} className={`mx-auto mb-3 ${isDragActive ? 'text-teal-400' : 'text-slate-600'}`} />
        <p className="text-sm text-slate-400 mb-1">
          {isDragActive ? 'Drop files here…' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-xs text-slate-600">Any file type accepted · {MAX_FILES} file limit · 50 GB total</p>
      </div>

      {/* Limits bar */}
      {files.length > 0 && (
        <div className={`text-xs flex justify-between mb-5 px-1 ${overLimit ? 'text-red-400' : 'text-slate-500'}`}>
          <span>{files.length} / {MAX_FILES} files</span>
          <span>{formatBytes(totalSize)} / 50 GB</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-1">
          {files.map((f) => {
            const prog = uploadProgress[f.name]
            return (
              <div key={f.name} className="card px-4 py-3 flex items-center gap-3">
                <FileText size={15} className="text-slate-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-300 truncate">{f.name}</div>
                  <div className="text-[10px] text-slate-600 font-mono">{formatBytes(f.size)}</div>
                  {prog && !prog.done && !prog.error && prog.progress > 0 && (
                    <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full progress-bar rounded-full transition-all"
                        style={{ width: `${prog.progress}%` }}
                      />
                    </div>
                  )}
                  {prog?.error && (
                    <div className="text-[10px] text-red-400 mt-0.5">{prog.error}</div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {prog?.done ? (
                    <CheckCircle size={15} className="text-teal-400" />
                  ) : prog?.error ? (
                    <AlertCircle size={15} className="text-red-400" />
                  ) : uploading && prog ? (
                    <Loader2 size={15} className="text-teal-400 animate-spin" />
                  ) : (
                    <button onClick={() => removeFile(f.name)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-700/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-6 flex gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <button onClick={prevStep} disabled={uploading} className="btn-secondary">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex gap-3">
          {files.length > 0 && !allUploaded && (
            <button
              onClick={handleUploadAll}
              disabled={uploading || overLimit}
              className="btn-primary"
            >
              {uploading ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading…</>
              ) : (
                <><Upload size={16} /> Upload {files.length} file{files.length !== 1 ? 's' : ''}</>
              )}
            </button>
          )}

          {allUploaded && (
            <button onClick={nextStep} className="btn-primary">
              Review &amp; Publish
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
