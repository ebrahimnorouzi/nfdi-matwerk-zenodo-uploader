import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { checkAuth } from './lib/api'
import { useDepositStore } from './lib/store'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import UploadWizard from './pages/UploadWizard'

export default function App() {
  const { setAuthenticated } = useDepositStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const authSuccess = params.get('auth') === 'success'

    // Always check auth status from backend — don't trust the URL param alone
    checkAuth()
      .then((d) => {
        setAuthenticated(d.authenticated)
        if (d.authenticated) {
          // Clean the URL and go straight to the wizard
          navigate('/upload', { replace: true })
        }
      })
      .catch(() => setAuthenticated(false))
  }, [])  // run once on mount

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadWizard />} />
      </Routes>
    </Layout>
  )
}
