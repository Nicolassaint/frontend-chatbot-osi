"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ThemeToggle from '../ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour, je suis OSI, l'assistant virtuel de l'offre de service informatique du Secrétariat général. Ma mission est de vous orienter vers la solution la plus adaptée à vos besoins.",
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Comment puis-je vous aider ? 😊",
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 3,
      text: "Voici des exemples de questions que vous pouvez me poser :",
      sender: 'bot',
      timestamp: new Date(),
      list: [
        "Comment organiser une visioconférence ?",
        "Je cherche un outil de gestion de tâches",
        "Mode d'emploi téléphone fixe"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simuler une réponse du bot après un délai
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Merci pour votre question. Je suis en train de chercher la meilleure réponse pour vous.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const windowVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' }
  };

  return (
    <>
      {/* Bouton pour ouvrir le chat */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="chatbot-toggle flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleChat}
          >
            <Image 
              src="/Osi.png" 
              alt="OSI Avatar" 
              width={24} 
              height={24} 
              className="rounded-full"
            />
            <span className="text-white font-medium">Chatbot OSI</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`chatbot-window ${isExpanded ? 'expanded' : ''} flex flex-col`}
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="chatbot-header">
              <div className="flex items-center">
                <Image 
                  src="/Osi.png" 
                  alt="OSI Avatar" 
                  width={32} 
                  height={32} 
                  className="rounded-full mr-2"
                />
                <h3 className="font-medium">Offre de services informatique</h3>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle variant="small" />
                <button 
                  className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                  onClick={toggleExpand}
                  aria-label={isExpanded ? "Réduire" : "Agrandir"}
                >
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20"></polyline>
                      <polyline points="20 10 14 10 14 4"></polyline>
                      <line x1="14" y1="10" x2="21" y2="3"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  )}
                </button>
                <button 
                  className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                  onClick={toggleChat}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  isLast={index === messages.length - 1}
                />
              ))}
              
              {isTyping && (
                <div className="message-with-avatar">
                  <Image 
                    src="/Osi.png" 
                    alt="OSI Avatar" 
                    width={32} 
                    height={32} 
                    className="chatbot-avatar"
                  />
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="chatbot-input"
                  placeholder="Tapez votre message..."
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <button type="submit" className="chatbot-send-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatInterface; 