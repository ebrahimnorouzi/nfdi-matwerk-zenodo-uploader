import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDepositStore } from '../lib/store'
import { loginUrl } from '../lib/api'
import StepIndicator from '../components/StepIndicator'
import Step1BasicInfo from '../components/steps/Step1BasicInfo'
import Step2Creators from '../components/steps/Step2Creators'
import Step3Details from '../components/steps/Step3Details'
import Step4Files from '../components/steps/Step4Files'
import Step5Publish from '../components/steps/Step5Publish'
import { LogIn } from 'lucide-react'

export default function UploadWizard() {
  const { authenticated, step } = useDepositStore()

  if (!authenticated) {
    return (
      <div className="text-center py-20 fade-up">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
          <LogIn size={28} className="text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-3">Sign in to upload</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          You need to sign in with your Zenodo account to create deposits.
        </p>
        <a href={loginUrl()} className="btn-primary">
          Sign in with Zenodo
        </a>
      </div>
    )
  }

  return (
    <div className="fade-up">
      <StepIndicator current={step} />

      <div className="card p-8 min-h-[500px]">
        {step === 1 && <Step1BasicInfo />}
        {step === 2 && <Step2Creators />}
        {step === 3 && <Step3Details />}
        {step === 4 && <Step4Files />}
        {step === 5 && <Step5Publish />}
      </div>
    </div>
  )
}
