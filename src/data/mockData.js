export const courses = [
    {
        id: 1,
        title: 'Machine Learning Fundamentals',
        instructor: 'Dr. Laila Hassan',
        instructorId: 1,
        instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        rating: 4.8,
        reviews: 124,
        price: 19.99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Beginner',
        lessons: 24,
        duration: 45000, // 12h 30m
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
        instructorId: 2,
        instructorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        rating: 4.9,
        reviews: 85,
        price: 24.99,
        discount: 15,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Development',
        level: 'Advanced',
        lessons: 18,
        duration: 31500, // 8h 45m
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
        instructorId: 1,
        instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        rating: 4.7,
        reviews: 62,
        price: 14.99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Design',
        level: 'Intermediate',
        lessons: 32,
        duration: 54000, // 15h 00m
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
        instructorId: 2,
        instructorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        rating: 4.6,
        reviews: 43,
        price: 18.99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Finance',
        level: 'Intermediate',
        lessons: 28,
        duration: 51600, // 14h 20m
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
        instructorId: 2,
        instructorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        rating: 4.7,
        reviews: 210,
        price: 0,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Development',
        level: 'Beginner',
        lessons: 20,
        duration: 36000, // 10h 00m
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
        instructorId: 1,
        instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        rating: 4.9,
        reviews: 178,
        price: 29.99,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Advanced',
        lessons: 36,
        duration: 72900, // 20h 15m
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
        instructorId: 2,
        instructorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        rating: 4.5,
        reviews: 91,
        price: 11.99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Marketing',
        level: 'Beginner',
        lessons: 16,
        duration: 27000, // 7h 30m
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
        instructorId: 2,
        instructorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        rating: 4.8,
        reviews: 153,
        price: 34.99,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Development',
        level: 'Intermediate',
        lessons: 48,
        duration: 90000, // 25h 00m
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
        instructorId: 1,
        instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        rating: 4.6,
        reviews: 77,
        price: 16.99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Intermediate',
        lessons: 22,
        duration: 42300, // 11h 45m
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
        instructorId: 1,
        instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        rating: 4.4,
        reviews: 55,
        price: 15.99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Finance',
        level: 'Beginner',
        lessons: 14,
        duration: 21600, // 6h 00m
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

export const instructors = [
    {
        id: 1,
        name: 'Dr. Laila Hassan',
        role: 'AI Researcher & Educator',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        coursesCount: 15,
        rating: 4.8,
        studentsCount: 2500,
        category: 'Data Science',
        bio: 'Specializing in Machine Learning and AI Ethics with over 10 years of experience in both academia and industry.',
        website: 'https://lailahassan.ai',
        linkedin: 'https://linkedin.com/in/lailahassan',
        twitter: 'https://twitter.com/lailahassan'
    },
    {
        id: 2,
        name: 'Ahmed Mansour',
        role: 'Senior Full-Stack Developer',
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        coursesCount: 12,
        rating: 4.9,
        studentsCount: 3800,
        category: 'Development',
        bio: 'Passionate about building scalable web applications and teaching modern frameworks to the next generation of developers.',
        website: 'https://ahmedmansour.dev',
        linkedin: 'https://linkedin.com/in/ahmedmansour'
    }
];

export const categories = [
    { id: 1, name: 'Development', count: 120, icon: 'Code2', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 2, name: 'Data Science', count: 85, icon: 'BarChart3', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { id: 3, name: 'Design', count: 64, icon: 'Palette', color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
    { id: 4, name: 'Marketing', count: 42, icon: 'Megaphone', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { id: 5, name: 'Photography', count: 56, icon: 'Camera', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
    { id: 6, name: 'Finance', count: 38, icon: 'DollarSign', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
];

export const users = [
    {
        id: 1,
        name: "Student User",
        email: "user@test.com",
        role: "learner",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        id: 2,
        name: "Admin User",
        email: "admin@test.com",
        role: "admin",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    }
];

export const globalStats = {
    totalUsers: 1540,
    activeCourses: 42,
    hoursWatched: 12500
};

export const instructorQuestions = [
    {
        id: 1,
        user: 'Ahmed Ali',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=random',
        course: 'Advanced React Patterns',
        question: 'Could you explain why we use forwardRef in the compound components pattern?',
        date: '2 hours ago',
        reply: ''
    },
    {
        id: 2,
        user: 'Sarah Jenkins',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random',
        course: 'Deep Learning with TensorFlow',
        question: 'I am getting an out-of-bounds error on Pandas dataframes when using iloc. What is the best way to handle indices safely?',
        date: '1 day ago',
        reply: 'Hi Sarah. Check the boundaries of your dataframe before using iloc. You can safely slice by writing df.iloc[0:len(df)], which ensures we do not exceed the max index.'
    },
    {
        id: 3,
        user: 'Mohamed Karim',
        avatar: 'https://ui-avatars.com/api/?name=Mohamed+Karim&background=random',
        course: 'Advanced React Patterns',
        question: 'Is it bad practice to use Context CPU-intensive states?',
        date: '2 days ago',
        reply: ''
    }
];

export const instructorAnnouncements = [
    {
        id: 1,
        course: 'Advanced React Patterns',
        subject: 'New Bonus Section Added!',
        message: 'Hi everyone! I just uploaded 3 new videos covering the latest React 19 hooks. Make sure to check them out in Section 8.',
        date: '2 hours ago',
        sentTo: 1450
    },
    {
        id: 2,
        course: 'All Courses',
        subject: 'Upcoming Live Q&A Session',
        message: 'Join me this Saturday at 2 PM GMT for a live Q&A session on YouTube. Bring your toughest questions!',
        date: '3 days ago',
        sentTo: 5200
    }
];

export const instructorReviews = [
    {
        id: 1,
        user: 'Mohammed Khaled',
        avatar: 'https://ui-avatars.com/api/?name=Mohammed+Khaled&background=random',
        course: 'Advanced React Patterns',
        rating: 5,
        comment: 'Excellent course. The patterns explained here saved me so much time refactoring our company frontend.',
        date: '3 hours ago',
        reply: ''
    },
    {
        id: 2,
        user: 'Youssef Tariq',
        avatar: 'https://ui-avatars.com/api/?name=Youssef+Tariq&background=random',
        course: 'Deep Learning with TensorFlow',
        rating: 4,
        comment: 'Very good introduction, though the pace in section 4 was a bit fast for a beginner.',
        date: '2 days ago',
        reply: 'Thank you for the feedback Youssef! I will look into adding more supplemental material for section 4.'
    },
    {
        id: 3,
        user: 'Nour Ali',
        avatar: 'https://ui-avatars.com/api/?name=Nour+Ali&background=random',
        course: 'Advanced React Patterns',
        rating: 5,
        comment: 'Hands down the best React course I have taken. Clear and concise.',
        date: '1 week ago',
        reply: ''
    }
];

export const testimonials = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "Software Engineer",
        content: "The AI tutor on this platform is a game changer. It's like having a senior developer sitting next to you explaining concepts.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5
    },
    {
        id: 2,
        name: "Maria Garcia",
        role: "Data Analyst",
        content: "I love how the course content adapts to my learning speed. The personalized quizzes help me retain information much better.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5
    },
    {
        id: 3,
        name: "David Kim",
        role: "Student",
        content: "Highly recommended for anyone looking to upskill quickly. The curriculum is top-notch and the community is very supportive.",
        image: "https://randomuser.me/api/portraits/men/85.jpg",
        rating: 5
    }
];

export const lectures = [
    {
        id: 1,
        title: "Introduction to Machine Learning Concepts",
        course: "Machine Learning Fundamentals",
        courseId: 1,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 1200,
        duration: 540,
        status: "published",
        date: "2024-02-15",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        quiz: [
            {
                id: 1,
                question: "What is the main goal of Supervised Learning?",
                options: ["Pattern recognition in unlabeled data", "Predicting a target value from labeled data", "Maximizing a reward signal", "Compressing data"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "Which of these is a regression task?",
                options: ["Spam detection", "Digit recognition", "House price prediction", "Cluster analysis"],
                correctAnswer: 2
            }
        ]
    },
    {
        id: 102,
        title: "Understanding Neural Networks and Deep Learning",
        course: "Machine Learning Fundamentals",
        courseId: 1,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 956,
        duration: 920,
        status: "published",
        date: "2024-02-18",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        quiz: []
    },
    {
        id: 103,
        title: "Training Models: Backpropagation",
        course: "Machine Learning Fundamentals",
        courseId: 1,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 720,
        duration: 1335,
        status: "published",
        date: "2024-02-22",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        quiz: [],
        locked: true
    },
    {
        id: 2,
        title: "Advanced React Context and Hooks",
        course: "Advanced React Patterns",
        courseId: 2,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 856,
        duration: 1530,
        status: "published",
        date: "2024-02-10",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
    },
    {
        id: 201,
        title: "Custom Hooks and Reusable Logic",
        course: "Advanced React Patterns",
        courseId: 2,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 641,
        duration: 1185,
        status: "published",
        date: "2024-02-14",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
        quiz: []
    },
    {
        id: 202,
        title: "Performance Optimization with useMemo & useCallback",
        course: "Advanced React Patterns",
        courseId: 2,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 523,
        duration: 1330,
        status: "published",
        date: "2024-02-18",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
        quiz: [],
        locked: true
    },
    {
        id: 3,
        title: "Designing for AI Trust and Transparency",
        course: "UX Design for AI Interfaces",
        courseId: 3,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 0,
        duration: 1100,
        status: "pending",
        date: "2024-02-25",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 301,
        title: "User Research for AI Products",
        course: "UX Design for AI Interfaces",
        courseId: 3,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 312,
        duration: 890,
        status: "published",
        date: "2024-02-28",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
        quiz: []
    },
    {
        id: 302,
        title: "Prototyping Conversational Interfaces",
        course: "UX Design for AI Interfaces",
        courseId: 3,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 198,
        duration: 1235,
        status: "published",
        date: "2024-03-02",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        quiz: [],
        locked: true
    },
    {
        id: 4,
        title: "Algorithmic Trading with Pandas",
        course: "Python for Finance",
        courseId: 4,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 2400,
        duration: 2700,
        status: "published",
        date: "2024-01-30",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 401,
        title: "Stock Data Analysis with NumPy",
        course: "Python for Finance",
        courseId: 4,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 1800,
        duration: 1935,
        status: "published",
        date: "2024-02-03",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
        quiz: []
    },

    {
        id: 501,
        title: "Python Setup and Basics",
        course: "Python for Beginners",
        courseId: 5,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 3200,
        duration: 750,
        status: "published",
        date: "2024-03-01",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
        quiz: [
            {
                id: 1,
                question: "What is the correct file extension for Python files?",
                options: [".py", ".pt", ".python", ".txt"],
                correctAnswer: 0
            }
        ]
    },
    {
        id: 502,
        title: "Variables and Data Types",
        course: "Python for Beginners",
        courseId: 5,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 2800,
        duration: 945,
        status: "published",
        date: "2024-03-05",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    },
    {
        id: 601,
        title: "Introduction to Neural Networks",
        course: "Deep Learning with TensorFlow",
        courseId: 6,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 1500,
        duration: 1100,
        status: "published",
        date: "2024-03-10",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
    },
    {
        id: 602,
        title: "Building Models with Keras",
        course: "Deep Learning with TensorFlow",
        courseId: 6,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 1200,
        duration: 1335,
        status: "published",
        date: "2024-03-15",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    },
    {
        id: 701,
        title: "Marketing in the Digital Age",
        course: "Digital Marketing Fundamentals",
        courseId: 7,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 900,
        duration: 890,
        status: "published",
        date: "2024-03-20",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"
    },
    {
        id: 801,
        title: "Setting up the Development Environment",
        course: "Full-Stack Web Development",
        courseId: 8,
        instructorId: 2,
        instructor: "Ahmed Mansour",
        views: 2100,
        duration: 620,
        status: "published",
        date: "2024-03-25",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80"
    },
    {
        id: 901,
        title: "Getting Started with Pandas Series",
        course: "Data Analysis with Pandas",
        courseId: 9,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 1800,
        duration: 930,
        status: "published",
        date: "2024-03-28",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
        id: 1001,
        title: "Investment Mindset",
        course: "Stock Market & Investment Basics",
        courseId: 10,
        instructorId: 1,
        instructor: "Dr. Laila Hassan",
        views: 750,
        duration: 765,
        status: "published",
        date: "2024-04-01",
        videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
    }
];
