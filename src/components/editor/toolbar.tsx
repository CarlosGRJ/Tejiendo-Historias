'use client';

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor | null;
}

export function TiptapToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div
      role='toolbar'
      aria-label='Barra de herramientas del editor'
      className='flex flex-wrap items-center gap-2 border rounded-lg p-2 bg-card mb-4'>
      {/* Formatos inline */}
      <ToggleGroup type='multiple' aria-label='Formato de texto'>
        <ToggleGroupItem
          value='bold'
          aria-label='Negritas'
          data-state={editor.isActive('bold') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className='w-4 h-4' />
        </ToggleGroupItem>

        <ToggleGroupItem
          value='italic'
          aria-label='Cursiva'
          data-state={editor.isActive('italic') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className='w-4 h-4' />
        </ToggleGroupItem>

        <ToggleGroupItem
          value='code'
          aria-label='Código'
          data-state={editor.isActive('code') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className='w-4 h-4' />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Títulos (uno a la vez) */}
      <ToggleGroup type='single' aria-label='Niveles de encabezado'>
        <ToggleGroupItem
          value='h1'
          aria-label='Encabezado nivel 1'
          data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }>
          <Heading1 className='w-4 h-4' />
        </ToggleGroupItem>

        <ToggleGroupItem
          value='h2'
          aria-label='Encabezado nivel 2'
          data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }>
          <Heading2 className='w-4 h-4' />
        </ToggleGroupItem>

        <ToggleGroupItem
          value='h3'
          aria-label='Encabezado nivel 3'
          data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }>
          <Heading3 className='w-4 h-4' />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Listas y bloque */}
      <ToggleGroup type='multiple' aria-label='Listas y bloques'>
        <ToggleGroupItem
          value='bulletList'
          aria-label='Lista con viñetas'
          data-state={editor.isActive('bulletList') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className='w-4 h-4' />
        </ToggleGroupItem>

        <ToggleGroupItem
          value='orderedList'
          aria-label='Lista ordenada'
          data-state={editor.isActive('orderedList') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className='w-4 h-4' />
        </ToggleGroupItem>

        <ToggleGroupItem
          value='blockquote'
          aria-label='Cita'
          data-state={editor.isActive('blockquote') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className='w-4 h-4' />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation='vertical' className='h-6 mx-2' />

      {/* Deshacer y Rehacer */}
      <Button
        type='button'
        size='icon'
        variant='ghost'
        onClick={() => editor.chain().focus().undo().run()}
        aria-label='Deshacer'>
        <Undo className='w-4 h-4' />
      </Button>

      <Button
        type='button'
        size='icon'
        variant='ghost'
        onClick={() => editor.chain().focus().redo().run()}
        aria-label='Rehacer'>
        <Redo className='w-4 h-4' />
      </Button>
    </div>
  );
}
