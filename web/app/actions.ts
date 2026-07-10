'use server';

import { createClient } from '@/lib/supabase';

export async function submitWaitlistEmail(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || !email.includes('@')) {
    return { error: 'Digite um e-mail válido.' };
  }

  const supabase = createClient();
  const { error } = await supabase.from('landing_waitlist').insert({ email });

  if (error) {
    // Duplicate email (unique constraint) isn't an error for the user — they're already on the list.
    if (error.code === '23505') {
      return { success: true };
    }
    return { error: 'Não foi possível salvar seu e-mail agora. Tente de novo em instantes.' };
  }

  return { success: true };
}
