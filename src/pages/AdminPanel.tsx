import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, UserProfile } from '../types';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Users, FileText, Settings, Trash2, CheckCircle, XCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import AdminChat from '../components/AdminChat';

const AdminPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [offeringPrice, setOfferingPrice] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      // Sort client-side by createdAt in descending order
      ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ordersData);
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
    };
  }, []);

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      toast.success('Order deleted.');
    } catch (error) {
      toast.error('Failed to delete order.');
    }
  };

  const handleUpdateUserRole = async (uid: string, role: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role });
      toast.success('User role updated.');
    } catch (error) {
      toast.error('Failed to update user role.');
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'price-offered' });
      toast.success('Order approved. Please offer a price to the client.');
    } catch (error) {
      toast.error('Failed to approve order.');
    }
  };

  const handleOfferPrice = async (orderId: string) => {
    const price = offeringPrice[orderId];
    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'price-offered',
        offeredPrice: parseFloat(price),
        priceOfferedBy: 'admin',
        priceOfferedAt: new Date().toISOString()
      });
      setOfferingPrice(prev => ({ ...prev, [orderId]: '' }));
      toast.success('Price offer sent to client!');
    } catch (error) {
      toast.error('Failed to send price offer.');
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to decline this order?')) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'cancelled' });
      toast.success('Order declined and marked as cancelled.');
    } catch (error) {
      toast.error('Failed to decline order.');
    }
  };

  if (loading) return <div className="container mx-auto p-8">Loading admin panel...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Admin <span className="text-primary">Control Center</span></h1>
        <p className="text-xl text-muted-foreground">Manage platform operations, orders, and user permissions.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Manage Orders */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-6 w-6" />
            </div>
            All Orders
          </h2>
          <div className="space-y-6">
            {orders.map((order, i) => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-4xl border border-primary/10 bg-primary/5 group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      order.status === 'price-offered' ? 'bg-blue-500/10 text-blue-500' :
                      order.status === 'price-accepted' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'in-progress' ? 'bg-purple-500/10 text-purple-500' :
                      order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {order.status === 'pending' ? <Clock className="h-5 w-5" /> :
                       order.status === 'price-offered' ? <AlertCircle className="h-5 w-5" /> :
                       order.status === 'price-accepted' ? <CheckCircle className="h-5 w-5" /> :
                       order.status === 'in-progress' ? <AlertCircle className="h-5 w-5" /> :
                       order.status === 'completed' ? <CheckCircle className="h-5 w-5" /> :
                       <XCircle className="h-5 w-5" />}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      order.status === 'pending' ? 'text-yellow-500' :
                      order.status === 'price-offered' ? 'text-blue-500' :
                      order.status === 'price-accepted' ? 'text-green-500' :
                      order.status === 'in-progress' ? 'text-purple-500' :
                      order.status === 'completed' ? 'text-green-500' :
                      'text-red-500'
                    }`}>{order.status.replace('-', ' ')}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteOrder(order.id)} 
                    className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
                
                <div className="font-bold text-lg group-hover:text-primary transition-colors mb-2">{order.title}</div>
                <div className="text-sm text-muted-foreground mb-4 line-clamp-2">{order.description}</div>
                
                {order.offeredPrice && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-500">Price Offered:</span>
                      <span className="font-bold text-blue-500">${order.offeredPrice}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    Budget: <span className="text-primary">${order.budget}</span> | Client: <span className="text-primary">{order.clientUid}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedOrder?.id === order.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </motion.button>
                </div>
                
                {order.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApproveOrder(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-500/10 text-green-500 px-4 py-3 font-medium transition-all hover:bg-green-500/20"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeclineOrder(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-500 px-4 py-3 font-medium transition-all hover:bg-red-500/20"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </motion.button>
                  </div>
                )}
                
                {order.status === 'price-offered' && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-blue-500">Offer Price:</span>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={offeringPrice[order.id] || ''}
                        onChange={(e) => setOfferingPrice(prev => ({ ...prev, [order.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-blue-500/20 bg-background focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOfferPrice(order.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 text-white px-4 py-3 font-medium transition-all hover:bg-blue-600"
                    >
                      Send Price Offer
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Admin Chat Panel */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <MessageSquare className="h-6 w-6" />
            </div>
            Order Chat
          </h2>
          {selectedOrder ? (
            <AdminChat order={selectedOrder} />
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-primary/10 rounded-[2rem] bg-primary/5">
              <div className="p-6 rounded-full bg-primary/5 mb-6 opacity-20">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Admin Communication</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Select an order to start chatting with the client about their project.</p>
            </div>
          )}
        </div>

        {/* Manage Users */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-6 w-6" />
            </div>
            User Management
          </h2>
          <div className="space-y-6">
            {users.map((u, i) => (
              <motion.div 
                key={u.uid} 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-4xl border border-primary/10 bg-primary/5 flex items-center justify-between group hover:border-primary/30 transition-all"
              >
                <div>
                  <div className="font-bold text-lg group-hover:text-primary transition-colors">{u.displayName}</div>
                  <div className="text-xs text-muted-foreground font-medium">{u.email}</div>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => handleUpdateUserRole(u.uid, e.target.value)}
                  className="text-xs font-bold uppercase tracking-widest rounded-xl border border-primary/10 bg-primary/5 px-4 py-2 focus:border-primary outline-none cursor-pointer hover:bg-primary/10 transition-all"
                >
                  <option value="client" className="bg-background">Client</option>
                  <option value="writer" className="bg-background">Writer</option>
                  <option value="admin" className="bg-background">Admin</option>
                </select>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
