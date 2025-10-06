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
                <p {...props} className="break-words mb-2 last:mb-0" style={{ marginTop: '0' }} />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-5 mb-2 space-y-1" style={{ fontSize: fontSize }} />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-5 mb-2 space-y-1" style={{ fontSize: fontSize }} />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="ml-0 break-words" style={{ fontSize: fontSize }} />
              ),
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-xl font-bold mb-2 mt-3 first:mt-0 break-words" style={{ fontSize: `calc(${fontSize} * 1.5)` }} />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-lg font-bold mb-2 mt-2 first:mt-0 break-words" style={{ fontSize: `calc(${fontSize} * 1.25)` }} />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-base font-semibold mb-1 mt-2 first:mt-0 break-words" style={{ fontSize: `calc(${fontSize} * 1.1)` }} />
              ),
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-bold" />
              ),
              em: ({ node, ...props }) => (
                <em {...props} className="italic" />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code {...props} className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm break-words" style={{ fontSize: `calc(${fontSize} * 0.9)` }} />
                ) : (
                  <code {...props} className="block bg-gray-200 dark:bg-gray-700 p-2 rounded my-2 text-sm overflow-x-auto" style={{ fontSize: `calc(${fontSize} * 0.9)` }} />
                ),
              pre: ({ node, ...props }) => (
                <pre {...props} className="bg-gray-200 dark:bg-gray-700 p-2 rounded my-2 overflow-x-auto" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 my-2 italic" style={{ fontSize: fontSize }} />
              ),
              hr: ({ node, ...props }) => (
                <hr {...props} className="my-3 border-gray-300 dark:border-gray-600" />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>

          {message.list && (
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {message.list.map((item, index) => (
                <li key={index} className="ml-0 break-words" style={{ fontSize: fontSize }}>{item}</li>
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
        className="flex justify-start mb-2 ml-12"
        initial="hidden"
        animate="visible"
        variants={messageVariants}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <img 
          src={message.image} 
          alt="Image" 
          className="max-w-[80%] rounded-lg"
          style={{ maxHeight: '300px', objectFit: 'contain' }}
        />
      </motion.div>
    );
  };

  const renderVideoContent = () => {
    if (!message.video) return null;
    
    return (
      <motion.div 
        className="flex justify-start mb-2 ml-12"
        initial="hidden"
        animate="visible"
        variants={messageVariants}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <video 
          controls
          className="max-w-[80%] rounded-lg"
          style={{ maxHeight: '300px' }}
        >
          <source src={message.video} />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
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