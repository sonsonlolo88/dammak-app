import React, { useState } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  KeyRound,
  LogIn,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { User, isUserOwner } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Google Sign-In via Firebase Auth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const email = res.user.email || '';
      const isAdmin =
        email.toLowerCase() === 'sonsonlolo88@gmail.com' ||
        email.toLowerCase() === 'admin@damak.life' ||
        email.toLowerCase() === 'printparadise20102010@gmail.com';

      if (!isAdmin) {
        setError('عفواً، هذا الحساب ليس لديه صلاحيات المسؤول.');
        setLoading(false);
        return;
      }

      const user: User = {
        id: res.user.uid,
        name: res.user.displayName || 'المسؤول',
        email,
        phone: res.user.phoneNumber || '',
        bloodType: 'O+',
        city: 'المنصورة (الدقهلية)',
        donorAvailability: true,
        role: 'admin',
        isOwner: true,
        createdAt: new Date().toISOString(),
      };

      setSuccessMsg('تم التحقق بنجاح. مرحباً بك.');
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setError('تعذر تسجيل الدخول عبر Google. يرجى استخدام البريد وكلمة المرور أدناه.');
    } finally {
      setLoading(false);
    }
  };

  // Direct Credentials login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPin = adminPin.trim();

    if (!cleanEmail) {
      setError('يرجى إدخال البريد الإلكتروني للمسؤول.');
      return;
    }

    if (!cleanPin) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    // Secret verification logic
    const isOwnerEmail =
      cleanEmail === 'sonsonlolo88@gmail.com' ||
      cleanEmail === 'admin@damak.life' ||
      cleanEmail === 'admin';

    const validPasswords = ['admin2026', '8888', '123456', '2026', 'admin'];

    if ((isOwnerEmail || cleanEmail.includes('@')) && validPasswords.includes(cleanPin)) {
      const user: User = {
        id: 'admin_' + Date.now(),
        name: 'المسؤول',
        email: cleanEmail.includes('@') ? cleanEmail : 'sonsonlolo88@gmail.com',
        phone: '',
        bloodType: 'O+',
        city: 'المنصورة (الدقهلية)',
        donorAvailability: true,
        role: 'admin',
        isOwner: true,
        createdAt: new Date().toISOString(),
      };

      setSuccessMsg('تم التحقق بنجاح. جاري فتح لوحة الإدارة...');
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 800);
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-stone-200 text-right my-6 animate-fadeIn"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">تسجيل دخول المسؤول</h3>
              <p className="text-[11px] text-stone-500">لوحة الإدارة والتحكم</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="my-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="mt-4 space-y-4 text-xs">
          {/* Email & Password Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-red-500 font-sans text-left text-xs"
                  dir="ltr"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-red-500 font-sans text-left text-xs"
                  dir="ltr"
                  autoComplete="current-password"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-stone-400 absolute">أو</span>
          </div>

          {/* Google Sign-in Alternative */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer text-xs"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-stone-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>الدخول بحساب Google المعتمد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
