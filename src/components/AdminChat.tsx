import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Message, Order, UserProfile } from '../types';
import { Send, Shield, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface AdminChatProps {
  order: Order;
}

const AdminChat: React.FC<AdminChatProps> = ({ order }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [clientProfile, setClientProfile] = useState<UserProfile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch client profile
    const fetchClientProfile = async () => {
      try {
        const clientDoc = await getDoc(doc(db, 'users', order.clientUid));
        if (clientDoc.exists()) {
          setClientProfile(clientDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching client profile:', error);
      }
    };

    fetchClientProfile();
  }, [order.clientUid]);

  useEffect(() => {
    const q = query(
      collection(db, 'orders', order.id, 'messages')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      // Sort client-side by timestamp
      messagesData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [order.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || profile?.role !== 'admin') return;

    try {
      await addDoc(collection(db, 'orders', order.id, 'messages'), {
        orderId: order.id,
        senderUid: user.uid,
        text: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <Shield className="h-8 w-8 mr-2" />
        Admin access required
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border border-border rounded-2xl bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <span>Admin Chat</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {clientProfile?.displayName || 'Client'} - {order.title}
        </div>
      </div>
      
      <div ref={scrollRef} className="grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderUid === user?.uid;
          const isAdmin = isCurrentUser; // Current user is admin in this component
          
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%] p-3 rounded-2xl text-sm",
                isCurrentUser 
                  ? "ml-auto bg-blue-500 text-white rounded-tr-none" 
                  : "mr-auto bg-muted text-foreground rounded-tl-none"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span className="text-xs font-medium">Admin (You)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {clientProfile?.displayName || 'Client'}
                    </span>
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
        
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message as admin..."
          className="grow rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default AdminChat;
