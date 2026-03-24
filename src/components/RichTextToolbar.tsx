import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Bold, Italic, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code, Minus,
    Image as ImageIcon, Eye, EyeOff, Link as LinkIcon
} from 'lucide-react';

interface RichTextToolbarProps {
    value: string;
    onChange: (val: string) => void;
    theme: any;
    onImageInsert?: () => void;
    onImagePaste?: (file: File) => Promise<string | undefined>;
}

type ToolbarAction = {
    icon: React.ReactNode;
    label: string;
    action: (text: string, selStart: number, selEnd: number) => { newText: string; newCursor: number };
};

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ value, onChange, theme, onImageInsert, onImagePaste }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handlePaste = async (e: React.ClipboardEvent) => {
        // Handle image paste
        if (onImagePaste) {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        e.preventDefault();
                        
                        const el = textareaRef.current;
                        if (!el) return;

                        const start = el.selectionStart;
                        const end = el.selectionEnd;
                        const before = value.substring(0, start);
                        const after = value.substring(end);
                        const loadingStr = `\n![Uploading image...]()\n`;
                        onChange(before + loadingStr + after);

                        const url = await onImagePaste(file);
                        
                        // Replace placeholder with final result
                        setTimeout(() => {
                            const currentVal = textareaRef.current?.value || '';
                            if (url) {
                                onChange(currentVal.replace(loadingStr, `\n![Image](${url})\n`));
                            } else {
                                onChange(currentVal.replace(loadingStr, ''));
                            }
                        }, 50);

                        return;
                    }
                }
            }
        }

        // Handle HTML formatting paste
        const html = e.clipboardData.getData('text/html');
        if (html) {
            e.preventDefault();
            // Basic HTML to Markdown converter
            let parsed = html
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<(b|strong)[^>]*>(.*?)<\/\1>/gi, '**$2**')
                .replace(/<(i|em)[^>]*>(.*?)<\/\1>/gi, '*$2*')
                .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (match, level, content) => {
                    return '\n\n' + '#'.repeat(parseInt(level)) + ' ' + content + '\n\n';
                })
                .replace(/<[^>]+>/g, '') // Strip remaining tags
                // Clean up html entities
                .replace(/&nbsp;/g, ' ')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');

            // Clean up extra spaces/newlines
            parsed = parsed.replace(/\n{3,}/g, '\n\n').trim();

            const el = textareaRef.current;
            if (el) {
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const before = value.substring(0, start);
                const after = value.substring(end);
                onChange(before + parsed + after);
                requestAnimationFrame(() => {
                    el.focus();
                    el.setSelectionRange(start + parsed.length, start + parsed.length);
                });
            }
        }
    };

    const applyFormat = (
        prefix: string,
        suffix: string = '',
        blockMode = false
    ) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = value.slice(start, end);

        let newText: string;
        let newCursorStart: number;
        let newCursorEnd: number;

        if (blockMode) {
            // Insert on new line with prefix
            const before = value.slice(0, start);
            const after = value.slice(end);
            const linePrefix = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
            const insertion = `${linePrefix}${prefix}${selected || 'Text here'}`;
            newText = before + insertion + after;
            newCursorStart = start + linePrefix.length + prefix.length;
            newCursorEnd = newCursorStart + (selected || 'Text here').length;
        } else {
            const before = value.slice(0, start);
            const after = value.slice(end);
            const wrapped = `${prefix}${selected || 'text'}${suffix}`;
            newText = before + wrapped + after;
            newCursorStart = start + prefix.length;
            newCursorEnd = newCursorStart + (selected || 'text').length;
        }

        onChange(newText);
        // Restore focus and selection after React re-render
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(newCursorStart, newCursorEnd);
        });
    };

    const insertLink = () => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = value.slice(start, end) || 'Link Text';
        const before = value.slice(0, start);
        const after = value.slice(end);
        const insertion = `[${selected}](https://example.com)`;
        const newText = before + insertion + after;
        onChange(newText);
        requestAnimationFrame(() => {
            el.focus();
            // Select the URL part so user can type it
            const urlStart = start + selected.length + 3;
            el.setSelectionRange(urlStart, urlStart + 19);
        });
    };

    const toolbarButtons = [
        {
            group: 'Headings',
            items: [
                { icon: <Heading1 size={16} />, label: 'H1', action: () => applyFormat('# ', '', true) },
                { icon: <Heading2 size={16} />, label: 'H2', action: () => applyFormat('## ', '', true) },
                { icon: <Heading3 size={16} />, label: 'H3', action: () => applyFormat('### ', '', true) },
            ]
        },
        {
            group: 'Formatting',
            items: [
                { icon: <Bold size={16} />, label: 'Bold', action: () => applyFormat('**', '**') },
                { icon: <Italic size={16} />, label: 'Italic', action: () => applyFormat('*', '*') },
                { icon: <LinkIcon size={16} />, label: 'Link', action: insertLink },
            ]
        },
        {
            group: 'Blocks',
            items: [
                { icon: <List size={16} />, label: 'Bullet List', action: () => applyFormat('- ', '', true) },
                { icon: <ListOrdered size={16} />, label: 'Numbered List', action: () => applyFormat('1. ', '', true) },
                { icon: <Quote size={16} />, label: 'Blockquote', action: () => applyFormat('> ', '', true) },
                { icon: <Code size={16} />, label: 'Code Block', action: () => applyFormat('\n```\n', '\n```\n') },
                { icon: <Minus size={16} />, label: 'Divider', action: () => applyFormat('\n---\n', '') },
            ]
        },
    ];

    return (
        <div className="flex flex-col gap-0">
            {/* Toolbar */}
            <div className={`flex items-center gap-1 flex-wrap p-2 rounded-t-xl border ${theme.border} border-b-0 bg-gray-900/60`}>
                {toolbarButtons.map((group, gi) => (
                    <React.Fragment key={gi}>
                        {gi > 0 && <div className="w-px h-5 bg-gray-700 mx-1" />}
                        {group.items.map((btn, bi) => (
                            <button
                                key={bi}
                                type="button"
                                onClick={btn.action}
                                title={btn.label}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all active:scale-90"
                            >
                                {btn.icon}
                            </button>
                        ))}
                    </React.Fragment>
                ))}

                {/* Divider */}
                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Image Insert */}
                {onImageInsert && (
                    <button
                        type="button"
                        onClick={onImageInsert}
                        title="Insert Image"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"
                    >
                        <ImageIcon size={16} />
                    </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Preview Toggle */}
                <button
                    type="button"
                    onClick={() => setShowPreview(p => !p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showPreview
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                >
                    {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showPreview ? 'Edit' : 'Preview'}
                </button>
            </div>

            {/* Editor / Preview Area */}
            {showPreview ? (
                <div
                    className={`w-full min-h-96 p-5 rounded-b-xl border ${theme.border} bg-gray-900/40 overflow-auto`}
                >
                    <div className="prose prose-invert prose-green max-w-none text-sm leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {value || '*Start typing to preview...*'}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onPaste={handlePaste}
                    className={`w-full p-4 rounded-b-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 min-h-96 resize-y font-mono text-sm leading-relaxed transition-colors`}
                    placeholder={`# Article Title\n\n## Introduction\n\nWrite your content here using Markdown...\n\n## Section 2\n\n- Bullet point 1\n- Bullet point 2\n\n**Bold text**, *italic text*`}
                    spellCheck
                />
            )}
        </div>
    );
};
