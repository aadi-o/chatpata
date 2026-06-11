import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  personalityMode: string;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  setPersonalityMode: (mode: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  personalityMode: 'Best Friend',
  
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  updateLastMessage: (content) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1].content += content;
    }
    return { messages: newMessages };
  }),
  
  setIsTyping: (isTyping) => set({ isTyping }),
  
  setPersonalityMode: (mode) => set({ personalityMode: mode }),
  
  clearChat: () => set({ messages: [] })
}));
