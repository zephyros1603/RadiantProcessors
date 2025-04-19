import React, { createContext, useState, useContext } from 'react';

interface ChatContextType {
  chatHistory: string | null;
  setChatHistory: (history: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ chatHistory, setChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};