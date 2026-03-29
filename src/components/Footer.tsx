import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary/5 border-t border-primary/10 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-16 mb-20 text-center">
          <div className="max-w-2xl">
            <Link to="/" className="flex items-center justify-center gap-3 font-bold text-3xl mb-8 group">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8" />
              </div>
              <span className="tracking-tight">Brain Script</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The ultimate AI-powered research assistance platform for students and researchers worldwide. 
              Excellence delivered with PhD-level expertise.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="font-black uppercase tracking-widest text-sm mb-8 text-primary">Connect</h4>
            <div className="flex gap-4 mb-10">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-primary/5 border border-primary/10 hover:text-primary hover:border-primary/50 transition-all"><Twitter className="h-6 w-6" /></a>
              <a href="https://github.com/sadmansabirbrave-26" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-primary/5 border border-primary/10 hover:text-primary hover:border-primary/50 transition-all"><Github className="h-6 w-6" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-primary/5 border border-primary/10 hover:text-primary hover:border-primary/50 transition-all"><Linkedin className="h-6 w-6" /></a>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground font-bold group cursor-pointer hover:text-primary transition-colors">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              support@brainscript.com
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-medium">
          <p>© 2026 Brain Script. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/" className="hover:text-primary transition-colors uppercase tracking-widest text-xs font-bold">Status</Link>
            <Link to="/" className="hover:text-primary transition-colors uppercase tracking-widest text-xs font-bold">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
