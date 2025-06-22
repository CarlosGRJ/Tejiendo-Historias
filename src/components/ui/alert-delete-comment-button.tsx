import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { CommentType } from '@/types/blog';
import { deleteComment } from '@/actions/blog/comments';
import { User } from '@supabase/supabase-js';

interface Props {
  comment: CommentType;
  onDeleteSuccess: (id: string) => void;
  user: User | null;
}

export function AlertDeleteCommentButton({
  comment,
  onDeleteSuccess,
  user,
}: Props) {
  const handleDelete = async () => {
    try {
      await deleteComment(comment.id, user);
      toast.success('Post eliminado');
      onDeleteSuccess(comment.id);
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al eliminar el Comentario');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='absolute top-2 right-1 text-destructive'
          aria-label='Eliminar comentario'>
          <Trash2Icon className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            comentario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            variant='destructive'
            onClick={handleDelete}
            aria-label='Eliminar comentario'>
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
