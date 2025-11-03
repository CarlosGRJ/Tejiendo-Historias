import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <main className='flex items-start justify-center px-4 py-8 md:py-16 bg-background text-foreground'>
      <section
        className='w-full max-w-md space-y-4 sm:space-y-6 md:space-y-8'
        aria-labelledby='reset-password-heading'>
        <header className='text-center space-y-2'>
          <h1
            id='reset-password-heading'
            className='text-3xl font-bold text-primary'>
            Restablecer contraseña
          </h1>
          <p className='text-muted-foreground'>
            Ingresa tu nueva contraseña a continuación.
          </p>
        </header>

        <Suspense fallback={<div>Cargando formulario...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
