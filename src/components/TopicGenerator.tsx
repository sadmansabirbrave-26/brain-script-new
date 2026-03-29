import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { generateTopics } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const TopicGenerator: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject.');
      return;
    }
    setLoading(true);
    try {
      const result = await generateTopics(subject);
      // Simple parsing of the list format from Gemini
      const lines = result.split('\n').filter(line => line.trim().match(/^\d+\.|\*|-/));
      setTopics(lines.length > 0 ? lines : [result]);
    } catch (error) {
      toast.error('Failed to generate topics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">AI Topic Generator</h3>
      </div>
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter a subject (e.g. Psychology, AI, Economics)"
          className="flex-grow rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <AnimatePresence>
        {topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-muted/50 text-sm border border-border/50"
              >
                {topic}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicGenerator;
