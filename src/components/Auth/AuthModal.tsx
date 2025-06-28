import React, { useState } from 'react';
import { X, Mail, Lock, User, Building } from 'lucide-react';
import { signIn, signUp } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    company: '',
    role: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          company: formData.company,
          role: formData.role
        });
        if (error) throw error;
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
      <div className="modal-content max-w-md w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-8 border-b border-lume-ocean/30">
          <h3 className="text-2xl font-display font-semibold text-white">
            {isSignUp ? 'Join the Constellation' : 'Welcome Back to LUME'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-lume-mist hover:text-white hover:bg-lume-ocean/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div className="form-group">
                  <label className="form-label required">
                    Full Name
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Your full name"
                      required
                    />
                    <User className="input-icon" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Company
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Your company or startup"
                    />
                    <Building className="input-icon" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Founder, Developer, Designer"
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label required">
                Email
              </label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
                <Mail className="input-icon" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label required">
                Password
              </label>
              <div className="input-with-icon">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
                <Lock className="input-icon" />
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-lume-spark/10 border border-lume-spark/30 rounded-lg backdrop-blur-sm">
                <p className="form-error">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-constellation w-full justify-center text-lg py-4"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Join Constellation' : 'Enter LUME')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-lume-glow hover:text-lume-soft font-medium transition-colors"
            >
              {isSignUp ? 'Already part of the constellation? Sign in' : 'New to LUME? Join the constellation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};