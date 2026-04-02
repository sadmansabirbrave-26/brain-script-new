import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Plus, Calendar, DollarSign, Edit, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

import Chat from '../components/Chat';
import AlertDialog from '../components/AlertDialog';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: 50
  });
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    orderId: string | null;
  }>({
    isOpen: false,
    orderId: null
  });

  useEffect(() => {
    if (!user) return;

    const handleFirestoreError = (error: any) => {
      console.error('Firestore connection error:', error);
      if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
        toast.warning('Real-time updates blocked. Please disable ad blockers for full functionality.');
      }
      setLoading(false);
    };

    const q = query(
      collection(db, 'orders'),
      where('clientUid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        // Sort client-side by createdAt in descending order
        ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => handleFirestoreError(error)
    );

    return () => unsubscribe();
  }, [user]);

  const handleDeleteOrder = async (orderId: string) => {
    setDeleteAlert({ isOpen: true, orderId });
  };

  const confirmDeleteOrder = async () => {
    if (!deleteAlert.orderId) return;
    
    try {
      await deleteDoc(doc(db, 'orders', deleteAlert.orderId));
      toast.success('Project deleted successfully!');
      if (selectedOrderId === deleteAlert.orderId) {
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete project.');
    } finally {
      setDeleteAlert({ isOpen: false, orderId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteAlert({ isOpen: false, orderId: null });
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditFormData({
      title: order.title,
      description: order.description,
      deadline: order.deadline,
      budget: order.budget
    });
  };

  const handleAcceptPrice = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: 'price-accepted',
        budget: orders.find(o => o.id === orderId)?.offeredPrice || 0
      });
      toast.success('Price offer accepted! Your order will be assigned soon.');
    } catch (error) {
      toast.error('Failed to accept price offer.');
    }
  };

  const handleDeclinePrice = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: 'pending',
        offeredPrice: null,
        priceOfferedBy: null,
        priceOfferedAt: null
      });
      toast.success('Price offer declined. Admin will be notified.');
    } catch (error) {
      toast.error('Failed to decline price offer.');
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      await updateDoc(doc(db, 'orders', editingOrder.id), editFormData);
      toast.success('Project updated successfully!');
      setEditingOrder(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update project.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'price-offered': return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'price-accepted': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <AlertCircle className="h-5 w-5 text-purple-500" />;
      case 'cancelled': return <X className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) return <div className="container mx-auto p-8">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Research <span className="text-primary">Dashboard</span></h1>
          <p className="text-xl text-muted-foreground">Welcome back, <span className="text-primary font-bold">{profile?.displayName?.split(' ')[0]}</span>. Manage your projects and track progress.</p>
        </div>
        <Link to="/order" className="inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90">
          <Plus className="h-6 w-6" />
          New Order
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-primary/5 rounded-[3rem] border border-dashed border-primary/10 backdrop-blur-sm"
            >
              <div className="p-6 rounded-full bg-primary/10 w-fit mx-auto mb-8 text-primary">
                <Plus className="h-12 w-12" />
              </div>
              <p className="text-xl text-muted-foreground mb-8">You haven't placed any orders yet.</p>
              <Link to="/order" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                Get started with your first project
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                Active Projects
              </h2>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={cn(
                    "p-8 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden group",
                    selectedOrderId === order.id 
                      ? "border-primary bg-primary/10 shadow-2xl shadow-primary/20" 
                      : "border-primary/10 bg-primary/5 shadow-sm hover:border-primary/50 hover:bg-primary/10"
                  )}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getStatusIcon(order.status)}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-primary">{order.status.replace('-', ' ')}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{order.title}</h3>
                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Deadline: {format(new Date(order.deadline), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Budget: ${order.budget}
                        </div>
                      </div>
                      
                      {order.offeredPrice && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-500">Price Offer:</span>
                            <span className="font-bold text-blue-500 text-lg">${order.offeredPrice}</span>
                          </div>
                          {order.priceOfferedAt && (
                            <div className="text-xs text-muted-foreground">
                              Offered on {format(new Date(order.priceOfferedAt), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-5 rounded-2xl transition-all cursor-pointer",
                        selectedOrderId === order.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      )} onClick={() => setSelectedOrderId(order.id)}>
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      {(order.status === 'pending' || order.status === 'cancelled') && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrder(order);
                            }}
                            className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                            className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </>
                      )}
                      
                      {order.status === 'price-offered' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptPrice(order.id);
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-colors"
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeclinePrice(order.id);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium text-sm hover:bg-red-600 transition-colors"
                          >
                            Decline
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 blur-[60px] rounded-full -z-10" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            {selectedOrderId ? (
              <Chat orderId={selectedOrderId} />
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-primary/10 rounded-[3rem] bg-primary/5 backdrop-blur-sm">
                <div className="p-8 rounded-full bg-primary/5 mb-8 opacity-20">
                  <MessageSquare className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Project Communication</h3>
                <p className="text-muted-foreground leading-relaxed">Select an order from the list to start chatting with your dedicated research expert.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl p-8 rounded-[3rem] border border-primary/10 bg-primary/5 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Edit Project</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEditingOrder(null)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={editFormData.deadline}
                    onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                    className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Budget ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: parseInt(e.target.value) })}
                    className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 rounded-2xl bg-primary text-primary-foreground px-6 py-4 font-bold transition-all hover:bg-primary/90"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 font-bold transition-all hover:bg-primary/10"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={deleteAlert.isOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will remove all associated data including chat messages."
        confirmText="Delete Project"
        cancelText="Cancel"
        onConfirm={confirmDeleteOrder}
        onCancel={cancelDelete}
        type="danger"
      />
    </div>
  );
};

export default Dashboard;
