"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ThemeToggle from '../ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatButtons from './ChatButtons';
import MessageEvaluation from './MessageEvaluation';

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
  const [conversationId, setConversationId] = useState(null);
  const [lastMessageEvaluated, setLastMessageEvaluated] = useState(false);
  const messagesEndRef = useRef(null);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const toggleExpand = () => {
    if (!isMobile()) {
      setIsExpanded(!isExpanded);
    }
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setLastMessageEvaluated(false);
    
    // Filtrer l'historique pour n'inclure que les messages avec du texte
    const messageHistory = messages
      .filter(msg => msg.text) // Ne prend que les messages avec du texte
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
    
    messageHistory.push({
      role: 'user',
      content: inputValue
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_OSI}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_OSI}`
        },
        body: JSON.stringify({
          message: inputValue,
          historique: messageHistory
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur');
      }
      
      const data = await response.json();
      
      // Mettre à jour l'ID de conversation si disponible
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      
      // Créer le message de réponse du bot
      const botResponse = {
        id: Date.now(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        needsEvaluation: true
      };
      
      // Ajouter des propriétés supplémentaires si elles existent
      if (data.image) botResponse.image = data.image;
      if (data.video) botResponse.video = data.video;
      if (data.buttons && data.buttons.length > 0) botResponse.buttons = data.buttons;
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erreur:', error);
      
      // Message d'erreur en cas d'échec
      const errorMessage = {
        id: Date.now(),
        text: "Désolé, je rencontre des difficultés à me connecter au serveur. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleButtonClick = async (label) => {
    setIsTyping(true);
    
    const newMessageId = Date.now();
    const userMessage = {
      id: newMessageId,
      text: label,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_OSI}/api/find_by_label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_OSI}`
        },
        body: JSON.stringify({
          label: label,
          historique: messages.concat(userMessage).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text || ''
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur');
      }
      
      const data = await response.json();
      
      if (data.found && data.data) {
        const details = data.data.details;
        
        if (details && details.Messages && details.Messages.length > 0) {
          const message = details.Messages[0];
          
          if (message.Bubbles && message.Bubbles.length > 0) {
            const sortedBubbles = [...message.Bubbles].sort((a, b) => a.Order - b.Order);
            
            for (const bubble of sortedBubbles) {
              const botMessage = {
                id: Date.now() + sortedBubbles.indexOf(bubble),
                text: bubble.Text,
                sender: 'bot',
                timestamp: new Date()
              };
              
              if (bubble.Image) botMessage.image = bubble.Image;
              if (bubble.Video) botMessage.video = bubble.Video;
              
              setMessages(prev => [...prev, botMessage]);
            }
          }
          
          if (message.Buttons && message.Buttons.length > 0) {
            const buttonsMessage = {
              id: Date.now(),
              sender: 'bot',
              timestamp: new Date(),
              buttons: message.Buttons.sort((a, b) => a.Order - b.Order)
            };
            
            setMessages(prev => [...prev, buttonsMessage]);
          }
        } else {
          // Fallback si la structure n'est pas comme attendue
          const botMessage = {
            id: Date.now(),
            text: data.data.description || "Information trouvée mais format inattendu",
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        // Message si aucune donnée n'est trouvée
        const botMessage = {
          id: Date.now(),
          text: "Désolé, je n'ai pas trouvé d'information correspondant à cette demande.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      
      const errorMessage = {
        id: Date.now(),
        text: "Désolé, je rencontre des difficultés à récupérer cette information. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEvaluateResponse = async (rating) => {
    if (!conversationId) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_OSI}/api/evaluate_response?conversation_id=${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_OSI}`
        },
        body: JSON.stringify({
          rating: rating
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'évaluation');
      }
      
      // Marquer le dernier message comme évalué
      setLastMessageEvaluated(true);
      
    } catch (error) {
      console.error('Erreur lors de l\'évaluation:', error);
    }
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
                {!isMobile() && (
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
                )}
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
              {messages.map((message, index) => {
                const messageKey = `${message.id}-${index}`; // Création d'une clé unique combinant id et index
                
                return (
                  <motion.div 
                    key={messageKey}
                    className="message-container"
                  >
                    <ChatMessage 
                      message={message} 
                      isLast={index === messages.length - 1}
                    />
                    
                    {message.buttons && (
                      <ChatButtons 
                        key={`buttons-${messageKey}`}
                        buttons={message.buttons} 
                        onButtonClick={handleButtonClick} 
                      />
                    )}
                    
                    {message.needsEvaluation && 
                     index === messages.length - 1 && 
                     !lastMessageEvaluated && (
                      <MessageEvaluation 
                        key={`eval-${messageKey}`}
                        onEvaluate={handleEvaluateResponse} 
                      />
                    )}
                  </motion.div>
                );
              })}
              
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