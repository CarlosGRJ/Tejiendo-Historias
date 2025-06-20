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
import { deletePost } from '@/actions/blog/posts';
import { Post } from '@/types/blog';

interface Props {
  post: Post;
  onDeleteSuccess: (id: string) => void;
}

export function AlertDeletePostButton({ post, onDeleteSuccess }: Props) {
  const handleDelete = async () => {
    try {
      await deletePost(post.id, post.image_url);
      toast.success('Post eliminado');
      onDeleteSuccess(post.id);
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al eliminar el post');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          className='text-destructive w-full justify-start'>
          <Trash2Icon className='mr-2 h-4 w-4' /> Borrar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            artículo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant='destructive' onClick={handleDelete}>
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
