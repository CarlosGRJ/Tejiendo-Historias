'use client';

import { useCallback, useEffect, useState } from 'react';
import { CommentType } from '@/types/blog';
import CommentForm from '../forms/CommentForm';
import { getComments } from '@/actions/blog/comments';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthProvider';
import { AlertDeleteCommentButton } from '../ui/alert-delete-comment-button';

interface CommentsSectionProps {
  postId: string;
}

const PAGE_SIZE = 5;

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const { isAuthenticated, user } = useAuth();

  const loadComments = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      const offset = reset ? 0 : page * PAGE_SIZE;
      const { comments, count } = await getComments(postId, PAGE_SIZE, offset);
      if (count !== undefined) setTotalCount(count);

      if (comments.length < PAGE_SIZE) setHasMore(false);

      setComments((prev) => (reset ? comments : [...prev, ...comments]));
      setPage((prev) => (reset ? 1 : prev + 1));
      setIsLoading(false);
    },
    [page, postId],
  );

  useEffect(() => {
    loadComments(true);
  }, [loadComments]);

  const handleDeleteSuccess = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  return (
    <section
      aria-labelledby='comments-title'
      className='mt-12 space-y-6 border-t pt-6'>
      <h2 id='comments-title' className='text-2xl font-semibold'>
        Comentarios ({totalCount})
      </h2>

      <CommentForm postId={postId} setComments={setComments} />

      <div className='space-y-4'>
        {comments.length === 0 && !isLoading ? (
          <p className='text-muted-foreground text-sm'>
            Aún no hay comentarios.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className='rounded-md border p-4 relative'
              aria-label={`Comentario de ${comment.name}`}>
              <p className='text-sm font-semibold'>{comment.name}</p>
              <p className='text-sm my-3 whitespace-pre-wrap'>
                {comment.content}
              </p>
              <span className='block text-xs text-muted-foreground'>
                {comment.created_at
                  ? new Date(comment.created_at).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Fecha desconocida'}
              </span>

              {isAuthenticated && (
                <AlertDeleteCommentButton
                  comment={comment}
                  user={user}
                  onDeleteSuccess={
                    handleDeleteSuccess
                  }></AlertDeleteCommentButton>
              )}
            </article>
          ))
        )}

        {hasMore && (
          <div className='text-center'>
            <Button
              onClick={() => loadComments()}
              disabled={isLoading}
              aria-label='Cargar más comentarios'>
              {isLoading ? 'Cargando...' : 'Cargar más'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
