import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      confirmBg: 'bg-red-500 hover:bg-red-600',
      iconBg: 'bg-red-500/10'
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
      iconBg: 'bg-yellow-500/10'
    },
    info: {
      icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-500/10'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-6 rounded-[2rem] border border-primary/10 bg-primary/5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${currentStyle.iconBg}`}>
              {currentStyle.icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 font-medium transition-all hover:bg-primary/10"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className={`flex-1 rounded-xl text-white px-4 py-3 font-medium transition-all ${currentStyle.confirmBg}`}
          >
            {confirmText}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlertDialog;
