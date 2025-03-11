import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ThankYouMessage = ({ rating }) => {
  // Animations pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2
      }
    }
  };

  // Animation de pulsation pour l'icône
  const pulseAnimation = {
    scale: [1, 1.2, 1],
    transition: { 
      duration: 0.8, 
      repeat: 1,
      repeatType: "reverse"
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-2 py-1 px-3 rounded-full bg-opacity-10 dark:bg-opacity-10"
      style={{ 
        background: rating === 1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={iconVariants}
        animate={pulseAnimation}
      >
        {rating === 1 ? (
          <CheckCircleIcon 
            fontSize="small" 
            className="text-emerald-500"
          />
        ) : (
          <FavoriteIcon 
            fontSize="small" 
            className="text-rose-500"
          />
        )}
      </motion.div>
      
      <motion.span 
        variants={itemVariants}
        className="text-sm font-medium"
        style={{ 
          color: rating === 1 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        }}
      >
        {rating === 1 
          ? "Merci pour votre retour positif !" 
          : "Merci, nous allons nous améliorer !"}
      </motion.span>
    </motion.div>
  );
};

export default ThankYouMessage; 