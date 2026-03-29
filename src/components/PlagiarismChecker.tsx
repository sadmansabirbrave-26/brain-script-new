import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Loader2, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { checkPlagiarism } from '../services/aiService';
import { toast } from 'sonner';

const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to check for plagiarism');
      return;
    }

    if (wordCount < 50) {
      toast.error('Please enter at least 50 words for accurate analysis');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending plagiarism check request...');
      const analysisResult = await checkPlagiarism(text);
      console.log('Received analysis result');
      setResult(analysisResult);
      toast.success('Plagiarism analysis completed!');
    } catch (error) {
      console.error('Plagiarism check error:', error);
      
      // Provide a fallback result even if the API fails
      const fallbackResult = `Plagiarism Analysis Results:
Similarity Score: Unable to determine
Assessment: Analysis encountered technical difficulties

Error Details: The plagiarism check service is currently experiencing issues. 

Recommendations:
- Please try again in a few moments
- Check your internet connection
- For important academic work, consider using professional plagiarism detection services
- Ensure your text is properly cited and original

Technical Note: This appears to be a connectivity issue with our analysis service.`;
      
      setResult(fallbackResult);
      toast.error('Analysis service unavailable. Showing basic assessment.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (result: string) => {
    const lowerResult = result.toLowerCase();
    if (lowerResult.includes('high') || lowerResult.includes('80%') || lowerResult.includes('90%')) {
      return { level: 'High', color: 'text-red-500', icon: AlertTriangle };
    } else if (lowerResult.includes('low') || lowerResult.includes('15%') || lowerResult.includes('25%')) {
      return { level: 'Low', color: 'text-green-500', icon: CheckCircle };
    } else {
      return { level: 'Medium', color: 'text-yellow-500', icon: Shield };
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
            <Search className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Plagiarism Checker</h2>
            <p className="text-muted-foreground">AI-powered analysis to ensure content originality</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Your Text</label>
              <span className="text-xs text-muted-foreground">
                {wordCount} words (minimum 50)
              </span>
            </div>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your text here to check for plagiarism. For best results, use at least 100 words..."
              rows={12}
              className="w-full px-6 py-4 rounded-2xl border border-primary/10 bg-primary/5 focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheck}
          disabled={loading || wordCount < 50}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing Text...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              Check for Plagiarism
            </>
          )}
        </motion.button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold">Analysis Results</h3>
              {(() => {
                const risk = getRiskLevel(result);
                const Icon = risk.icon;
                return (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-background border ${risk.color.replace('text-', 'border-')} ${risk.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{risk.level} Risk</span>
                  </div>
                );
              })()}
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="text-sm text-blue-500">
              <p className="font-medium mb-2">Important Notice:</p>
              <p className="leading-relaxed">
                This is an AI-powered analysis tool that provides insights about potential plagiarism issues. 
                For academic submissions, we recommend using multiple plagiarism detection services and ensuring 
                all sources are properly cited according to your institution's guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlagiarismChecker;
