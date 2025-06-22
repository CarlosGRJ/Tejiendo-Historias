'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { PostSchema } from '@/validation/post';
import { getPostBySlug, updatePost } from '@/actions/blog/posts';
import {
  deleteImageFromStorage,
  extractFilePathFromUrl,
} from '@/lib/supabase/delete-image';
import { uploadImageToStorage } from '@/lib/supabase/upload-image';
import { PostForm } from '@/components/forms/PostForm';
import { Post } from '@/types/blog';

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const data = await getPostBySlug(slug);
        if (!data) throw new Error('Post no encontrado');
        setPost(data);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || 'Error al obtener el post');
        router.push('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug, router]);

  const handleUpdatePost = async (data: PostSchema, imageFile: File | null) => {
    if (!post) return;

    let filePath = ''; // new uploaded image path

    const isUnchanged =
      post.title === data.title &&
      post.slug === data.slug &&
      post.summary === data.summary &&
      post.category === data.category &&
      post.content === data.content &&
      !imageFile;

    if (isUnchanged) {
      toast.info('No se realizaron cambios');
      return;
    }

    try {
      let imageUrl = post.image_url;

      if (imageFile) {
        // 1. Upload new image first
        const upload = await uploadImageToStorage(
          imageFile,
          `posts/${post.slug}`,
        );
        imageUrl = upload.publicUrl;
        filePath = upload.filePath;

        // 2. Then delete the previous image (if any)
        const previousPath = extractFilePathFromUrl(post.image_url);
        if (previousPath) {
          await deleteImageFromStorage(previousPath);
        }
      }

      const updatedData = {
        ...data,
        id: post.id,
        slug: post.slug,
        image_url: imageUrl,
      };

      await updatePost(post.id, updatedData);
      toast.success('Post actualizado con éxito');
      router.push('/blog');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Error al actualizar el post');

      // rollback: delete new image if update failed
      if (filePath) {
        await deleteImageFromStorage(filePath);
      }
    }
  };

  return (
    <main
      className='max-w-3xl mx-auto px-4 py-12 mt-10'
      aria-labelledby='edit-post-heading'>
      <header className='mb-10 text-center'>
        <h1
          id='edit-post-heading'
          className='text-3xl font-bold text-primary mb-2'>
          Editar post
        </h1>
        <p className='text-muted-foreground'>
          Modifica los campos para actualizar tu artículo.
        </p>
      </header>

      {!isLoading && post ? (
        <PostForm
          defaultValues={post}
          onSubmitAction={handleUpdatePost}
          isEdit
        />
      ) : (
        <p className='text-center text-muted-foreground'>Cargando...</p>
      )}
    </main>
  );
}
