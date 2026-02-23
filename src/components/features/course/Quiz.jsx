import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '../../ui/Button';

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questions = [
        {
            id: 1,
            question: "What is the primary function of React's useState hook?",
            options: [
                "To handle side effects",
                "To manage local component state",
                "To fetch data from an API",
                "To optimized performance"
            ],
            correct: 1
        },
        {
            id: 2,
            question: "Which method is used to update the state in a class component?",
            options: [
                "updateState()",
                "changeState()",
                "setState()",
                "modifyState()"
            ],
            correct: 2
        }
    ];

    const handleAnswer = (index) => {
        setSelectedOption(index);
        const correct = index === questions[currentQuestion].correct;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">You scored {score} out of {questions.length}</p>
                <Button onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setScore(0);
                    setSelectedOption(null);
                    setIsCorrect(null);
                }}>Retry Quiz</Button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Module Quiz</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
            </div>

            <div className="mb-8">
                <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">{questions[currentQuestion].question}</h4>
                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => !selectedOption && handleAnswer(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${selectedOption === idx
                                ? isCorrect
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{option}</span>
                                {selectedOption === idx && (
                                    isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedOption !== null && (
                <div className="flex justify-end">
                    <Button onClick={nextQuestion}>
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
