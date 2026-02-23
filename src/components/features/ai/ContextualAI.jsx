import { useState } from 'react';
import { Send, Zap, Bot, User } from 'lucide-react';

const ContextualAI = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: "Hello! I'm watching this video with you. Feel free to ask me to summarize key points or explain complex concepts." }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input }]);
        setInput('');

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: "That's a great question! Based on the video content, the instructor explains that..."
            }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 transition-colors">
            <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Zap className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">AI Tutor</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'ai'
                            ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none'
                            : 'bg-primary text-white rounded-tr-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                        Summarize this section
                    </button>
                    <button className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                        Create a quiz
                    </button>
                    <button className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                        Explain code
                    </button>
                </div>
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        placeholder="Ask about the video..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContextualAI;
