import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 font-bold text-2xl group">
          <div className="rounded-xl text-primary scale-110 group-hover:scale-110 transition-transform">
            <img 
              src="/brain-script-logo.jpeg" 
              alt="Brain Script Logo" 
              className="rounded-lg w-28 h-auto sm:w-28 md:w-32 lg:w-40 transition-all duration-300"
            />
          </div>
          {/* <span className="hidden sm:inline tracking-tight">Brain Script</span> */}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/services" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Services</Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              {profile?.role === 'writer' && <Link to="/writer" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Writer Panel</Link>}
              {profile?.role === 'admin' && <Link to="/admin" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Admin</Link>}
            </>
          )}
          
          <div className="flex items-center gap-6 ml-4">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold">{profile?.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleSignOut} 
                  className="p-3 rounded-xl hover:bg-destructive/10 transition-colors text-destructive group"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90">
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-primary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-b border-primary/10 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 p-8">
              <Link to="/services" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase tracking-widest">Services</Link>
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase tracking-widest">Dashboard</Link>
                  {profile?.role === 'writer' && <Link to="/writer" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase tracking-widest">Writer Panel</Link>}
                  {profile?.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase tracking-widest">Admin</Link>}
                </>
              )}
              {!user ? (
                <Link to="/login" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground">
                  Get Started
                </Link>
              ) : (
                <button 
                  onClick={() => { handleSignOut(); setIsOpen(false); }} 
                  className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
