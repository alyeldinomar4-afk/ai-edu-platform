import { Star, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';

const CourseCard = ({ course }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700">
                    {course.category}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {course.level}
                    </span>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{course.rating}</span>
                        <span className="text-xs text-slate-400">({course.reviews})</span>
                    </div>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 line-clamp-2 leading-snug">{course.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 line-clamp-1 sm:line-clamp-1">{course.instructor}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-slate-900">${course.price}</span>
                    <Link to={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">View Course</Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
