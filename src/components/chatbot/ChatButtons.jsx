import { motion } from 'framer-motion';
import { useState } from 'react';

const ChatButtons = ({ buttons, onButtonClick }) => {
  const [clickedButtons, setClickedButtons] = useState(new Set());
  const sortedButtons = [...buttons].sort((a, b) => a.Order - b.Order);
  
  const handleClick = (link, index) => {
    setClickedButtons(prev => new Set([...prev, index]));
    onButtonClick(link);
  };

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
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-md 
          transition-all duration-300
          ${clickedButtons.has(index) 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#CE614A] hover:bg-[#b54d38] hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
          } text-white`}
          onClick={() => handleClick(button.Link, index)}
          disabled={clickedButtons.has(index)}
        >
          {button.Label}
        </button>
      ))}
    </motion.div>
  );
};

export default ChatButtons; 