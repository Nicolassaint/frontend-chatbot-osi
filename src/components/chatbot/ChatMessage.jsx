import Image from 'next/image';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

const ChatMessage = ({ message, isLast }) => {
  const [fontSize, setFontSize] = useState('1rem');
  const [padding, setPadding] = useState('8px 12px');
  const [timestampSize, setTimestampSize] = useState('0.7rem');

  useEffect(() => {
    const adjustMessageSize = () => {
      const viewportHeight = window.innerHeight;
      
      if (viewportHeight <= 1000) {
        setFontSize('0.875rem');
        setPadding('6px 10px');
        setTimestampSize('0.625rem');
      } else {
        setFontSize('1rem');
        setPadding('8px 12px');
        setTimestampSize('0.7rem');
      }
    };

    adjustMessageSize();
    window.addEventListener('resize', adjustMessageSize);
    return () => window.removeEventListener('resize', adjustMessageSize);
  }, []);

  const messageStyle = {
    fontSize: fontSize,
    padding: padding,
    lineHeight: '1.4',
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const timestampStyle = {
    fontSize: timestampSize,
    opacity: 0.7,
    marginTop: '2px',
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const renderTextContent = () => {
    if (!message.text) return null;
    
    return (
      <motion.div 
        className={`message-with-avatar mb-1`}
        initial="hidden"
        animate="visible"
        variants={messageVariants}
        transition={{ duration: 0.3 }}
      >
        {message.sender === 'bot' && (
          <img 
            src="/Osi.png" 
            alt="OSI Avatar" 
            width="28"
            height="22" 
            className="chatbot-avatar"
            style={{ objectFit: 'contain' }}
          />
        )}
        <div 
          className={`chatbot-message ${message.sender} ${message.isError ? 'error' : ''}`}
          style={messageStyle}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline break-words"
                  style={{ fontSize: fontSize }}
                />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="break-words" style={{ margin: '0' }} />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
          
          {message.list && (
            <ul className="list-disc pl-4 mt-1">
              {message.list.map((item, index) => (
                <li key={index} style={{ fontSize: fontSize }}>{item}</li>
              ))}
            </ul>
          )}
          
          <span className="message-timestamp" style={timestampStyle}>
            {formatTime()}
          </span>
        </div>
      </motion.div>
    );
  };

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