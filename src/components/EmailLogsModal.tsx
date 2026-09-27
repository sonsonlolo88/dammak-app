import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { EmailLog } from '../types';
import { Mail, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface EmailLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
}

export const EmailLogsModal: React.FC<EmailLogsModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
}) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getEmailLogs(currentUserEmail)
        .then(setLogs)
        .finally(() => setLoading(false));
    }
  }, [isOpen, currentUserEmail]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 text-right my-8" dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">سجل التنبيهات البريدية (Email Logs)</h3>
              <p className="text-[11px] text-stone-500">الإشعارات الآلية المرسلة للمتبرعين المطابقين للحالات</p>
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

        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-500">
              <RefreshCw className="w-6 h-6 animate-spin text-red-600 mx-auto mb-2" />
              <span>جارٍ تحميل السجلات...</span>
            </div>
          ) : logs.length === 0 ? (
            <p className="p-8 text-center text-xs text-stone-500">لا توجد سجلات بريد حالياً</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-stone-800">{log.recipientName}</span>
                    <span className="text-[11px] text-stone-500 font-mono" dir="ltr">{log.recipientEmail}</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    فصيلة: <strong className="font-mono text-red-600">{log.bloodType}</strong> | المستشفى: {log.hospital} ({log.city})
                  </p>
                </div>
                <div className="text-left shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>تم الإرسال</span>
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-1 font-mono">
                    {new Date(log.sentAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
