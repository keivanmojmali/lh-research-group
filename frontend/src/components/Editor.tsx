// Editor.tsx
import React from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { v4 as uuidv4 } from 'uuid';
import '@blocknote/mantine/style.css';

type PartialBlock = {
    id?: string;
    type?: string;
    props?: Partial<Record<string, any>>;
    content?: string;
    children?: PartialBlock[];
};

interface EditorProps {
    initialContent: PartialBlock[];
    onChange: (content: any) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChange }) => {
    // Initialize the editor with given content
    const editor = useCreateBlockNote({
        //@ts-ignore
        initialContent: initialContent && initialContent.length > 0 ? initialContent : [{ id: uuidv4(), type: 'paragraph', content: '' }],
    });

    return (
        <BlockNoteView
            id={uuidv4()}
            editor={editor}
            theme={'light'}
            editable={true}
            slashMenu={true}
            onChange={() => {
                onChange(JSON.stringify(editor.document))
            }}
        />
    );
};

export default Editor;
