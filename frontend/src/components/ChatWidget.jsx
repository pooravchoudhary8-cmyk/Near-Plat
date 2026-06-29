import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import axios from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      user: 'Near Plat AI',
      text: 'Welcome to Near Plat! How can I assist you with your luxury shopping today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: false,
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      user: user?.name || 'Guest',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true,
    };

    setChatLog((prev) => [...prev, newMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const res = await axios.post('/chat/ask', { message: newMsg.text });
      
      const aiReply = {
        user: 'Near Plat AI',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSender: false,
      };

      setChatLog((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('Chat error', error);
      setChatLog((prev) => [...prev, {
        user: 'System',
        text: 'Sorry, the AI assistant is currently unavailable.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSender: false,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-card border border-border shadow-2xl w-80 h-96 flex flex-col rounded-xl overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <div>
                  <h3 className="font-display text-lg">Near Plat AI Assistant</h3>
                  <p className="text-xs opacity-80">Online 24/7</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
                <X size={20} />
              </button>
            </div>

            {/* Chat Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {chatLog.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.isSender ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-muted-foreground mb-1">{msg.user} • {msg.time}</span>
                  <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${msg.isSender ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-muted-foreground mb-1">Near Plat AI • typing...</span>
                  <div className="px-3 py-3 rounded-lg bg-muted text-foreground rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about our collection..."
                className="flex-1 bg-transparent border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={isTyping}
                className="bg-primary text-primary-foreground p-2 rounded hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform ml-auto"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;
