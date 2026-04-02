import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Test function to verify Firestore connectivity
  const testFirestoreConnection = async () => {
    try {
      console.log('Testing Firestore connection...');
      const testQuery = query(collection(db, 'newsletter'), limit(1));
      const snapshot = await getDocs(testQuery);
      console.log('Firestore connection test successful. Found', snapshot.size, 'documents');
    } catch (error: any) {
      console.error('Firestore connection test failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  };

  // Test connection on component mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting to subscribe to newsletter...');
      console.log('Email:', email);
      
      const docRef = await addDoc(collection(db, 'newsletter'), {
        email: email.toLowerCase(),
        subscribedAt: serverTimestamp(),
        status: 'active'
      });
      
      console.log('Newsletter subscription successful! Document ID:', docRef.id);
      
      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
      
      // Reset success state after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
      
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please contact support or check Firestore rules.');
      } else if (error.code === 'unavailable') {
        toast.error('Service temporarily unavailable. Please try again.');
      } else {
        toast.error(`Failed to subscribe: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-primary/5 border-t border-b border-primary/10 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Mail className="h-10 w-10 text-primary" />
          </motion.div>

          {/* Content */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Stay Updated with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Research Insights</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
            Get the latest research tips, AI tools updates, and exclusive content delivered straight to your inbox. Join our community of researchers and students.
          </p>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-primary/10 bg-primary/5 pl-12 pr-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                disabled={loading || subscribed}
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={loading || subscribed}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                subscribed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30'
              }`}
            >
              {subscribed ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Subscribed!
                </>
              ) : loading ? (
                'Subscribing...'
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Subscribe
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">No Spam</h3>
              <p className="text-sm text-muted-foreground">Only valuable content, no spam</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Weekly Updates</h3>
              <p className="text-sm text-muted-foreground">Regular insights and tips</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Exclusive Content</h3>
              <p className="text-sm text-muted-foreground">Subscriber-only resources</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
