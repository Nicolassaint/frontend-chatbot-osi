import { motion } from 'framer-motion';

const ChatButtons = ({ buttons, onButtonClick }) => {
  // Trier les boutons par ordre
  const sortedButtons = [...buttons].sort((a, b) => a.Order - b.Order);
  
  return (
    <motion.div 
      className="flex flex-wrap gap-2 mt-1 mb-3 ml-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {sortedButtons.map((button, index) => (
        <button
          key={index}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
          onClick={() => onButtonClick(button.Link)}
        >
          {button.Label}
        </button>
      ))}
    </motion.div>
  );
};

export default ChatButtons; 