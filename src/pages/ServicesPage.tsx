import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FileText, BarChart3, Edit3, Lightbulb, CheckCircle2, BookOpen } from 'lucide-react';
import TopicGenerator from '../components/TopicGenerator';
import AbstractGenerator from '../components/AbstractGenerator';

const services = [
  {
    id: 'writing',
    title: 'Research Writing',
    icon: <FileText className="h-8 w-8" />,
    description: 'Custom research papers, theses, and dissertations tailored to your specific requirements.',
    features: ['PhD-level writers', 'Plagiarism-free content', 'Proper citations (APA, MLA, etc.)', 'Unlimited revisions'],
    price: 'From $15/page'
  },
  {
    id: 'analysis',
    title: 'Data Analysis',
    icon: <BarChart3 className="h-8 w-8" />,
    description: 'Expert statistical analysis and data visualization for your research projects.',
    features: ['SPSS, R, Python, Excel', 'Detailed interpretations', 'Clear visualizations', 'Methodology support'],
    price: 'From $50/project'
  },
  {
    id: 'editing',
    title: 'Editing & Proofreading',
    icon: <Edit3 className="h-8 w-8" />,
    description: 'Meticulous review of your academic work to ensure it meets the highest standards.',
    features: ['Grammar & syntax check', 'Clarity improvement', 'Formatting consistency', 'Fast turnaround'],
    price: 'From $5/page'
  },
  {
    id: 'thesis',
    title: 'Thesis Support',
    icon: <BookOpen className="h-8 w-8" />,
    description: 'Comprehensive guidance for your thesis or dissertation from proposal to defense.',
    features: ['Topic selection', 'Literature review', 'Methodology design', 'Defense preparation'],
    price: 'From $100/project'
  }
];

const aiTools = [
  { title: 'Topic Generator', icon: <Lightbulb className="h-6 w-6" />, desc: 'Stuck? Let AI generate unique research topics for you.' },
  { title: 'Abstract Generator', icon: <FileText className="h-6 w-6" />, desc: 'Summarize your entire paper into a professional abstract in seconds.' }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Expert Services for Every Researcher
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We combine human expertise with AI efficiency to deliver unparalleled academic support.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 mb-32">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -15, scale: 1.02 }}
            className="flex flex-col p-10 rounded-[3rem] border border-primary/10 bg-primary/5 backdrop-blur-md shadow-sm hover:shadow-primary/20 hover:border-primary/50 transition-all duration-500 group"
          >
            <div className="p-5 rounded-2xl bg-primary/10 w-fit mb-10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
              {s.icon}
            </div>
            <h2 className="text-3xl font-bold mb-6">{s.title}</h2>
            <p className="text-muted-foreground mb-10 flex-grow leading-relaxed">{s.description}</p>
            <ul className="space-y-4 mb-12">
              {s.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-8 border-t border-primary/10 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Starting at</span>
                <span className="font-black text-2xl text-primary">{s.price}</span>
              </div>
              <Link to="/order" className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 text-center">
                Order Now
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div id="topic-generator" className="grid lg:grid-cols-2 gap-20 items-center mb-40">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Stuck on a <br /><span className="text-primary">Research Topic?</span></h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Our AI-powered topic generator uses the latest trends and academic gaps to suggest unique research directions for your next project.
          </p>
          <div className="space-y-6">
            {[
              'Trending academic subjects',
              'Unique research perspectives',
              'Gap analysis in current literature'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <TopicGenerator />
        </motion.div>
      </div>

      <div id="abstract-generator" className="grid lg:grid-cols-2 gap-20 items-center mb-40">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Professional <br /><span className="text-primary">Abstract Generator</span></h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Transform your research into compelling academic abstracts with our AI-powered generator. Create professional summaries that capture the essence of your work.
          </p>
          <div className="space-y-6">
            {[
              'Academic writing standards',
              '150-250 word optimization',
              'Professional tone and structure',
              'Instant results'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <AbstractGenerator />
        </motion.div>
      </div>

      </div>
  );
};

export default ServicesPage;
