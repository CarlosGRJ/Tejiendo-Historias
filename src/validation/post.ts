import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, 'El título es requerido').max(100),
  summary: z.string().min(10, 'El resumen es muy corto').max(300),
  slug: z
    .string()
    .min(3, 'El slug es requerido')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'El slug debe contener solo minúsculas, números y guiones',
    }),
  category: z.string().min(3, 'La categoría es requerida'),
  content: z.string().min(10, 'El contenido es muy corto'),
});

export type PostSchema = z.infer<typeof postSchema>;

export const CommentSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es obligatorio' }),
  content: z
    .string()
    .min(5, { message: 'El comentario debe tener al menos 5 caracteres' }),
});

export type CommentSchema = z.infer<typeof CommentSchema>;