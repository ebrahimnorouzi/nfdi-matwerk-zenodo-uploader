import axios from 'axios'

// All calls go to the same origin (port 3000) which nginx proxies to backend
// This keeps cookies same-origin and avoids all SameSite/CORS issues
const API = axios.create({
  baseURL: '',   // same origin — nginx proxies /auth and /deposit to backend
  withCredentials: true,
})

export const checkAuth = () => API.get('/auth/me').then((r) => r.data)
export const logout = () => API.post('/auth/logout')

// Login redirects via the backend — use same-origin path
export const loginUrl = () => '/auth/login'

export const createDeposit = (metadata) =>
  API.post('/deposit/create', metadata).then((r) => r.data)

export const uploadFile = (depositionId, file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return API.post(`/deposit/${depositionId}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  }).then((r) => r.data)
}

export const getDepositStatus = (id) =>
  API.get(`/deposit/${id}/status`).then((r) => r.data)

export const publishDeposit = (id) =>
  API.post(`/deposit/${id}/publish`).then((r) => r.data)

export const discardDeposit = (id) =>
  API.delete(`/deposit/${id}`).then((r) => r.data)

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
