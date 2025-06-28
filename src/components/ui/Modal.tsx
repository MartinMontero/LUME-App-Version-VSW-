import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
      <div className="modal-content max-w-lg w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-8 border-b border-lume-ocean/30">
          <h3 className="text-2xl font-display font-semibold text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-lume-mist hover:text-white hover:bg-lume-ocean/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};