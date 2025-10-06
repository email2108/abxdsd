'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { OtpVerification } from '@/components/auth/otp-verification'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()

  const handleLoginVerified = (userData: any) => {
    // Set the user in the global context
    setUser(userData.user || userData)

    // Redirect to the main chat page after successful login
    router.push('/chat')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <OtpVerification type="LOGIN" onVerified={handleLoginVerified} />
    </div>
  )
}
