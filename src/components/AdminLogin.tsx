import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);

  const DEFAULT_HINT = 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save auth session
        localStorage.setItem('sarkari_admin_token', data.token);
        sessionStorage.setItem('sarkari_admin_token', data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Incorrect Admin Password. Access Denied!');
      }
    } catch (err: any) {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyHint = () => {
    navigator.clipboard.writeText(DEFAULT_HINT);
    setCopiedHint(true);
    setPassword(DEFAULT_HINT);
    setTimeout(() => setCopiedHint(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900 font-sans">
      <div className="w-full max-w-md bg-slate-800 border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden relative">
        {/* Top Decorative Gradient Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-red-600 to-amber-400" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Badge & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2 shadow-inner">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-amber-300 uppercase tracking-tight">
              Admin Login Portal
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Sarkari Portal Control & Content Management System
            </p>
          </div>

          {/* Security Notice Box */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-lg p-3.5 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Restricted Access Area</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This panel is password-protected to prevent unauthorized access. Only the portal owner/administrator can log in.
            </p>
            <div className="pt-1 flex items-center justify-between border-t border-slate-800 text-[11px]">
              <span className="text-slate-400 font-medium">
                Default Password: <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">{DEFAULT_HINT}</code>
              </span>
              <button
                type="button"
                onClick={handleCopyHint}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedHint ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Filled!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Auto Fill</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/80 border border-red-600 text-red-200 p-3 rounded-lg text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-sm pl-9 pr-10 py-3 rounded-lg border-2 border-slate-700 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm py-3 px-4 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Verifying Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock Admin Workspace
                </>
              )}
            </button>
          </form>

          {/* Footer Back Button */}
          <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Job Portal Home
            </button>
            <span className="text-slate-500 font-mono text-[10px]">v2.6 Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
