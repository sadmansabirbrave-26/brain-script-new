import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { FileText, Calendar, DollarSign, Send, Sparkles, ChevronDown } from 'lucide-react';
import { generateAbstract } from '../services/aiService';

const OrderPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: 50,
    serviceType: 'writing'
  });

  const [estimatedPrice, setEstimatedPrice] = useState(50);

  useEffect(() => {
    // Simple price estimation logic
    let base = 15;
    switch (formData.serviceType) {
      case 'writing': base = 15; break;
      case 'analysis': base = 50; break;
      case 'editing': base = 5; break;
      case 'thesis': base = 100; break;
    }
    const daysToDeadline = formData.deadline ? Math.max(1, (new Date(formData.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 7;
    const urgencyMultiplier = daysToDeadline < 2 ? 2 : daysToDeadline < 5 ? 1.5 : 1;
    setEstimatedPrice(Math.round(base * urgencyMultiplier * 10) / 10);
  }, [formData.serviceType, formData.deadline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        clientUid: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedPrice
      });
      toast.success('Order submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit order.');
    } finally {
      setLoading(false);
    }
  };

  const handleAiAbstract = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please provide a title and description first.');
      return;
    }
    setAiLoading(true);
    try {
      const abstract = await generateAbstract(formData.title, formData.description);
      setFormData(prev => ({ ...prev, description: prev.description + "\n\nAI Generated Abstract:\n" + abstract }));
      toast.success('Abstract generated and added to description!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate abstract.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Submit Your <span className="text-primary">Order</span></h1>
        <p className="text-xl text-muted-foreground">Fill in the details for your research project.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-10 md:p-16 rounded-[3rem] border border-primary/10 bg-primary/5 backdrop-blur-xl shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Service Type</label>
              <div className="relative">
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="writing" className="bg-background">Research Writing</option>
                  <option value="analysis" className="bg-background">Data Analysis</option>
                  <option value="editing" className="bg-background">Editing & Proofreading</option>
                  <option value="thesis" className="bg-background">Thesis Support</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-2xl border border-primary/10 bg-primary/5 pl-12 pr-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. The Impact of AI on Modern Education"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Description & Requirements</label>
              <button
                type="button"
                onClick={handleAiAbstract}
                disabled={aiLoading}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50 transition-all"
              >
                <Sparkles className="h-3 w-3" />
                {aiLoading ? 'Generating...' : 'AI Abstract Generator'}
              </button>
            </div>
            <textarea
              required
              rows={6}
              placeholder="Describe your project in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-primary/10 bg-primary/5 px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-inner">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Estimated Price</div>
                <div className="text-3xl font-black text-primary">${estimatedPrice}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-3 rounded-full bg-primary px-12 py-5 font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Order'}
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OrderPage;
