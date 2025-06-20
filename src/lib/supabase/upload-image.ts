import { createClient } from '@/config/supabase/client';

export async function uploadImageToStorage(
  file: File,
  path = 'posts',
): Promise<{ publicUrl: string; filePath: string }> {
  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(filePath);

  return { publicUrl, filePath };
}
