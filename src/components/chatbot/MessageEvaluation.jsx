import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const MessageEvaluation = ({ onEvaluate }) => {
  const [evaluated, setEvaluated] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  
  const handleEvaluate = (rating) => {
    onEvaluate(rating);
    setEvaluated(true);
    setShowThanks(true);
  };
  
  useEffect(() => {
    let timer;
    if (showThanks) {
      timer = setTimeout(() => {
        setShowThanks(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showThanks]);
  
  if (evaluated && !showThanks) return null;
  
  if (evaluated) {
    return (
      <motion.div 
        className="flex justify-start ml-12 -mt-1 mb-1 text-xs text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Merci pour votre évaluation !
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="flex justify-start ml-12 gap-2 -mt-1 mb-1"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button 
        className="p-1 rounded-full"
        onClick={() => handleEvaluate(1)}
        aria-label="Réponse utile"
      >
        <ThumbUpIcon 
          fontSize="small" 
          sx={{ fontSize: 20 }} 
          className="text-gray-600 dark:text-gray-300 transform transition-all ease-in-out duration-300 hover:scale-110 hover:text-green-500" 
        />
      </button>
      <button 
        className="p-1 rounded-full"
        onClick={() => handleEvaluate(0)}
        aria-label="Réponse non utile"
      >
        <ThumbDownIcon 
          fontSize="small" 
          sx={{ fontSize: 20 }} 
          className="text-gray-600 dark:text-gray-300 transform transition-all ease-in-out duration-300 hover:scale-110 hover:text-red-500" 
        />
      </button>
    </motion.div>
  );
};

export default MessageEvaluation; 