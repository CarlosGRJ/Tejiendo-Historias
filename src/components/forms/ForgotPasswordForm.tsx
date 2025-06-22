'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { sendEmailResetPassword } from '@/actions/login/actions';

const formSchema = z.object({
  email: z.string().email('Correo inválido'),
});

type ResetPasswordSchema = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    setLoading(true);
    try {
      await sendEmailResetPassword(values.email);
      setSubmitted(true);
      toast.success('Te enviamos un correo con instrucciones');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Hubo un error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className='text-center bg-green-50 dark:bg-green-900/10 border border-green-500 text-green-800 dark:text-green-300 px-6 py-8 rounded-xl shadow-lg'
        role='status'
        aria-live='polite'>
        <h2 className='text-xl font-semibold mb-2'>¡Correo enviado!</h2>
        <p>
          Si el correo existe en nuestra base de datos, recibirás un enlace para
          restablecer tu contraseña en los próximos minutos.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 bg-card p-6 rounded-xl shadow-xl'
        aria-label='Formulario de restablecimiento de contraseña'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='email'>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  id='email'
                  type='email'
                  placeholder='correo@ejemplo.com'
                  {...field}
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby='email-error'
                />
              </FormControl>
              <FormMessage id='email-error' />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={loading}
          aria-busy={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
      </form>
    </Form>
  );
}
