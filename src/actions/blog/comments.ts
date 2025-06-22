'use server';

import { createClient } from '@/config/supabase/server';
import { CommentType } from '@/types/blog';
import { CommentSchema } from '@/validation/post';
import { User } from '@supabase/supabase-js';

export async function createComment(formData: FormData, postId: string) {
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;
  const parsed = CommentSchema.safeParse({ name, content });

  if (!parsed.success) {
    return {
      error: parsed.error.format(),
    };
  }

  if (!postId) throw new Error('No postID for comment');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        name: parsed.data.name,
        content: parsed.data.content,
        post_id: postId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting comment:', error.message);
    return {
      error: {
        _form: ['No se pudo guardar el comentario. Intenta de nuevo.'],
      },
    };
  }

  return { success: true, comment: data as CommentType };
}

export async function getComments(postId: string, limit = 5, offset = 0) {
  const supabase = await createClient();

  const { data, count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error al obtener comentarios', error.message);
    return { comments: [], count: 0 };
  }

  return { comments: data as CommentType[], count: count || 0 };
}

export async function deleteComment(commentId: string, user: User | null) {
  if (!user || user.email !== process.env.AUTH_EMAIL)
    throw new Error('Solo el administrador puede eliminar comentarios');

  const supabase = await createClient();

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error.message);
    return {
      error: 'No se pudo eliminar el comentario. Intenta de nuevo.',
    };
  }

  return { success: true };
}
