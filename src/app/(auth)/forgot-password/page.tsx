import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Página para restablecer tu contraseña de forma segura.',
};

export default function ForgotPasswordPage() {
  return (
    <main className='text-foreground max-w-xl mx-auto px-4 py-8 md:py-16'>
      <header className='mb-6 md:mb-8 text-center'>
        <h1 className='text-3xl font-bold text-primary mb-2'>
          Restablecer contraseña
        </h1>
        <p className='text-muted-foreground'>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu
          contraseña.
        </p>
      </header>

      <ForgotPasswordForm />
    </main>
  );
}
