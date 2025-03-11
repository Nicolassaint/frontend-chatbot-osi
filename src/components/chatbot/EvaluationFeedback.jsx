import { motion } from 'framer-motion';

const EvaluationFeedback = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="flex items-center justify-start ml-12 space-x-2 mt-2 mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="bg-green-100 dark:bg-green-900 rounded-full p-2"
        variants={textVariants}
      >
        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <motion.span 
        className="text-sm text-gray-600 dark:text-gray-300"
        variants={textVariants}
      >
        Merci pour votre retour !
      </motion.span>
    </motion.div>
  );
};

export default EvaluationFeedback; 