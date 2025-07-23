import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  console.log('Debug - Confirmation params:', { token_hash, type, next })

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    console.log('Debug - Verification result:', { error })
    
    if (!error) {
      console.log('Debug - Success, redirecting to:', next)
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
  }

  console.log('Debug - Failed, redirecting to error page')
  // redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
} 