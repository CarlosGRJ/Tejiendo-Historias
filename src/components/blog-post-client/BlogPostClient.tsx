'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getPostBySlug } from '@/actions/blog/posts';
import { CommentsSection } from '@/components/sections/CommentsSection';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
  tags?: string[];
}

export default function BlogPostClient() {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const postData = await getPostBySlug(slug);
        if (!postData) return notFound();
        setPost(postData);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar el artículo');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <article className='max-w-3xl mx-auto px-4 py-16 space-y-6 animate-pulse'>
        <Skeleton className='h-10 w-2/3 rounded-md' />
        <Skeleton className='h-5 w-1/3 rounded' />
        <Skeleton className='h-80 w-full rounded-xl' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-3/4' />
      </article>
    );
  }

  if (!post) return notFound();

  return (
    <>
      <article
        className='max-w-3xl mx-auto px-4 py-16 mt-8 text-foreground'
        aria-labelledby='blog-post-title'>
        <Link
          href='/blog'
          className='flex items-center mb-8 text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          aria-label='Volver al blog'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Volver al blog
        </Link>

        <header className='mb-10'>
          <h1
            id='blog-post-title'
            className='text-4xl font-bold leading-tight tracking-tight mb-3'>
            {post.title}
          </h1>

          <div className='flex flex-wrap items-center justify-between mb-4'>
            <p className='text-muted-foreground text-sm'>
              Publicado el{' '}
              {new Date(post.created_at).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {post.category && (
              <Badge className='bg-primary text-white px-3 py-1 rounded-full text-xs font-medium'>
                {post.category}
              </Badge>
            )}
          </div>

          {post.image_url && (
            <div className='relative w-full h-[300px] md:h-[420px] rounded-xl overflow-hidden'>
              <Image
                src={post.image_url}
                alt={`Imagen destacada del artículo: ${post.title}`}
                fill
                className='object-cover w-full h-full'
                priority
                sizes='(max-width: 768px) 100vw, 768px'
              />
            </div>
          )}
        </header>

        <Separator className='my-8' />

        <section aria-label='Contenido del artículo'>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className='prose prose-neutral dark:prose-invert max-w-none [&_p+p]:mt-6 leading-relaxed tracking-wider'
          />
        </section>

        <CommentsSection postId={post.id} />
      </article>
    </>
  );
}
