import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { QuotationCard } from '../../components/shared/QuotationCard';
import { MessageSquare, Send, Paperclip, CheckCheck, ArrowLeft, Image, FileText } from 'lucide-react';

export const ChatView: React.FC = () => {
  const { conversations, messages, activeConversationId, setActiveConversationId, sendMessage } = useChatStore();
  const [textInput, setTextInput] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, textInput);
    setTextInput('');
  };

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      {activeConv ? (
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            onClick={() => setActiveConversationId(null)}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
          </button>

          <img
            src={activeConv.participantAvatar}
            alt={activeConv.participantName}
            style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover' }}
          />

          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#F9FAFB' }}>{activeConv.participantName}</div>
            <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>Verified {activeConv.participantRole} • Online</div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 0 10px 0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>B2B Messages & Quotes</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>Real-time chat threads with suppliers and buyers</p>
        </div>
      )}

      {/* Conversation Thread Selector if no active conv selected */}
      {!activeConversationId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              style={{
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
              }}
            >
              <img
                src={conv.participantAvatar}
                alt={conv.participantName}
                style={{ width: 44, height: 44, borderRadius: 22, objectFit: 'cover' }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>{conv.participantName}</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>{conv.lastMessageTime}</span>
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {conv.lastMessage}
                </div>
              </div>

              {conv.unreadCount > 0 && (
                <div
                  style={{
                    background: '#2563EB',
                    color: '#FFF',
                    fontSize: 10,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Active Message History */}
      {activeConv && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {currentMessages.map((msg) => {
              const isMe = msg.senderId === 'usr_101';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.type === 'QUOTATION_CARD' && msg.quotationData ? (
                    <QuotationCard quotation={msg.quotationData as any} isBuyer={true} />
                  ) : (
                    <div
                      style={{
                        maxWidth: '80%',
                        background: isMe ? '#2563EB' : 'rgba(31, 41, 55, 0.9)',
                        color: '#FFF',
                        padding: '10px 14px',
                        borderRadius: 16,
                        borderBottomRightRadius: isMe ? 2 : 16,
                        borderBottomLeftRadius: !isMe ? 2 : 16,
                        fontSize: 13,
                        lineHeight: '1.4',
                      }}
                    >
                      {msg.text}
                    </div>
                  )}

                  <span style={{ fontSize: 9, color: '#6B7280', marginTop: 3 }}>{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            style={{
              background: '#0B0F17',
              padding: 10,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type message or response..."
              style={{
                flex: 1,
                background: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 20,
                padding: '8px 14px',
                color: '#FFF',
                fontSize: 13,
                outline: 'none',
              }}
            />

            <button
              type="submit"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: '#2563EB',
                border: 'none',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
