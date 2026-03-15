import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, ArrowLeft, Clock, BookOpen, Star, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { courses } from '../../data/mockData';

const CheckoutPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const course = courses.find(c => c.id === parseInt(courseId)) || courses[0];

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateForm = () => {
        const newErrors = {};
        // Card number: must be 16 digits
        const cleanCard = cardNumber.replace(/\s/g, '');
        if (!cleanCard) {
            newErrors.cardNumber = 'Card number is required';
        } else if (cleanCard.length !== 16) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }

        // Expiry: must be MM/YY format and not expired
        if (!expiry) {
            newErrors.expiry = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            newErrors.expiry = 'Use MM/YY format';
        } else {
            const [month, year] = expiry.split('/').map(Number);
            if (month < 1 || month > 12) {
                newErrors.expiry = 'Invalid month';
            } else {
                const now = new Date();
                const expDate = new Date(2000 + year, month);
                if (expDate <= now) {
                    newErrors.expiry = 'Card has expired';
                }
            }
        }

        // CVV: must be 3 or 4 digits
        if (!cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (cvv.length < 3) {
            newErrors.cvv = 'CVV must be 3-4 digits';
        }

        return newErrors;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(validateForm());
    };

    const isFormValid = () => {
        const validationErrors = validateForm();
        return Object.keys(validationErrors).length === 0;
    };

    // Mock payment: save purchased courseId to localStorage
    const handlePayNow = () => {
        // Mark all fields as touched to show errors
        setTouched({ cardNumber: true, expiry: true, cvv: true });
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return; // Don't proceed if there are errors
        }

        const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        if (!purchased.includes(course.id)) {
            purchased.push(course.id);
            localStorage.setItem('purchasedCourses', JSON.stringify(purchased));
        }
        navigate('/payment-success');
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
        return v;
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-300">
            {/* Header */}
            <div className="bg-slate-900 dark:bg-black text-white py-8 border-b dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to Course</span>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                        <Lock className="w-7 h-7 text-primary" />
                        Secure Checkout
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 sm:p-8 transition-colors">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Payment Details
                            </h2>

                            <div className="space-y-5">
                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Card Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => {
                                                setCardNumber(formatCardNumber(e.target.value));
                                                if (touched.cardNumber) setErrors(validateForm());
                                            }}
                                            onBlur={() => handleBlur('cardNumber')}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className={`w-full px-4 py-3.5 pl-12 bg-slate-50 dark:bg-slate-800/50 border ${touched.cardNumber && errors.cardNumber ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary/50 focus:border-primary'} rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                                        />
                                        <CreditCard className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${touched.cardNumber && errors.cardNumber ? 'text-red-400' : 'text-slate-400'}`} />
                                    </div>
                                    {touched.cardNumber && errors.cardNumber && (
                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.cardNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Expiry & CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Expiry Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => {
                                                setExpiry(formatExpiry(e.target.value));
                                                if (touched.expiry) setErrors(validateForm());
                                            }}
                                            onBlur={() => handleBlur('expiry')}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className={`w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${touched.expiry && errors.expiry ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary/50 focus:border-primary'} rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                                        />
                                        {touched.expiry && errors.expiry && (
                                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                {errors.expiry}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            CVV <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => {
                                                setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                                                if (touched.cvv) setErrors(validateForm());
                                            }}
                                            onBlur={() => handleBlur('cvv')}
                                            placeholder="123"
                                            maxLength={4}
                                            className={`w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${touched.cvv && errors.cvv ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary/50 focus:border-primary'} rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                                        />
                                        {touched.cvv && errors.cvv && (
                                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                {errors.cvv}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Pay Now Button */}
                                <Button
                                    onClick={handlePayNow}
                                    size="lg"
                                    className={`w-full mt-2 transition-all text-lg ${isFormValid() ? 'shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5' : 'opacity-60 cursor-not-allowed'}`}
                                >
                                    <Lock className="w-5 h-5" />
                                    Pay Now — ${course.price}
                                </Button>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400 dark:text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span>Your payment info is encrypted and secure</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 sticky top-24 transition-colors">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>

                            {/* Course Card */}
                            <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                                <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
                            </div>

                            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">{course.title}</h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">By {course.instructor}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    {course.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {course.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    {course.lessons} lessons
                                </span>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                                    <span>Course Price</span>
                                    <span className="line-through text-slate-400">${(course.price * 1.5).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                                    <span>Discount</span>
                                    <span className="text-green-500 font-medium">-33%</span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
                                    <span className="font-bold text-slate-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-primary">${course.price}</span>
                                </div>
                            </div>

                            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
                                30-Day Money-Back Guarantee
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
