'use client';

import { toast } from 'sonner';
import slugify from 'slugify';

import { PostSchema } from '@/validation/post';
import { uploadImageToStorage } from '@/lib/supabase/upload-image';
import { createPost } from '@/actions/blog/posts';
import { useRouter } from 'next/navigation';
import { deleteImageFromStorage } from '@/lib/supabase/delete-image';
import { PostForm } from '@/components/forms/PostForm';

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreatePost = async (data: PostSchema, imageFile: File | null) => {
    let uploadedImagePath = '';

    try {
      // Validar imagen
      if (!imageFile) {
        throw new Error('Se requiere una imagen destacada.');
      }

      const slug =
        data.slug || slugify(data.title, { lower: true, strict: true });
      const upload = await uploadImageToStorage(imageFile, `posts/${slug}`);
      uploadedImagePath = upload.filePath;

      const postData = {
        ...data,
        slug,
        image_url: upload.publicUrl,
      };

      await createPost(postData);
      toast.success('Post creado con éxito');
      router.push('/blog');
    } catch (err: unknown) {
      const error = err as Error;

      let message = error.message || 'Error al crear el post';

      if (
        message.includes('duplicate key') &&
        message.includes('posts_slug_key')
      ) {
        message = 'Ya existe un post con este título o slug.';
      }

      toast.error(message || 'Error al crear el post');

      if (uploadedImagePath) {
        await deleteImageFromStorage(uploadedImagePath).catch(() =>
          console.error('No se pudo eliminar la imagen subida.'),
        );
      }

      throw error;
    }
  };

  return (
    <main
      className='max-w-3xl mx-auto px-4 py-10 mt-10'
      aria-labelledby='new-post-heading'>
      <header className='mb-10 text-center'>
        <h1
          id='new-post-heading'
          className='text-3xl font-bold text-primary mb-2'>
          Crear nuevo post
        </h1>
        <p className='text-muted-foreground'>
          Llena los campos para agregar un nuevo artículo al blog.
        </p>
      </header>

      <PostForm onSubmitAction={handleCreatePost} />
    </main>
  );
}
