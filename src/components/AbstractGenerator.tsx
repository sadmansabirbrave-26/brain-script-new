import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { generateAbstract } from '../services/aiService';
import { toast } from 'sonner';

const AbstractGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedAbstract, setGeneratedAbstract] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in both title and description');
      return;
    }

    setLoading(true);
    try {
      const result = await generateAbstract(title, description);
      setGeneratedAbstract(result);
      toast.success('Abstract generated successfully!');
    } catch (error) {
      toast.error('Failed to generate abstract. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedAbstract);
      setCopied(true);
      toast.success('Abstract copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy abstract');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-background/80 backdrop-blur-xl rounded-[3rem] border border-primary/10 p-8 md:p-12 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Abstract Generator</h2>
            <p className="text-muted-foreground">Create professional academic abstracts instantly</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-3">Research Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your research paper title..."
              className="w-full px-6 py-4 rounded-2xl border border-primary/10 bg-primary/5 focus:border-primary focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Research Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your research methodology, findings, and significance..."
              rows={6}
              className="w-full px-6 py-4 rounded-2xl border border-primary/10 bg-primary/5 focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Abstract...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Abstract
            </>
          )}
        </motion.button>

        {generatedAbstract && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Generated Abstract</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </motion.button>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {generatedAbstract}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AbstractGenerator;
