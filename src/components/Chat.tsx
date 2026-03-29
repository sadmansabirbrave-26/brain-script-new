import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../types';
import { Send, User, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface ChatProps {
  orderId: string;
}

const Chat: React.FC<ChatProps> = ({ orderId }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfiles, setUserProfiles] = useState<Map<string, any>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'orders', orderId, 'messages')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      // Sort client-side by timestamp
      messagesData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(messagesData);
      
      // Fetch user profiles for message senders
      const uniqueSenderIds = [...new Set(messagesData.map(msg => msg.senderUid))];
      uniqueSenderIds.forEach(senderId => {
        if (!userProfiles.has(senderId)) {
          // In a real app, you'd fetch this from Firestore
          // For now, we'll use a simple approach
          if (senderId === user?.uid) {
            setUserProfiles(prev => new Map(prev.set(senderId, profile)));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [orderId, user?.uid, profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'orders', orderId, 'messages'), {
        orderId,
        senderUid: user.uid,
        text: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-border rounded-2xl bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 font-bold flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Order Chat
      </div>
      
      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderUid === user?.uid;
          const isAdmin = msg.senderUid !== user?.uid; // Simplified - in real app, check role
          
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%] p-3 rounded-2xl text-sm",
                isCurrentUser 
                  ? "ml-auto bg-primary text-primary-foreground rounded-tr-none" 
                  : "mr-auto bg-muted text-foreground rounded-tl-none"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-medium text-blue-500">Admin</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">You</span>
                  </div>
                )}
              </div>
              <p>{msg.text}</p>
              <span className="text-[10px] opacity-70 mt-1 self-end">
                {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
