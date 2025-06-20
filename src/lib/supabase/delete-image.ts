import { createClient } from '@/config/supabase/client';

export async function deleteImageFromStorage(path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from('images')
    .remove([path, '1750354093099.webp']);

  if (error) {
    console.error('❌ Error al eliminar:', error);
    throw new Error('No se pudo eliminar la imagen del storage');
  }
}

export function extractFilePathFromUrl(url: string): string | undefined {
  try {
    const parts = new URL(url).pathname.split('/');
    return parts.slice(parts.indexOf('posts')).join('/');
  } catch {
    return undefined;
  }
}
