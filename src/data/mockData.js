export const courses = [
    {
        id: 1,
        title: 'Machine Learning Fundamentals',
        instructor: 'Dr. Laila Hassan',
        rating: 4.8,
        reviews: 124,
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Beginner',
        lessons: 24,
        duration: '12h 30m',
        description: 'Take your first steps into the world of Artificial Intelligence. This course covers everything from basic statistics to building your first predictive models using industry-standard tools.',
        highlights: [
            'Understand the mathematical foundations of ML',
            'Build and train predictive models using Scikit-Learn',
            'Implement supervised and unsupervised learning algorithms',
            'Evaluate model performance using advanced metrics',
            'Deploy ML models to production environments',
            'Real-world case studies in computer vision and NLP'
        ]
    },
    {
        id: 2,
        title: 'Advanced React Patterns',
        instructor: 'Ahmed Mansour',
        rating: 4.9,
        reviews: 85,
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Development',
        level: 'Advanced',
        lessons: 18,
        duration: '8h 45m',
        description: 'Level up your React skills by mastering advanced patterns used in large-scale applications. Learn how to build highly performant, scalable, and maintainable components.',
        highlights: [
            'Master Higher-Order Components and Render Props',
            'Implement advanced state management with Context API',
            'Build highly reusable and performant custom hooks',
            'Understand React Fiber and concurrent rendering',
            'Optimize application performance using memoization',
            'Architect large-scale React apps with best practices'
        ]
    },
    {
        id: 3,
        title: 'UX Design for AI Interfaces',
        instructor: 'Dr. Laila Hassan',
        rating: 4.7,
        reviews: 62,
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Design',
        level: 'Intermediate',
        lessons: 32,
        duration: '15h 00m',
        description: 'Design the future of human-AI interaction. Learn how to create user-centric interfaces for AI systems that are transparent, ethical, and easy to use.',
        highlights: [
            'Learn the principles of human-centered AI design',
            'Create intuitive interfaces for complex AI workflows',
            'Design conversational UI and voice interactive systems',
            'Address ethical considerations and AI transparency',
            'Prototype AI-driven features with modern tools',
            'Conduct user research for AI-powered products'
        ]
    },
    {
        id: 4,
        title: 'Python for Finance',
        instructor: 'Ahmed Mansour',
        rating: 4.6,
        reviews: 43,
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Finance',
        level: 'Intermediate',
        lessons: 28,
        duration: '14h 20m',
        description: 'Master the tools used by financial analysts and algorithmic traders. Learn how to leverage Python to analyze market trends, assess risk, and automate trading strategies.',
        highlights: [
            'Analyze stock market data using Pandas and NumPy',
            'Implement financial modeling and risk assessment',
            'Build automated trading systems with historical data',
            'Visualize financial trends with Matplotlib',
            'Calculate portfolio optimization and asset allocation',
            'Understand algorithmic trading strategies and execution'
        ]
    },
    {
        id: 5,
        title: 'Python for Beginners',
        instructor: 'Ahmed Mansour',
        rating: 4.7,
        reviews: 210,
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Development',
        level: 'Beginner',
        lessons: 20,
        duration: '10h 00m',
        description: 'Start your coding journey with the most popular programming language. No prior experience required. You will learn everything from basic syntax to building real apps.',
        highlights: [
            'Learn Python syntax and basic data types',
            'Master control flow, loops, and conditional logic',
            'Write clean, modular code with functions',
            'Work with files, APIs, and external data sources',
            'Understand Object-Oriented Programming basics',
            'Build simple apps and automate daily tasks'
        ]
    },
    {
        id: 6,
        title: 'Deep Learning with TensorFlow',
        instructor: 'Dr. Laila Hassan',
        rating: 4.9,
        reviews: 178,
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Advanced',
        lessons: 36,
        duration: '20h 15m',
        description: 'Dive deep into neural networks and complex AI architectures. Master TensorFlow to build computer vision systems, natural language processors, and more.',
        highlights: [
            'Build neural networks from scratch with TensorFlow',
            'Understand CNNs for computer vision tasks',
            'Implement RNNs for sequence and time-series data',
            'Work with Generative Adversarial Networks (GANs)',
            'Fine-tune models using Transfer Learning',
            'Monitor training progress with TensorBoard'
        ]
    },
    {
        id: 7,
        title: 'Digital Marketing Fundamentals',
        instructor: 'Ahmed Mansour',
        rating: 4.5,
        reviews: 91,
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Marketing',
        level: 'Beginner',
        lessons: 16,
        duration: '7h 30m',
        description: 'Master the art and science of online growth. Learn how to reach your audience through social media, SEO, email, and paid advertising.',
        highlights: [
            'Create effective social media marketing strategies',
            'Master Search Engine Optimization basics',
            'Design high-converting email marketing campaigns',
            'Understand Google Ads and PPC advertising',
            'Analyze marketing performance with Analytics',
            'Develop a comprehensive content marketing plan'
        ]
    },
    {
        id: 8,
        title: 'Full-Stack Web Development',
        instructor: 'Ahmed Mansour',
        rating: 4.8,
        reviews: 153,
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Development',
        level: 'Intermediate',
        lessons: 48,
        duration: '25h 00m',
        description: 'Learn to build complete, modern web applications from scratch. This intensive course covers frontend, backend, databases, and deployment.',
        highlights: [
            'Build responsive frontends with React and Tailwind',
            'Develop robust backends with Node.js and Express',
            'Implement database systems with MongoDB/PostgreSQL',
            'Secure applications with JWT and multi-level auth',
            'Deploy full-stack apps to cloud platforms',
            'Version control and collaborative workflow with Git'
        ]
    },
    {
        id: 9,
        title: 'Data Analysis with Pandas',
        instructor: 'Dr. Laila Hassan',
        rating: 4.6,
        reviews: 77,
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1551288049-bbdac8a28a80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Intermediate',
        lessons: 22,
        duration: '11h 45m',
        description: 'Master the most powerful library for data manipulation in Python. Learn to clean, filter, aggregate, and analyze complex datasets with ease.',
        highlights: [
            'Master high-performance manipulation with Pandas',
            'Clean and preprocess messy real-world datasets',
            'Perform advanced group-by and pivot operations',
            'Handle time-series data and statistical analysis',
            'Export data to multiple formats (CSV, SQL, etc.)',
            'Integrate Pandas with visualization libraries'
        ]
    },
    {
        id: 10,
        title: 'Stock Market & Investment Basics',
        instructor: 'Dr. Laila Hassan',
        rating: 4.4,
        reviews: 55,
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Finance',
        level: 'Beginner',
        lessons: 14,
        duration: '6h 00m',
        description: 'Take control of your financial future. This course simplifies the stock market and teaches you how to start investing safely and intelligently.',
        highlights: [
            'Understand how the stock market works from scratch',
            'Learn how to read financial statements and reports',
            'Execute your first trade on a broker platform',
            'Understand stocks, bonds, and ETFs',
            'Implement long-term value investing strategies',
            'Manage investment risk and build a portfolio'
        ]
    },
];

export const categories = [
    { id: 1, name: 'Development', count: 120, icon: 'Code2' },
    { id: 2, name: 'Data Science', count: 85, icon: 'BarChart3' },
    { id: 3, name: 'Design', count: 64, icon: 'Palette' },
    { id: 4, name: 'Marketing', count: 42, icon: 'Megaphone' },
    { id: 5, name: 'Business', count: 56, icon: 'Briefcase' },
    { id: 6, name: 'Finance', count: 38, icon: 'DollarSign' },
];

export const testimonials = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "Software Engineer",
        content: "The AI tutor on this platform is a game changer. It's like having a senior developer sitting next to you explaining concepts.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 2,
        name: "Maria Garcia",
        role: "Data Analyst",
        content: "I love how the course content adapts to my learning speed. The personalized quizzes help me retain information much better.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 3,
        name: "David Kim",
        role: "Student",
        content: "Highly recommended for anyone looking to upskill quickly. The curriculum is top-notch and the community is very supportive.",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg"
    }
];
