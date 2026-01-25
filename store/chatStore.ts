import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  loadChats: () => Promise<void>;
  createChat: () => string;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  addMessage: (chatId: string, message: Message) => Promise<void>;
  setCurrentChat: (chatId: string | null) => void;
  getCurrentChat: () => Chat | null;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChatId: null,
  isLoading: true,

  loadChats: async () => {
    try {
      const chatsJson = await AsyncStorage.getItem('chats');
      if (chatsJson) {
        const chats = JSON.parse(chatsJson).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        set({ chats, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createChat: () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id,
    }));
    get().saveChats();
    return newChat.id;
  },

  deleteChat: async (chatId: string) => {
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
      currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
    }));
    await get().saveChats();
  },

  updateChatTitle: async (chatId: string, title: string) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
      ),
    }));
    await get().saveChats();
  },

  addMessage: async (chatId: string, message: Message) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              updatedAt: new Date(),
              title: chat.messages.length === 0 ? message.text.slice(0, 30) : chat.title,
            }
          : chat
      ),
    }));
    await get().saveChats();
  },

  setCurrentChat: (chatId: string | null) => {
    set({ currentChatId: chatId });
  },

  getCurrentChat: () => {
    const { chats, currentChatId } = get();
    return chats.find((chat) => chat.id === currentChatId) || null;
  },

  saveChats: async () => {
    const { chats } = get();
    await AsyncStorage.setItem('chats', JSON.stringify(chats));
  },
}));
