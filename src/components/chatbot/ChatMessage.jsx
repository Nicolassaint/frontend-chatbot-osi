import Image from 'next/image';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

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

  // Fonction pour rendre le contenu texte avec Markdown
  const renderTextContent = () => {
    if (!message.text) return null;
    
    return (
      <motion.div 
        className={`message-with-avatar mb-2`}
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
        <div className={`chatbot-message ${message.sender} ${message.isError ? 'error' : ''}`}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline"
                />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
          
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

  // Fonction pour rendre l'image
  const renderImageContent = () => {
    if (!message.image) return null;
    
    return (
      <motion.div 
        className={`message-with-avatar mb-2`}
        initial="hidden"
        animate="visible"
        variants={messageVariants}
        transition={{ duration: 0.3, delay: 0.1 }}
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
          <img 
            src={message.image} 
            alt="Image" 
            className="max-w-full rounded-lg"
          />
          <span className="message-timestamp">{formatTime()}</span>
        </div>
      </motion.div>
    );
  };

  // Fonction pour rendre la vidéo
  const renderVideoContent = () => {
    if (!message.video) return null;
    
    return (
      <motion.div 
        className={`message-with-avatar mb-2`}
        initial="hidden"
        animate="visible"
        variants={messageVariants}
        transition={{ duration: 0.3, delay: 0.2 }}
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
          <video 
            controls
            className="max-w-full rounded-lg"
          >
            <source src={message.video} />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          <span className="message-timestamp">{formatTime()}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {renderTextContent()}
      {renderImageContent()}
      {renderVideoContent()}
    </>
  );
};

export default ChatMessage; 