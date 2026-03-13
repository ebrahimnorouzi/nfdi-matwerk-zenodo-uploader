import { create } from 'zustand'

const today = new Date().toISOString().split('T')[0]

export const useDepositStore = create((set, get) => ({
  // Auth
  authenticated: false,
  setAuthenticated: (v) => set({ authenticated: v }),

  // Wizard step (1-5)
  step: 1,
  setStep: (s) => set({ step: s }),
  nextStep: () => set((st) => ({ step: Math.min(st.step + 1, 5) })),
  prevStep: () => set((st) => ({ step: Math.max(st.step - 1, 1) })),

  // Step 1 – Basic info
  title: '',
  description: '',
  setTitle: (v) => set({ title: v }),
  setDescription: (v) => set({ description: v }),

  // Step 2 – Creators
  creators: [{ name: '', affiliation: '', orcid: '' }],
  addCreator: () =>
    set((st) => ({ creators: [...st.creators, { name: '', affiliation: '', orcid: '' }] })),
  removeCreator: (i) =>
    set((st) => ({ creators: st.creators.filter((_, idx) => idx !== i) })),
  updateCreator: (i, field, value) =>
    set((st) => ({
      creators: st.creators.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)),
    })),

  // Step 3 – Keywords, license, type, date
  keywords: [],
  keywordInput: '',
  license: 'cc-by-4.0',
  upload_type: 'dataset',
  publication_date: today,
  setKeywordInput: (v) => set({ keywordInput: v }),
  addKeyword: (kw) =>
    set((st) => ({
      keywords: st.keywords.includes(kw) ? st.keywords : [...st.keywords, kw],
      keywordInput: '',
    })),
  removeKeyword: (kw) => set((st) => ({ keywords: st.keywords.filter((k) => k !== kw) })),
  setLicense: (v) => set({ license: v }),
  setUploadType: (v) => set({ upload_type: v }),
  setPublicationDate: (v) => set({ publication_date: v }),

  // Step 4 – Files
  files: [],           // File objects (browser)
  addFiles: (newFiles) =>
    set((st) => {
      const existing = new Set(st.files.map((f) => f.name))
      const filtered = newFiles.filter((f) => !existing.has(f.name))
      const combined = [...st.files, ...filtered].slice(0, 100)
      return { files: combined }
    }),
  removeFile: (name) => set((st) => ({ files: st.files.filter((f) => f.name !== name) })),
  clearFiles: () => set({ files: [] }),

  // Deposit state
  depositionId: null,
  reservedDoi: null,
  htmlUrl: null,
  uploadProgress: {},   // filename → { done: bool, error: str|null }
  publishResult: null,
  setDepositionId: (id) => set({ depositionId: id }),
  setReservedDoi: (doi) => set({ reservedDoi: doi }),
  setHtmlUrl: (url) => set({ htmlUrl: url }),
  setFileProgress: (name, state) =>
    set((st) => ({ uploadProgress: { ...st.uploadProgress, [name]: state } })),
  setPublishResult: (r) => set({ publishResult: r }),

  reset: () =>
    set({
      step: 1,
      title: '', description: '',
      creators: [{ name: '', affiliation: '', orcid: '' }],
      keywords: [], keywordInput: '', license: 'cc-by-4.0',
      upload_type: 'dataset', publication_date: today,
      files: [], depositionId: null, reservedDoi: null,
      htmlUrl: null, uploadProgress: {}, publishResult: null,
    }),
}))
