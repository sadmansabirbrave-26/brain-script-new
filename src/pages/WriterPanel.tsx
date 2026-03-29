import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Briefcase, DollarSign, CheckCircle, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const WriterPanel: React.FC = () => {
  const { user } = useAuth();
  const [availableJobs, setAvailableJobs] = useState<Order[]>([]);
  const [myJobs, setMyJobs] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Available jobs (pending)
    const qAvailable = query(
      collection(db, 'orders'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAvailable = onSnapshot(qAvailable, (snapshot) => {
      setAvailableJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    // My jobs
    const qMy = query(
      collection(db, 'orders'),
      where('writerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeMy = onSnapshot(qMy, (snapshot) => {
      setMyJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });

    return () => {
      unsubscribeAvailable();
      unsubscribeMy();
    };
  }, [user]);

  const handleAcceptJob = async (orderId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        writerUid: user.uid,
        status: 'in-progress'
      });
      toast.success('Job accepted!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to accept job.');
    }
  };

  const handleCompleteJob = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'completed'
      });
      toast.success('Job marked as completed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update job status.');
    }
  };

  if (loading) return <div className="container mx-auto p-8">Loading writer panel...</div>;

  const totalEarnings = myJobs
    .filter(j => j.status === 'completed')
    .reduce((acc, curr) => acc + curr.budget, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Writer <span className="text-primary">Panel</span></h1>
        <p className="text-xl text-muted-foreground">Manage your research assignments and track your earnings.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-10 rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md">
                <DollarSign className="h-8 w-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-sm opacity-80">Total Earnings</span>
            </div>
            <div className="text-5xl font-black tracking-tighter">${totalEarnings}</div>
          </div>
          <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 blur-[60px] rounded-full" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-10 rounded-[3rem] border border-primary/10 bg-primary/5 backdrop-blur-sm shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-8 w-8" />
            </div>
            <span className="font-black uppercase tracking-widest text-sm text-muted-foreground">Active Jobs</span>
          </div>
          <div className="text-5xl font-black tracking-tighter text-primary">{myJobs.filter(j => j.status === 'in-progress').length}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-10 rounded-[3rem] border border-primary/10 bg-primary/5 backdrop-blur-sm shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <span className="font-black uppercase tracking-widest text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="text-5xl font-black tracking-tighter text-emerald-500">{myJobs.filter(j => j.status === 'completed').length}</div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Available Jobs */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-6 w-6" />
            </div>
            Available Jobs
          </h2>
          <div className="space-y-6">
            {availableJobs.length === 0 ? (
              <div className="text-center py-20 bg-primary/5 rounded-[3rem] border border-dashed border-primary/10">
                <p className="text-muted-foreground text-lg">No jobs available at the moment.</p>
              </div>
            ) : (
              availableJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2.5rem] border border-primary/10 bg-primary/5 shadow-sm hover:border-primary/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-2xl group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xl">${job.budget}</div>
                  </div>
                  <p className="text-muted-foreground mb-8 line-clamp-2 leading-relaxed">{job.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Calendar className="h-4 w-4" />
                      Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAcceptJob(job.id)}
                      className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      Accept Job
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* My Active Jobs */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase className="h-6 w-6" />
            </div>
            My Active Jobs
          </h2>
          <div className="space-y-6">
            {myJobs.filter(j => j.status === 'in-progress').length === 0 ? (
              <div className="text-center py-20 bg-primary/5 rounded-[3rem] border border-dashed border-primary/10">
                <p className="text-muted-foreground text-lg">You have no active jobs.</p>
              </div>
            ) : (
              myJobs.filter(j => j.status === 'in-progress').map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 shadow-sm hover:border-primary/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-2xl group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xl">${job.budget}</div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Calendar className="h-4 w-4" />
                      Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteJob(job.id)}
                      className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Mark Completed
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterPanel;
