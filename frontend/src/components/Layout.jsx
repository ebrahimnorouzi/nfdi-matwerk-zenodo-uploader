import { useNavigate } from 'react-router-dom'
import { logout, loginUrl } from '../lib/api'
import { useDepositStore } from '../lib/store'
import { LogOut, BookOpen, ExternalLink } from 'lucide-react'

export default function Layout({ children }) {
  const { authenticated, setAuthenticated, reset } = useDepositStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
    reset()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-900/30">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold text-slate-100 group-hover:text-teal-400 transition-colors">
                NFDI-MatWerk
              </div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Zenodo Uploader
              </div>
            </div>
          </a>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noopener"
              className="btn-ghost text-xs"
            >
              <BookOpen size={14} />
              Docs
              <ExternalLink size={11} className="opacity-50" />
            </a>

            {authenticated ? (
              <button onClick={handleLogout} className="btn-ghost text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20">
                <LogOut size={14} />
                Sign out
              </button>
            ) : (
              <a href={loginUrl()} className="btn-primary text-xs py-2 px-4">
                Sign in with Zenodo
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Sandbox banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/30 text-center py-2 px-4">
        <span className="text-amber-400 text-xs font-mono">
          ⚠ SANDBOX MODE — uploads go to sandbox.zenodo.org and are not publicly published
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-slate-600">
          <span>NFDI-MatWerk Zenodo Uploader · MIT License</span>
          <div className="flex items-center gap-4">
            <a href="https://zenodo.org/communities/nfdi-matwerk" target="_blank" rel="noopener"
               className="hover:text-teal-500 transition-colors">MatWerk Community</a>
            <a href="https://nfdi-matwerk.de" target="_blank" rel="noopener"
               className="hover:text-teal-500 transition-colors">NFDI-MatWerk</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
