import React, { useState } from 'react';
import { Lock, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or 2026 or admin
    if (pin === '1234' || pin === '2026' || pin.toLowerCase() === 'admin') {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('رمز المرور غير صحيح. (رمز الاختبار السريع: 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-right" dir="rtl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-900">دخول الإدارة (Admin PIN)</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <p className="text-stone-600">
            أدخل رمز المرور الإداري للوصول إلى لوحة الإحصائيات الشاملة وسجل البريد:
          </p>

          <input
            type="password"
            autoFocus
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-lg tracking-widest font-mono py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500"
          />

          {error && (
            <p className="text-red-600 font-bold text-[11px]">{error}</p>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer"
            >
              تأكيد الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
