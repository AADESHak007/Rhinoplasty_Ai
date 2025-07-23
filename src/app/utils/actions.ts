'use server'

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server"
import type { Provider } from '@supabase/supabase-js'

const signInWith = (provider: Provider) => async () => {
    const supabase = await createClient() ;

    const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` ;
    const {data , error} =  await supabase.auth.signInWithOAuth({
        provider ,
        options:{
            redirectTo : auth_callback_url ,
        },
    })
    if(error){
        console.log("Error : /actions.ts",error)
    }
    if(data){
        console.log(data) ;
    }
    if(data.url) {
        redirect(data.url)
    }
}

const signInWithGoogle = signInWith('google') ;

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/signin')
}

export {signInWithGoogle} ;

// Email/Password Authentication Functions
export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    redirect('/auth/signin?error=Name, email and password are required');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        full_name: name,
      }
    },
  });

  if (error) {
    redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/auth/signin?message=Account created successfully! You can now sign in');
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    redirect('/auth/signin?error=Email and password are required');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/');
}