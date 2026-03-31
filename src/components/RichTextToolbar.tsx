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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && onImagePaste) {
            const file = e.target.files[0];
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
                    if (url.startsWith('data:')) {
                        const refId = `img_${Date.now().toString(36)}`;
                        const cleanedText = currentVal.replace(loadingStr, `\n![Image][${refId}]\n`);
                        onChange(cleanedText + `\n\n[${refId}]: ${url}\n`);
                    } else {
                        onChange(currentVal.replace(loadingStr, `\n![Image](${url})\n`));
                    }
                } else {
                    onChange(currentVal.replace(loadingStr, ''));
                }
            }, 100);
            
            // Clear input
            e.target.value = '';
        } else if (onImageInsert) {
             onImageInsert();
        }
    };

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
                                if (url.startsWith('data:')) {
                                    const refId = `img_${Date.now().toString(36)}`;
                                    const cleanedText = currentVal.replace(loadingStr, `\n![Image][${refId}]\n`);
                                    onChange(cleanedText + `\n\n[${refId}]: ${url}\n`);
                                } else {
                                    onChange(currentVal.replace(loadingStr, `\n![Image](${url})\n`));
                                }
                            } else {
                                onChange(currentVal.replace(loadingStr, ''));
                            }
                        }, 100);

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

    const headingComponents = {
        h1: ({ node, children, ...props }: any) => {
            const text = String(children).replace(/\s+/g, ' ').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h2 id={id} className="text-3xl font-black mt-12 mb-6 text-white scroll-mt-24" {...props}>{children}</h2>;
        },
        h2: ({ node, children, ...props }: any) => {
            const text = String(children).replace(/\s+/g, ' ').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h2 id={id} className="text-2xl font-black mt-10 mb-5 text-white scroll-mt-24" {...props}>{children}</h2>;
        },
        h3: ({ node, children, ...props }: any) => {
            const text = String(children).replace(/\s+/g, ' ').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h3 id={id} className="text-xl font-bold mt-8 mb-4 text-white scroll-mt-24" {...props}>{children}</h3>;
        },
        p: ({ node, ...props }: any) => <p className="mb-6 leading-8 text-lg" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-8 space-y-3" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-8 space-y-3" {...props} />,
        li: ({ node, ...props }: any) => <li className="text-gray-300" {...props} />,
        blockquote: ({ node, ...props }: any) => (
            <blockquote className="border-l-4 border-green-500 bg-green-500/5 p-6 rounded-r-2xl italic mb-8 mt-4" {...props} />
        ),
        strong: ({ node, ...props }: any) => <strong className="font-black text-white px-0.5" {...props} />,
        em: ({ node, ...props }: any) => <em className="italic text-gray-300" {...props} />,
        img: ({ node, ...props }: any) => (
            <div className="my-10 overflow-hidden flex justify-center bg-black/20 rounded-2xl p-2">
                <img className="rounded-xl shadow-xl mx-auto object-contain" style={{ width: 'auto', maxWidth: '100%', maxHeight: '600px' }} {...props} />
                {props.alt && <p className="text-center text-sm text-gray-500 mt-3 italic font-medium">{props.alt}</p>}
            </div>
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm" {...props}>{children}</code>
            ) : (
                <pre className="bg-gray-900 border border-gray-800 p-5 rounded-2xl overflow-x-auto my-8">
                    <code className="text-green-400 font-mono text-sm" {...props}>{children}</code>
                </pre>
            );
        }
    };

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
                {(onImageInsert || onImagePaste) && (
                    <>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileInput} 
                            className="hidden" 
                            accept="image/*" 
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current ? fileInputRef.current.click() : onImageInsert?.()}
                            title="Insert Image"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"
                        >
                            <ImageIcon size={16} />
                        </button>
                    </>
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
                    className={`w-full h-[600px] p-8 rounded-b-xl border ${theme.border} bg-gray-900 overflow-y-auto`}
                >
                    <article className="prose prose-invert prose-green max-w-none text-gray-300 leading-relaxed font-sans">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={headingComponents}
                        >
                            {value || '*Start typing to preview...*'}
                        </ReactMarkdown>
                    </article>
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
