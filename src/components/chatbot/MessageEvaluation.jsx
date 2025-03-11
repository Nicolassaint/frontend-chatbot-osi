import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const MessageEvaluation = ({ onEvaluate }) => {
  const [state, setState] = useState('buttons'); // 'buttons', 'thankyou', 'hidden'
  const timeoutRef = useRef(null);
  
  const handleEvaluate = async (rating) => {
    try {
      setState('thankyou');
      
      onEvaluate(rating);
      
      timeoutRef.current = setTimeout(() => {
        setState('hidden');
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'évaluation:", error);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  if (state === 'hidden') {
    return null;
  }
  
  return (
    <div className="flex justify-start ml-12 gap-2 -mt-1 mb-1">
      <AnimatePresence mode="wait">
        {state === 'buttons' && (
          <motion.div 
            key="evaluation-buttons"
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              className="p-1 rounded-full transition-colors duration-300"
              onClick={() => handleEvaluate(1)}
              aria-label="Réponse utile"
            >
              <ThumbUpIcon 
                fontSize="small" 
                sx={{ 
                  fontSize: 20,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    color: '#10B981', 
                    transform: 'scale(1.1)' 
                  }
                }} 
                className="text-gray-600 dark:text-gray-300" 
              />
            </button>
            <button 
              className="p-1 rounded-full transition-colors duration-300"
              onClick={() => handleEvaluate(0)}
              aria-label="Réponse non utile"
            >
              <ThumbDownIcon 
                fontSize="small" 
                sx={{ 
                  fontSize: 20,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    color: '#EF4444', 
                    transform: 'scale(1.1)' 
                  }
                }} 
                className="text-gray-600 dark:text-gray-300" 
              />
            </button>
          </motion.div>
        )}
        
        {state === 'thankyou' && (
          <motion.div 
            key="thank-you-message"
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Merci pour votre retour !
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageEvaluation; 