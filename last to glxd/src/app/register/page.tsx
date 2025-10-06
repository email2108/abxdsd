'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { OtpVerification } from '@/components/auth/otp-verification'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuth()

  const handleRegistrationVerified = (userData: any) => {
    // Set the user in the global context
    setUser(userData.user || userData)

    // Redirect to the Telegram connection page after successful registration
    router.push('/connect-telegram')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <OtpVerification type="REGISTRATION" onVerified={handleRegistrationVerified} />
    </div>
  )
}
