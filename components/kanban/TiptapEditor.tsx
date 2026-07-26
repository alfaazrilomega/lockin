'use client';

// safe client-only tiptap loader for SSR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useEditor: any = () => null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let EditorContent: any = () => null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let StarterKit: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TaskList: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TaskItem: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Placeholder: any = null;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const tiptapReact = require('@tiptap/react');
  useEditor = tiptapReact.useEditor;
  EditorContent = tiptapReact.EditorContent;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  StarterKit = require('@tiptap/starter-kit').default || require('@tiptap/starter-kit');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  TaskList = require('@tiptap/extension-task-list').default || require('@tiptap/extension-task-list');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  TaskItem = require('@tiptap/extension-task-item').default || require('@tiptap/extension-task-item');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Placeholder = require('@tiptap/extension-placeholder').default || require('@tiptap/extension-placeholder');
}

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export function TiptapEditor({
  content,
  onBlur,
}: {
  content: string;
  onBlur: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Add a detailed description...' }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-sm font-satoshi',
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBlur: ({ editor }: { editor: any }) => {
      onBlur(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-md bg-card overflow-hidden shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/20 p-1.5 rounded-t-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
        >
          Italic
        </Button>
        <Separator orientation="vertical" className="h-4 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          Todo
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
