'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import slugify from 'slugify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Turnstile from 'react-cloudflare-turnstile';

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
import { Textarea } from '@/components/ui/textarea';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { postSchema, PostSchema } from '@/validation/post';

interface PostFormProps {
  defaultValues?: Partial<PostSchema> & { image_url?: string };
  onSubmitAction: (
    data: PostSchema,
    imageFile: File | null,
    previousImagePathToDelete?: string,
  ) => Promise<void>;
  isEdit?: boolean;
}

export function PostForm({
  defaultValues,
  onSubmitAction,
  isEdit = false,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues?.image_url || null,
  );
  const [previousImagePath, setPreviousImagePath] = useState<string | null>(
    defaultValues?.image_url || null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: defaultValues || {
      title: '',
      summary: '',
      content: '',
      category: '',
      slug: '',
      turnstileToken: '',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title && !isEdit) {
        const generatedSlug = slugify(value.title, {
          lower: true,
          strict: true,
        });
        form.setValue('slug', generatedSlug);
      }
    });
    return () => subscription.unsubscribe?.();
  }, [form, isEdit]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    const isTooLarge = file.size > 5 * 1024 * 1024;
    if (isTooLarge) {
      toast.error('La imagen debe pesar menos de 5MB');
      return;
    }

    setImageFile(file);

    if (previewUrl && isEdit) {
      setPreviousImagePath(previewUrl);
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleSubmit = async (data: PostSchema) => {
    setIsSubmitting(true);
    try {
      if (imageFile) {
        const isTooLarge = imageFile.size > 2 * 1024 * 1024;
        if (isTooLarge) {
          toast.error('La imagen debe pesar menos de 2MB');
          setIsSubmitting(false);
          return;
        }
      }

      await onSubmitAction(data, imageFile, previousImagePath || undefined);
      router.push('/blog');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full max-w-3xl mx-auto space-y-6 bg-card p-6 rounded-xl shadow'
        aria-label={
          isEdit ? 'Formulario para editar post' : 'Formulario para crear post'
        }>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder='Título del post' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className='cursor-not-allowed bg-muted/20'
                  aria-readonly='true'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='summary'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumen</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder='Resumen del post...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          <FormLabel htmlFor='imageUpload'>Imagen destacada</FormLabel>
          <Input
            ref={fileInputRef}
            id='imageUpload'
            type='file'
            accept='image/jpeg, image/png, image/webp'
            onChange={handleImageChange}
            aria-label='Subir imagen destacada para el post'
          />

          {previewUrl && (
            <div className='relative mt-4'>
              <Image
                src={previewUrl}
                alt='Vista previa de la imagen seleccionada'
                width={600}
                height={400}
                className='rounded-md border max-h-64 object-contain'
              />
              <Button
                type='button'
                onClick={() => {
                  setImageFile(null);
                  setPreviewUrl('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2'
                aria-label='Eliminar imagen seleccionada'>
                ×
              </Button>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder='Ej: Terapia de Pareja' {...field} />
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
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
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
          disabled={isSubmitting}
          className='w-full'
          aria-busy={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : isEdit
              ? 'Actualizar post'
              : 'Publicar post'}
        </Button>
      </form>
    </Form>
  );
}
