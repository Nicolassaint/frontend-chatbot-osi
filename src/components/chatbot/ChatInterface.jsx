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
      
      // Assurons-nous que la fenêtre agrandie reste dans les limites de l'écran
      if (!isExpanded) {
        // Ajuster la taille en fonction de la taille de l'écran
        const chatWindow = document.querySelector('.chatbot-window');
        if (chatWindow) {
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          
          // Limiter la hauteur à 80% de la hauteur de la fenêtre
          const maxHeight = Math.min(800, viewportHeight * 0.8);
          chatWindow.style.setProperty('--expanded-height', `${maxHeight}px`);
          
          // Limiter la largeur à 90% de la largeur de la fenêtre
          const maxWidth = Math.min(1000, viewportWidth * 0.9);
          chatWindow.style.setProperty('--expanded-width', `${maxWidth}px`);
        }
      }
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

  // Ajoutons un effet pour ajuster la taille au redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (isExpanded) {
        const chatWindow = document.querySelector('.chatbot-window');
        if (chatWindow) {
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          
          const maxHeight = Math.min(800, viewportHeight * 0.8);
          chatWindow.style.setProperty('--expanded-height', `${maxHeight}px`);
          
          const maxWidth = Math.min(1000, viewportWidth * 0.9);
          chatWindow.style.setProperty('--expanded-width', `${maxWidth}px`);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  // Ajoutons un effet pour ajuster la hauteur de la zone de messages sur mobile
  useEffect(() => {
    const adjustMobileLayout = () => {
      if (isMobile()) {
        const chatWindow = document.querySelector('.chatbot-window');
        if (chatWindow) {
          const header = chatWindow.querySelector('.chatbot-header');
          const inputForm = chatWindow.querySelector('form');
          
          if (header && inputForm) {
            const headerHeight = header.offsetHeight;
            const inputHeight = inputForm.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Calculer la hauteur disponible pour la zone de messages
            const messagesAreaHeight = windowHeight - headerHeight - inputHeight;
            
            // Appliquer cette hauteur à la zone de messages
            const messagesArea = chatWindow.querySelector('.flex-1.overflow-y-auto');
            if (messagesArea) {
              messagesArea.style.height = `${messagesAreaHeight}px`;
              messagesArea.style.maxHeight = `${messagesAreaHeight}px`;
            }
          }
        }
      }
    };
    
    // Exécuter l'ajustement lors de l'ouverture du chat et au redimensionnement
    if (isOpen) {
      adjustMobileLayout();
      window.addEventListener('resize', adjustMobileLayout);
    }
    
    return () => window.removeEventListener('resize', adjustMobileLayout);
  }, [isOpen]);

  // Assurons-nous que le scroll fonctionne correctement sur mobile
  useEffect(() => {
    if (isOpen && isMobile()) {
      // Petit délai pour laisser le DOM se mettre à jour
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

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
        needsEvaluation: true,
        fromChatRoute: true
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
                timestamp: new Date(),
                fromFindByLabelRoute: true
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
      
      // Attendre que le composant MessageEvaluation ait terminé son animation
      setTimeout(() => {
        setLastMessageEvaluated(true);
        setMessages(prev => prev.map((msg, idx) => {
          if (idx === prev.length - 1 && msg.needsEvaluation) {
            return { ...msg, needsEvaluation: false };
          }
          return msg;
        }));
      }, 3500); // Délai légèrement supérieur à celui du composant MessageEvaluation (3000ms)
      
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
              <div className="flex items-center gap-2">
              <img 
                  src="/Osi.png" 
                  alt="OSI Avatar" 
                  width="40" 
                  height="35" 
                  style={{ objectFit: 'contain' }}
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
            
            <div className="flex-1 overflow-y-auto px-4 py-4 mobile-messages-container">
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
                    
                    {message.sender === 'bot' && 
                     message.fromChatRoute &&
                     message.needsEvaluation && 
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
                <div className="message-with-avatar flex items-center gap-2">
                  <img 
                    src="/Osi.png" 
                    alt="OSI Avatar" 
                    width={30} 
                    height={35} 
                    className="self-center"
                  />
                  <div className="typing-indicator flex items-center">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 mobile-input-container">
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