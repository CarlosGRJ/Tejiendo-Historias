'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { ResetPasswordSchema, ResetSchema } from '@/validation/reset-password';
import { resetPassword } from '@/actions/login/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const { logout } = useAuth();

  const params = useSearchParams();
  const code = params.get('code');

  const form = useForm<ResetSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetSchema) => {
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);

    if (!code) {
      toast.error('Hubo un error, favor de contactar al Administrador');
      throw new Error('No code obtained');
    }

    startTransition(async () => {
      await resetPassword(formData).then((res) => {
        if (res?.error) {
          const error = res.error;
          if ('_form' in error) {
            toast.error(
              Array.isArray(error._form) && error._form[0]
                ? error._form[0]
                : 'Error al actualizar la contraseña',
            );
          } else {
            form.setError('password', {
              message: error.password?._errors?.[0],
            });
            form.setError('confirmPassword', {
              message: error.confirmPassword?._errors?.[0],
            });
          }
          return;
        }

        setSubmitted(true);
        toast.success('Contraseña actualizada correctamente');
        form.reset();
      });
      await logout();
    });
  };
  return (
    <>
      {!submitted ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 bg-card p-6 rounded-xl shadow-xl'
            aria-label='Formulario de restablecimiento de contraseña'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Nueva contraseña</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder='Nueva contraseña'
                        className='pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        aria-label={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }>
                        {showPassword ? (
                          <EyeOff className='w-5 h-5' />
                        ) : (
                          <Eye className='w-5 h-5' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='confirmPassword'>
                    Confirmar contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      id='confirmPassword'
                      placeholder='Repite la contraseña'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              aria-label='Enviar formulario de nueva contraseña'
              disabled={isPending}>
              {isPending ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
          </form>
        </Form>
      ) : (
        <div className='text-center bg-card p-6 rounded-xl shadow-xl space-y-4'>
          <p className='text-green-600 text-sm'>
            ✅ Tu contraseña ha sido actualizada exitosamente.
          </p>
          <Link
            href='/login'
            className='inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors'>
            Iniciar sesión
          </Link>
        </div>
      )}
    </>
  );
}
