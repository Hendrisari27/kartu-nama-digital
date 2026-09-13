import React, { useState } from 'react';
import { LogIn, Mail, Lock, User, X, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Dipanggil setelah login/daftar berhasil. */
  onSuccess?: () => void;
}

type Mode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register' && !name.trim()) {
      showToast('Nama wajib diisi.', 'info');
      return;
    }
    if (!email.trim() || !password) {
      showToast('Email dan password wajib diisi.', 'info');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      showToast('Password minimal 6 karakter.', 'info');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.ok === true) {
          showToast('Berhasil masuk. Selamat datang!', 'success');
          resetFields();
          onSuccess?.();
          onClose();
        } else if (result.reason === 'not_found') {
          showToast('Email belum terdaftar di perangkat ini. Silakan Daftar Akun dulu.', 'error');
          setMode('register');
        } else {
          showToast('Password salah. Coba lagi.', 'error');
        }
      } else {
        await register(name, email, password);
        showToast('Akun berhasil dibuat. Anda sudah masuk!', 'success');
        resetFields();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Terjadi kesalahan.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/80 flex items-center justify-center shadow-inner">
              {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isRegister ? 'Daftar Akun Baru' : 'Masuk untuk Edit Kartu'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isRegister
                  ? 'Buat akun untuk mulai mengedit kartu nama'
                  : 'Login diperlukan untuk mengedit data kartu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden font-medium text-slate-900"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden font-medium text-slate-900"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Minimal 6 karakter' : 'Masukkan password'}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden font-medium text-slate-900"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{submitting ? 'Memproses...' : isRegister ? 'Daftar & Masuk' : 'Masuk'}</span>
          </button>

          {/* Toggle login/daftar */}
          <div className="text-center text-xs text-slate-500">
            {isRegister ? (
              <>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Masuk di sini
                </button>
              </>
            ) : (
              <>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Daftar Akun
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
