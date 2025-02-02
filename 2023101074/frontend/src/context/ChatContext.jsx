import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <ChatContext.Provider value={{ 
      chatHistory, 
      addMessage, 
      clearChat,
      isLoading,
      setIsLoading 
    }}>
      {children}
    </ChatContext.Provider>
  );
};
