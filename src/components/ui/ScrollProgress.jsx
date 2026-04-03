import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress — A thin gradient bar at the top of the viewport 
 * that fills as the user scrolls down the page.
 */
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 50,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
            style={{
                scaleX,
                background: 'linear-gradient(90deg, #4f46e5 0%, #8b5cf6 40%, #ec4899 100%)',
            }}
        />
    );
};

export default ScrollProgress;
