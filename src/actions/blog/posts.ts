'use server';

import { z } from 'zod';
import { postSchema } from '@/validation/post';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/config/supabase/server';
import { Post, PostUpdate } from '@/types/blog';
import {
  deleteImageFromStorage,
  extractFilePathFromUrl,
} from '@/lib/supabase/delete-image';

export async function createPost(
  formData: z.infer<typeof postSchema> & { image_url: string },
) {
  const supabase = await createClient();

  // Validar los datos
  const validated = postSchema.safeParse(formData);
  if (!validated.success) {
    throw new Error('Datos del post no válidos');
  }

  // Obtener al usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('No se pudo obtener la sesión del usuario');
  }

  // Insertar el post
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      category: formData.category,
      image_url: formData.image_url,
      user_id: user.id,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[createPost]', error);
    throw new Error(
      error.message || 'Error al insertar el post en la base de datos',
    );
  }

  // Revalidar caché
  revalidatePath('/blog');

  return data;
}

export async function getPaginatedPosts(page: number, limit = 6) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' }) // importante para saber cuántos hay
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[getAllPosts]', error);
    throw new Error('Error al obtener los posts');
  }

  return { posts: data, total: count ?? 0 };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('[getPostBySlug]', error);
    return null;
  }

  return data;
}

export async function updatePost(postId: string, updatedData: PostUpdate) {
  const supabase = await createClient();

  const removingTurnstileToken = {
    ...updatedData,
    turnstileToken: undefined,
  };

  const { data, error } = await supabase
    .from('posts')
    .update({
      ...removingTurnstileToken,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('[UPDATE POST ERROR]', error);
    throw new Error('Error updating post');
  }

  return data;
}

export async function deletePost(postId: string, imageUrl?: string) {
  const supabase = await createClient();

  // Delete the post
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    console.error('[deletePost]', error);
    throw new Error('No se pudo eliminar el post');
  }

  // Delete associated image if provided
  if (imageUrl) {
    const filePath = extractFilePathFromUrl(imageUrl);
    if (filePath) {
      try {
        await deleteImageFromStorage(filePath);
      } catch (err) {
        const error = err as Error;
        console.warn(
          error?.message ?? 'Imagen no se pudo eliminar, pero el post sí.',
        );
      }
    }
  }

  // Revalidate blog listing
  revalidatePath('/blog');

  return { success: true };
}
