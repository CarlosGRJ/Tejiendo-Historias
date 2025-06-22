'use server';

import { createClient } from '@/config/supabase/server';
import { ResetPasswordSchema } from '@/validation/reset-password';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function sendEmailResetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
  });

  if (error) {
    throw new Error('No se pudo enviar el correo. Verifica tu email.');
  }

  return true;
}

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const parsed = ResetPasswordSchema.safeParse({ password, confirmPassword });

  if (!parsed.success) {
    return {
      error: parsed.error.format(),
    };
  }

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (!userData?.user || userError) {
    return {
      error: {
        _form: [
          'Sesión inválida. Intenta nuevamente desde el enlace del correo.',
        ],
      },
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      error: {
        _form: [error.message || 'Error al actualizar la contraseña'],
      },
    };
  }

  return { success: true };
}
