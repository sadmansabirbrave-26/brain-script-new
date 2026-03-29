import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.displayName);
        toast.success('Account created successfully!');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Successfully logged in!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 rounded-[3rem] border border-primary/10 bg-primary/5 backdrop-blur-xl shadow-2xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="p-5 rounded-2xl bg-primary/10 text-primary shadow-inner">
            <BookOpen className="h-12 w-12" />
          </div>
        </motion.div>
        <h1 className="text-4xl font-bold mb-3">Welcome to <br /><span className="text-primary">Brain Script</span></h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {isSignUp ? 'Create your account to get started' : 'Sign in to access your research dashboard and expert help'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                name="displayName"
                placeholder="Full Name"
                value={formData.displayName}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-primary/10 bg-primary/5 focus:bg-primary/10 focus:border-primary/50 transition-all outline-none"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-primary/10 bg-primary/5 focus:bg-primary/10 focus:border-primary/50 transition-all outline-none"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-primary/10 bg-primary/5 focus:bg-primary/10 focus:border-primary/50 transition-all outline-none"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl border border-primary/10 bg-primary text-primary-foreground px-6 py-4 font-bold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </motion.button>
        </form>
        
        <div className="mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
        
        <div className="mt-10 text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">
          Secure Academic Environment
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
