import { useNavigate } from 'react-router-dom'
import { loginUrl } from '../lib/api'
import { useDepositStore } from '../lib/store'
import { Upload, Shield, Zap, Database, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Zenodo OAuth', desc: 'Sign in directly with your Zenodo account — no separate registration needed.' },
  { icon: Database, title: 'MatWerk Community', desc: 'All uploads are automatically submitted to the nfdi-matwerk Zenodo community.' },
  { icon: Zap, title: 'Up to 100 files / 50 GB', desc: 'Supports large research datasets within Zenodo\'s limits per deposit.' },
  { icon: Upload, title: 'Zero data storage', desc: 'Files stream directly to Zenodo — nothing is stored on this server.' },
]

const steps = [
  'Sign in with your Zenodo account',
  'Fill in metadata (title, creators, keywords…)',
  'Upload up to 100 files (≤ 50 GB total)',
  'Review and publish to the MatWerk community',
]

export default function LandingPage() {
  const authenticated = useDepositStore((s) => s.authenticated)
  const navigate = useNavigate()

  return (
    <div className="fade-up">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20 pt-6">
        <div className="inline-flex items-center gap-2 bg-teal-900/30 border border-teal-700/40 text-teal-400 text-xs font-mono px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
          NFDI-MatWerk · Zenodo Community Upload Portal
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Publish your research data<br />
          <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
            to Zenodo in minutes
          </span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          A guided upload wizard for the{' '}
          <a href="https://zenodo.org/communities/nfdi-matwerk" target="_blank" rel="noopener"
             className="text-teal-400 hover:underline">nfdi-matwerk</a>{' '}
          Zenodo community. No account setup — just sign in with Zenodo, fill metadata, upload files.
        </p>

        {authenticated ? (
          <button onClick={() => navigate('/upload')} className="btn-primary text-base px-8 py-4">
            Start upload wizard
            <ArrowRight size={18} />
          </button>
        ) : (
          <a href={loginUrl()} className="btn-primary text-base px-8 py-4">
            Sign in with Zenodo to start
            <ArrowRight size={18} />
          </a>
        )}
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center mb-8">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="card p-5 flex gap-4 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400">
                {i + 1}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-5">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Icon size={18} className="text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-1">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
