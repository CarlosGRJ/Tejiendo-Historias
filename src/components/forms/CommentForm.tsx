'use client';

import { CommentType } from '@/types/blog';
import { CommentSchema } from '@/validation/post';
import { zodResolver } from '@hookform/resolvers/zod';
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import Turnstile from 'react-cloudflare-turnstile';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createComment } from '@/actions/blog/comments';
import { toast } from 'sonner';

interface Props {
  postId: string;
  setComments: Dispatch<SetStateAction<CommentType[]>>;
}

const MAX_COMMENT_LENGTH = 2000;

export default function CommentForm({ postId, setComments }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isThrottled, setIsThrottled] = useState(false);

  const form = useForm<CommentSchema>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      name: '',
      content: '',
      turnstileToken: '',
    },
  });

  const content = form.watch('content');

  const onSubmit = (data: CommentSchema) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('content', data.content);

    startTransition(async () => {
      await createComment(formData, postId)
        .then((res) => {
          if (res?.error) {
            if ('_form' in res.error) {
              toast.error(
                Array.isArray(res.error._form) && res.error._form[0]
                  ? res.error._form[0]
                  : 'Error al enviar el comentario',
              );
            } else {
              if (res.error.name) {
                form.setError('name', {
                  message: res.error.name._errors?.[0],
                });
              }

              if (res.error.content) {
                form.setError('content', {
                  message: res.error.content._errors?.[0],
                });
              }
            }
            return;
          }

          setComments((prev) => [res.comment, ...prev]);
          toast.success('Comentario enviado');
          form.reset();

          // Activa el throttle
          setIsThrottled(true);
          setTimeout(() => setIsThrottled(false), 5000); // 5 segundos
        })
        .catch((err) => {
          toast.error(err.message || 'Ocurrió un error inesperado');
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
        aria-label='Formulario para enviar un comentario'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='name'>Tu nombre</FormLabel>
              <FormControl>
                <Input id='name' placeholder='Escribe tu nombre' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='content'>Comentario</FormLabel>
              <FormControl>
                <Textarea
                  id='content'
                  placeholder='Escribe tu comentario'
                  {...field}
                  rows={4}
                  maxLength={MAX_COMMENT_LENGTH}
                  aria-describedby='comment-length'
                />
              </FormControl>
              <div className='text-right text-xs text-muted-foreground mt-1'>
                <span id='comment-length'>
                  {content?.length || 0}/{MAX_COMMENT_LENGTH} caracteres
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='turnstileToken'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verificación</FormLabel>
              <FormControl>
                <Turnstile
                  turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  callback={(token) => field.onChange(token)}
                  theme='light'
                  size='normal'
                  retry='auto'
                  refreshExpired='auto'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isPending || isThrottled}
          className='w-full'
          aria-disabled={isPending || isThrottled}>
          {isPending
            ? 'Enviando...'
            : isThrottled
              ? 'Espera unos segundos...'
              : 'Enviar comentario'}
        </Button>
      </form>
    </Form>
  );
}
