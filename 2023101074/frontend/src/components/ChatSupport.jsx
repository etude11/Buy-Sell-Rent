import React, { useState, useContext, useRef, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { sendChatMessage } from '../api/api';
import './ChatSupport.css';

function ChatSupport() {
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const { chatHistory, addMessage, isLoading, setIsLoading } = useContext(ChatContext);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message.trim() };
    addMessage(userMessage);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(token,userMessage.content, chatHistory);
      
      if (response.data && response.data.success) {
        addMessage({ 
          role: 'assistant', 
          content: response.data.response 
        });
      } else {
        throw new Error(response.data?.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ 
        role: 'assistant', 
        content: `Error: ${error.response?.data?.error || error.message || 'Unknown error occurred'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">Typing...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export default ChatSupport;
