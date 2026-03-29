import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star, Shield, Zap, Users, Lightbulb, FileText } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8"
            >
              <Zap className="h-4 w-4" />
              Next-Gen Research Platform
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Empowering Research with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">AI Precision</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Brain Script is your ultimate platform for research writing, data analysis, and academic excellence. 
              Get expert help from PhD writers and AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/order" className="group relative inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                Get Research Help Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center rounded-full bg-primary/5 border border-primary/20 px-10 py-5 text-lg font-bold text-foreground backdrop-blur-sm transition-all hover:bg-primary/10 hover:border-primary/40 hover:scale-105">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-[150px] rounded-full" 
        />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-primary/5 border border-primary/10 p-12 rounded-[3rem] backdrop-blur-md">
          {[
            { label: 'Completed Orders', value: '15k+' },
            { label: 'Expert Writers', value: '500+' },
            { label: 'Customer Satisfaction', value: '99%' },
            { label: 'Average Rating', value: '4.9/5' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Overview */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Our Premium Services
          </motion.h2>
          <p className="text-muted-foreground">Tailored solutions for every academic and research need.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Research Writing', desc: 'PhD-level writing for theses, dissertations, and journals.', icon: <CheckCircle className="h-10 w-10 text-primary" /> },
            { title: 'Data Analysis', desc: 'Expert analysis using SPSS, Python, R, and Excel.', icon: <Zap className="h-10 w-10 text-primary" /> },
            { title: 'Editing & Proofreading', desc: 'Meticulous review to ensure clarity and academic rigor.', icon: <Shield className="h-10 w-10 text-primary" /> },
            { title: 'Thesis Support', desc: 'Comprehensive guidance from proposal to final defense.', icon: <Users className="h-10 w-10 text-primary" /> },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-10 rounded-[2.5rem] border border-primary/10 bg-primary/5 backdrop-blur-sm shadow-sm hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <div className="mb-8 p-4 rounded-2xl bg-primary/10 w-fit">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">{service.desc}</p>
              <Link to="/services" className="text-primary font-bold inline-flex items-center group">
                Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-primary/5 py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to academic success.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {[
              { step: '01', title: 'Submit Your Order', desc: 'Provide details about your project, deadline, and requirements.' },
              { step: '02', title: 'Writer Assigned', desc: 'We match you with the best expert in your specific field.' },
              { step: '03', title: 'Receive Your Work', desc: 'Download your completed, high-quality research paper.' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center group"
              >
                <div className="text-8xl font-black text-primary/5 absolute -top-16 left-1/2 -translate-x-1/2 transition-all group-hover:text-primary/10">{item.step}</div>
                <div className="mb-6 relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
                <p className="text-muted-foreground relative z-10 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-primary text-primary" />)}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Sarah J.', role: 'PhD Candidate', text: 'Brain Script helped me with my data analysis section. The results were perfect and saved me weeks of work.' },
            { name: 'Michael R.', role: 'Masters Student', text: 'The research writing service is top-notch. My thesis was accepted with zero revisions needed.' },
            { name: 'Emily L.', role: 'Undergrad', text: 'Fast, reliable, and high quality. The AI abstract generator is a game changer!' },
          ].map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 shadow-sm relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="h-20 w-20" />
              </div>
              <p className="italic text-muted-foreground mb-8 leading-relaxed relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-lg">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="bg-primary/5 py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              AI-Powered Research Tools
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Free tools to kickstart your research process and boost your academic productivity.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 relative z-10 max-w-4xl mx-auto">
            {[
              {
                title: 'Topic Generator',
                desc: 'Stuck? Let AI generate unique research topics for you.',
                icon: <Lightbulb className="h-8 w-8" />,
                link: '/services#topic-generator'
              },
              {
                title: 'Abstract Generator',
                desc: 'Summarize your entire paper into a professional abstract in seconds.',
                icon: <FileText className="h-8 w-8" />,
                link: '/services#abstract-generator'
              }
            ].map((tool, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={tool.link}
                  className="block p-10 rounded-[2.5rem] bg-background/50 border border-primary/10 text-center hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                    <div className="p-4 rounded-2xl bg-primary/10">{tool.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{tool.desc}</p>
                  <div className="flex items-center justify-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    <span>Try Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute top-0 right-0 h-96 w-96 bg-primary/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 h-96 w-96 bg-primary/5 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-blue-700 rounded-[4rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">Ready to Excel?</h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who trust Brain Script for their research and academic needs.
            </p>
            <Link to="/order" className="inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-blue-50 w-full sm:w-auto">
              Start Your Order Now
            </Link>
          </div>
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-[500px] w-[500px] bg-white/10 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-white/10 blur-[120px] rounded-full" 
          />
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
