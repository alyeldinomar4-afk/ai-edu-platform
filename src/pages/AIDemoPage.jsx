import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const AIDemoPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hi! I\'m your AI Learning Assistant. 👋\n\nI can help you with:\n• Explaining complex concepts\n• Answering questions about courses\n• Providing code examples\n• Summarizing video lessons\n\nWhat would you like to learn today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        // Use multiple timeouts to catch different stages of rendering/animation
        // Immediate scroll
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        // After short delay
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);

        // After medium delay (animation mid-point)
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 150);

        // After long delay (animation complete)
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 300);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Demo responses for different topics
    const getDemoResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();

        if (msg.includes('react') || msg.includes('component')) {
            return 'Great question about React! 🚀\n\nReact components are the building blocks of React applications. Here\'s a simple example:\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\nComponents can be:\n• **Functional** (like above) - simpler, use hooks\n• **Class-based** - older style, more verbose\n\nWould you like me to explain hooks like useState or useEffect?';
        }

        if (msg.includes('python') || msg.includes('loop')) {
            return 'Python is awesome for beginners! 🐍\n\nHere\'s a simple for loop example:\n\n```python\nfor i in range(5):\n    print(f"Number: {i}")\n```\n\nThis will print numbers 0 through 4. The `range()` function generates a sequence of numbers.\n\nNeed help with something specific in Python?';
        }

        if (msg.includes('machine learning') || msg.includes('ml') || msg.includes('ai')) {
            return 'Machine Learning is fascinating! 🤖\n\nHere are the main types:\n\n**1. Supervised Learning**\n   - Learn from labeled data\n   - Examples: Classification, Regression\n\n**2. Unsupervised Learning**\n   - Find patterns in unlabeled data\n   - Examples: Clustering, Dimensionality Reduction\n\n**3. Reinforcement Learning**\n   - Learn through trial and error\n   - Examples: Game AI, Robotics\n\nWhich area interests you most?';
        }

        if (msg.includes('help') || msg.includes('what can you do')) {
            return 'I\'m here to make learning easier! ✨\n\nI can help you with:\n\n📚 **Course Content**\n   - Explain difficult concepts\n   - Provide additional examples\n   - Summarize video lessons\n\n💻 **Code Help**\n   - Debug your code\n   - Explain syntax\n   - Suggest best practices\n\n🎯 **Learning Path**\n   - Recommend courses\n   - Create study plans\n   - Track your progress\n\nJust ask me anything!';
        }

        // Default response
        return `That's an interesting question! 💡\n\nWhile this is a demo, in the full version I would provide detailed explanations about "${userMessage}".\n\nI can help with topics like:\n• Programming (Python, JavaScript, React)\n• Machine Learning & AI\n• Web Development\n• Data Science\n\nTry asking about one of these topics!`;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                role: 'assistant',
                content: getDemoResponse(input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "Explain React components",
        "How do Python loops work?",
        "What is Machine Learning?",
        "Help me learn JavaScript"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">AI Learning Assistant</h1>
                                <p className="text-sm text-slate-500">Your personal tutor, available 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col"
                    style={{ height: 'calc(100vh - 280px)' }}
                >
                    {/* Messages */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant'
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        }`}>
                                        {message.role === 'assistant' ? (
                                            <Bot className="w-5 h-5 text-white" />
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                                        <div className={`rounded-2xl p-4 ${message.role === 'assistant'
                                            ? 'bg-slate-50 text-slate-800'
                                            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                            }`}>
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                {message.content}
                                            </div>
                                        </div>
                                        <div className={`text-xs text-slate-400 mt-1 px-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing Indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}


                    </div>

                    {/* Suggested Questions (only show if few messages) */}
                    {messages.length <= 2 && (
                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                            <p className="text-xs text-slate-500 mb-2">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((question, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(question)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about your courses..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                disabled={isTyping}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="px-6"
                            >
                                {isTyping ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center">
                            This is a demo. Responses are simulated for demonstration purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDemoPage;
