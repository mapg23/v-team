"use strict";
// components/AnimatedPage.jsx
import { motion } from "framer-motion";

const pageVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-30%", opacity: 0 },
};


const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.25,
};

const AnimatedPage = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
