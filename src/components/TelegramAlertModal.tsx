import React, { useState } from 'react';
import {
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { TelegramConfig, UrgentRequest } from '../types/blood';
import {
  OFFICIAL_TELEGRAM_CHANNEL,
  createTelegramShareLink,
  sendTelegramApiAlert,
} from '../utils/telegram';

interface TelegramAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramConfig: TelegramConfig;
  onSaveConfig: (config: TelegramConfig) => void;
  urgentRequests: UrgentRequest[];
  selectedRequest?: UrgentRequest | null;
}

export const TelegramAlertModal: React.FC<TelegramAlertModalProps> = ({
  isOpen,
  onClose,
  telegramConfig,
  onSaveConfig,
  urgentRequests,
  selectedRequest,
}) => {
  const [botToken, setBotToken] = useState(telegramConfig.botToken || '');
  const [chatId, setChatId] = useState(telegramConfig.chatId || '@dammak_alerts');
  const [targetRequestId, setTargetRequestId] = useState<string>(
    selectedRequest?.id || (urgentRequests[0]?.id ?? '')
  );

  const [isSending, setIsSending] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentTargetRequest =
    urgentRequests.find((r) => r.id === targetRequestId) ||
    selectedRequest ||
    urgentRequests[0];

  const handleSaveSettings = () => {
    onSaveConfig({
      ...telegramConfig,
      botToken: botToken.trim(),
      chatId: chatId.trim(),
    });
    setResultMessage({
      type: 'success',
      text: 'تم حفظ إعدادات Telegram API محلياً في المتصفح بنجاح!',
    });
  };

  const handleSendApiBroadcast = async () => {
    if (!currentTargetRequest) {
      setResultMessage({
        type: 'error',
        text: 'يرجى اختيار حالة عاجلة لإرسال التنبيه بشأنها',
      });
      return;
    }

    if (!botToken.trim()) {
      setResultMessage({
        type: 'error',
        text: 'يرجى إدخال رمز بوت تيليجرام (Telegram Bot Token) للإرسال المباشر عبر API',
      });
      return;
    }

    setIsSending(true);
    setResultMessage(null);

    const config: TelegramConfig = {
      ...telegramConfig,
      botToken: botToken.trim(),
      chatId: chatId.trim() || '@dammak_alerts',
    };

    // Save configuration
    onSaveConfig(config);

    const res = await sendTelegramApiAlert(config, currentTargetRequest);
    setIsSending(false);

    if (res.success) {
      setResultMessage({
        type: 'success',
        text: res.message,
      });
    } else {
      setResultMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Send className="w-5 h-5 rotate-[-20deg]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                نظام إشعارات وتنبيهات تيليجرام
              </h3>
              <p className="text-xs text-neutral-500">
                انضمام مباشر وإرسال التنبيهات عبر واجهة Telegram API من المتصفح
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 text-xl cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Direct Official Channel Join Button */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 text-right">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 mb-1">
                <span>القناة الرسمية المعتمدة للمنصة:</span>
              </div>
              <h4 className="text-base font-extrabold text-sky-950 font-mono" dir="ltr">
                @dammak_alerts
              </h4>
              <p className="text-xs text-sky-800/80 mt-1">
                تصلك نداءات الدم الحرجة فوراً وإشعارات الحالات التي تحتاج أكياس دم عاجلة
              </p>
            </div>
            <a
              href={OFFICIAL_TELEGRAM_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5 rotate-[-20deg]" />
              <span>انضم الآن للقناة</span>
            </a>
          </div>
        </div>

        {/* Feedback message */}
        {resultMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2 mb-4 border ${
              resultMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            {resultMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{resultMessage.text}</div>
          </div>
        )}

        {/* Section 2: Browser-based Telegram API Broadcast */}
        <div className="space-y-4 pt-2 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900">
              إرسال تنبيه عبر Telegram API مباشرة
            </h4>
            <span className="text-[11px] text-neutral-500 font-mono">Client-side API</span>
          </div>

          {/* Select request to broadcast */}
          {urgentRequests.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                اختر الحالة العاجلة المراد إذاعتها:
              </label>
              <select
                value={currentTargetRequest?.id || ''}
                onChange={(e) => setTargetRequestId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {urgentRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.bloodType}] {r.patientName} - {r.hospital} ({r.city})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">لا توجد حالات حالياً</p>
          )}

          {/* Bot Token Configuration */}
          <div className="space-y-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800">
                إعدادات البوت والقناة (اختياري للإرسال الآلي):
              </span>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-sky-600 hover:underline flex items-center gap-0.5"
              >
                إنشاء بوت مجاناً عبر @BotFather
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div>
              <label className="block text-[11px] text-neutral-600 mb-1">
                Telegram Bot Token:
              </label>
              <input
                type="text"
                placeholder="مثال: 7123456789:AAHq..."
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-600 mb-1">
                Channel or Chat ID (معرّف القناة أو المحادثة):
              </label>
              <input
                type="text"
                placeholder="@dammak_alerts أو رقم الـ Chat ID"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg font-mono text-left"
                dir="ltr"
              />
              <span className="text-[10px] text-neutral-400 block mt-1">
                تأكد من إضافة البوت كمشرف (Admin) في القناة لتمكينه من نشر التنبيهات.
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="text-xs text-neutral-700 hover:text-neutral-900 underline cursor-pointer"
            >
              حفظ الإعدادات في هذا المتصفح
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleSendApiBroadcast}
              disabled={isSending || !currentTargetRequest}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                isSending
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              <Send className="w-3.5 h-3.5 rotate-[-20deg]" />
              <span>{isSending ? 'جارٍ إرسال التنبيه...' : 'إرسال التنبيه عبر Telegram API'}</span>
            </button>

            {/* Quick Share Link (Works for anyone without bot setup) */}
            {currentTargetRequest && (
              <a
                href={createTelegramShareLink(currentTargetRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl transition-colors whitespace-nowrap"
              >
                <span>مشاركة مباشرة لتيليجرام</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
