import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both URL and key are provided and not placeholder values
export const supabase = (supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => {
  return supabase !== null
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  if (!supabase) {
    throw new Error('Supabase client not configured. Please check your environment variables.')
  }

  try {
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      throw error
    }

    return { data: result, error: null }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    return { data: null, error }
  }
}
