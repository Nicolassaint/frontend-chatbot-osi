import Image from 'next/image';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, isLast }) => {
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      className={`${message.sender === 'bot' ? 'message-with-avatar' : ''}`}
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      transition={{ duration: 0.3 }}
    >
      {message.sender === 'bot' && (
        <img 
          src="/Osi.png" 
          alt="OSI Avatar" 
          width="32" 
          height="25" 
          className="chatbot-avatar"
          style={{ objectFit: 'contain' }}
        />
      )}
      <div className={`chatbot-message ${message.sender}`}>
        <p>{message.text}</p>
        {message.list && (
          <ul className="list-disc pl-5 mt-2">
            {message.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <span className="message-timestamp">{formatTime()}</span>
      </div>
    </motion.div>
  );
};

export default ChatMessage; 