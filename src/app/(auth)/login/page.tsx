'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginSchema) => {
    startTransition(async () => {
      toast.promise(
        login(data.email, data.password).then(() => {
          form.reset();
          router.push('/');
        }),
        {
          loading: 'Verificando...',
          success: '¡Bienvenido de nuevo!',
          error: (err) => err.message || 'Error al iniciar sesión',
        },
      );
    });
  };
  return (
    <main className='min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12'>
      <section
        className='w-full max-w-md space-y-8'
        aria-labelledby='login-heading'>
        <header className='text-center space-y-2'>
          <h1 id='login-heading' className='text-3xl font-bold text-primary'>
            Iniciar Sesión
          </h1>
          <p className='text-muted-foreground'>
            Ingresa tus credenciales para acceder al panel
          </p>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 bg-card p-6 rounded-xl shadow-xl'
            aria-label='Formulario de inicio de sesión'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='email'>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      id='email'
                      autoComplete='email'
                      placeholder='ejemplo@correo.com'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Contraseña</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        autoComplete='current-password'
                        placeholder='Tu contraseña'
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

            <Button
              type='submit'
              className='w-full'
              aria-label='Enviar formulario de inicio de sesión'
              disabled={isPending}>
              {isPending ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
