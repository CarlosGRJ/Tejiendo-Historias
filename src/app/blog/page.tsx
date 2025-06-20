'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getPaginatedPosts } from '@/actions/blog/posts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/types/blog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthProvider';
import { MoreVertical, PencilIcon } from 'lucide-react';
import { AlertDeletePostButton } from '@/components/ui/alert-delete-post-button';

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const isAdmin =
    isAuthenticated && user?.email === process.env.NEXT_PUBLIC_AUTH_EMAIL;

  useEffect(() => {
    async function fetchPostsPerPage() {
      try {
        setIsLoading(true);
        const { posts, total } = await getPaginatedPosts(
          currentPage,
          POSTS_PER_PAGE,
        );
        setPosts(posts);
        setTotalPages(Math.ceil(total / POSTS_PER_PAGE));
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error(
          'Error al cargar los artículos. Intenta nuevamente más tarde.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostsPerPage();
  }, [currentPage]);

  const handleDeleteSuccess = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const renderSkeletons = Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
    <div
      key={i}
      className='rounded-3xl overflow-hidden shadow-xl flex flex-col'>
      <Skeleton className='w-full h-56' />
      <div className='p-6 space-y-3'>
        <Skeleton className='w-24 h-4' />
        <Skeleton className='w-full h-6' />
        <Skeleton className='w-full h-4' />
        <Skeleton className='w-1/2 h-4' />
        <div className='flex justify-between items-center mt-4'>
          <Skeleton className='w-20 h-4' />
          <Skeleton className='w-24 h-8' />
        </div>
      </div>
    </div>
  ));

  return (
    <section
      id='blog'
      className='py-24 bg-background text-foreground'
      aria-labelledby='blog-heading'>
      <div className='container mx-auto px-4'>
        <header className='text-center mb-16 space-y-4'>
          <h2
            id='blog-heading'
            className='text-3xl md:text-4xl font-bold text-primary'>
            Blog
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto text-lg'>
            Artículos y recursos para tu bienestar emocional y desarrollo
            personal.
          </p>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch'>
          {isLoading
            ? renderSkeletons
            : posts.map((post) => (
                <article
                  key={post.id}
                  className='group rounded-3xl overflow-hidden shadow-xl transition-transform duration-500 hover:scale-[1.02] flex flex-col'
                  aria-labelledby={`post-title-${post.id}`}>
                  <div className='relative w-full h-56'>
                    <Image
                      src={post.image_url}
                      alt={`Imagen del artículo: ${post.title}`}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      className='object-cover object-center'
                      priority
                    />

                    {isAdmin && (
                      <div className='absolute top-3 right-2 z-10'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full bg-accent hover:bg-accent/90'
                              aria-label={`Opciones del post ${post.title}`}>
                              <MoreVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/posts/edit/${post.slug}`}
                                className='text-blue-500 w-full justify-start pl-3'>
                                <PencilIcon className='text-blue-500 mr-2 h-4 w-4' />{' '}
                                Editar
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <AlertDeletePostButton
                                post={post}
                                onDeleteSuccess={handleDeleteSuccess}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col h-64 justify-between p-6 bg-card text-card-foreground'>
                    <div className='space-y-2'>
                      <span className='text-sm font-medium text-primary'>
                        {post.category}
                      </span>
                      <h3
                        id={`post-title-${post.id}`}
                        className='text-xl font-semibold leading-snug'>
                        {post.title}
                      </h3>
                      <p className='text-sm text-muted-foreground line-clamp-3'>
                        {post.summary}
                      </p>
                    </div>

                    <div className='mt-6 flex items-center justify-between'>
                      <time
                        dateTime={post.created_at}
                        className='text-sm text-muted-foreground'>
                        {new Date(post.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>

                      <Button
                        asChild
                        size='sm'
                        aria-label={`Leer artículo completo: ${post.title}`}>
                        <Link href={`/blog/${post.slug}`}>Leer artículo</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
        </div>

        <nav
          className='mt-12 flex justify-center gap-4'
          role='navigation'
          aria-label='Paginación de publicaciones del blog'>
          <Button
            variant='outline'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label='Página anterior'>
            Anterior
          </Button>
          <span className='text-sm text-muted-foreground mt-2'>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant='outline'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            aria-label='Página siguiente'>
            Siguiente
          </Button>
        </nav>
      </div>
    </section>
  );
}
