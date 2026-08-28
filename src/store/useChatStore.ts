import { create } from 'zustand';
import { ChatConversation, ChatMessage } from '../types';

interface ChatState {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, type?: ChatMessage['type'], payload?: any) => void;
  startOrOpenConversation: (participant: { id: string; name: string; avatar: string; company: string; role: 'BUYER' | 'SUPPLIER' }) => string;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  sendMessage: (convId, text, type = 'TEXT', payload = {}) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: 'usr_101',
      senderName: 'Alex Vance',
      senderRole: 'BUYER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      ...payload,
    };

    set((state) => {
      const currentMsgs = state.messages[convId] || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      
      const updatedConvs = state.conversations.map((c) =>
        c.id === convId ? { ...c, lastMessage: text || 'Sent an attachment', lastMessageTime: 'Just now' } : c
      );

      return {
        messages: { ...state.messages, [convId]: updatedMsgs },
        conversations: updatedConvs,
      };
    });
  },

  startOrOpenConversation: (participant) => {
    const { conversations } = get();
    const existing = conversations.find((c) => c.participantId === participant.id);

    if (existing) {
      set({ activeConversationId: existing.id });
      return existing.id;
    }

    const newId = `conv_${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      participantId: participant.id,
      participantName: participant.name,
      participantAvatar: participant.avatar,
      participantCompany: participant.company,
      participantRole: participant.role,
      lastMessage: 'Conversation started',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations],
      messages: { ...state.messages, [newId]: [] },
      activeConversationId: newId,
    }));

    return newId;
  },
}));
