import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

const Quiz = ({ questions: propQuestions }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questions = propQuestions && propQuestions.length > 0 ? propQuestions : [];

    const handleAnswer = (index) => {
        setSelectedOption(index);
        const correct = index === (questions[currentQuestion].correct !== undefined ? questions[currentQuestion].correct : questions[currentQuestion].correctAnswer);
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('course.quiz.completed')}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{t('course.quiz.score', { score, total: questions.length })}</p>
                <Button onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setScore(0);
                    setSelectedOption(null);
                    setIsCorrect(null);
                }}>{t('course.quiz.retry')}</Button>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('course.quiz.noQuiz')}</h3>
                <p className="text-sm text-slate-500">{t('course.quiz.noQuizDesc')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">{t('course.quiz.title')}</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('course.quiz.progress', { current: currentQuestion + 1, total: questions.length })}</span>
            </div>

            <div className="mb-8">
                <h4 className={`text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{questions[currentQuestion].question}</h4>
                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => selectedOption === null && handleAnswer(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${isRTL ? 'text-right' : 'text-left'} ${selectedOption === idx
                                ? isCorrect
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span>{option}</span>
                                {selectedOption === idx && (
                                    isCorrect ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedOption !== null && (
                <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <Button onClick={nextQuestion}>
                        {currentQuestion < questions.length - 1 ? t('course.quiz.next') : t('course.quiz.results')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
