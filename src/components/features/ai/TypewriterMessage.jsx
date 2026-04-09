import { useState, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

const CodeBlock = ({ content }) => {
    const lines = content.trim().split('\n');
    const language = lines[0].trim();
    const code = lines.slice(1).join('\n');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-3 rounded-xl overflow-hidden shadow-sm dark:shadow-lg bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/50 font-sans">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#131C31] border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-[0_0_5px_rgba(248,113,113,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/90 shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{language || 'text'}</span>
                    <button 
                        onClick={handleCopy}
                        className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                        title="Copy code"
                    >
                        {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>
            <div className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <pre className="text-[13px] text-slate-700 dark:text-slate-300 font-mono leading-relaxed" dir="ltr">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

const TypewriterMessage = ({ text, isNew }) => {
    // We only trigger the typewriter effect explicitly for new AI messages
    const [displayedText, setDisplayedText] = useState(isNew ? '' : text);
    const [isTyping, setIsTyping] = useState(isNew);

    useEffect(() => {
        if (!isNew) {
            setDisplayedText(text);
            return;
        }

        let currentIndex = 0;
        const speed = 15; // Typewriter speed (ms per char)
        
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                const nextChar = text.charAt(currentIndex);
                setDisplayedText(prev => prev + nextChar);
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, isNew]);

    // Parse the displayed text for code blocks and basic markdown
    const parseText = (rawText) => {
        // Advanced split that handles incomplete code blocks gracefully during typing
        const parts = rawText.split(/(```[\s\S]*?```)/g);
        
        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const content = part.slice(3, -3);
                return <CodeBlock key={index} content={content} />;
            }
            
            // Format basic bold (**text**)
            const formattedText = part.split(/(\*\*.*?\*\*)/g).map((subPart, i) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={i} className="text-slate-900 dark:text-white font-bold">{subPart.slice(2, -2)}</strong>;
                }
                return subPart;
            });
            
            return <span key={index} className="whitespace-pre-wrap">{formattedText}</span>;
        });
    };

    return (
        <div className="w-full">
            {parseText(displayedText)}
            {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-indigo-400 animate-pulse rounded-sm shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
        </div>
    );
};

export default TypewriterMessage;
