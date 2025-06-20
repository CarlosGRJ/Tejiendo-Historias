'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { TiptapToolbar } from './toolbar';

interface TiptapEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert w-full max-w-full min-h-[200px] border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent break-words overflow-hidden',
        role: 'textbox',
        'aria-label': 'Editor de contenido del artículo',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <section aria-labelledby='editor-heading' className='space-y-2'>
      <h2 id='editor-heading' className='sr-only'>
        Editor de contenido
      </h2>
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </section>
  );
}
