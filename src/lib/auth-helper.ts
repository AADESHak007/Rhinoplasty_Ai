import { createClient } from '@/app/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user from our database using Supabase UID
  let dbUser = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
  })

  // If user doesn't exist in our database but exists in Supabase, create them
  if (!dbUser && user) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        name: user.user_metadata?.full_name || user.email!.split('@')[0],
        supabaseUid: user.id,
      },
    })
  }

  return dbUser
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
} 