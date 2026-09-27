import React, { useState, useEffect } from 'react';
import { Send, X, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, KeyRound, MessageSquare } from 'lucide-react';

interface TelegramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const TelegramSettingsModal: React.FC<TelegramSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; msg?: string } | null>(null);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const storedToken = localStorage.getItem('damak_telegram_token') || '';
      const storedChat = localStorage.getItem('damak_telegram_chat') || '';
      setToken(storedToken);
      setChatId(storedChat || '@dammak_alerts');
      setSaved(false);
      setTestStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanToken = token.trim();
    const cleanChat = chatId.trim();

    localStorage.setItem('damak_telegram_token', cleanToken);
    localStorage.setItem('damak_telegram_chat', cleanChat);
    setSaved(true);
    onConfigSaved();
    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleTestConnection = async () => {
    const cleanToken = token.trim();
    let cleanChat = chatId.trim();

    if (!cleanToken) {
      setTestStatus({
        loading: false,
        success: false,
        msg: 'يرجى كتابة الـ Bot Token أولاً للتحقق من الاتصال.',
      });
      return;
    }

    if (!cleanChat) {
      cleanChat = '@dammak_alerts';
      setChatId(cleanChat);
    }

    // Save them first
    localStorage.setItem('damak_telegram_token', cleanToken);
    localStorage.setItem('damak_telegram_chat', cleanChat);
    onConfigSaved();

    setTestStatus({ loading: true });

    try {
      // 1. Verify Bot Token with getMe
      const meRes = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
      const meData = await meRes.json();

      if (!meData.ok) {
        setTestStatus({
          loading: false,
          success: false,
          msg: `رمز البوت غير صالح: ${meData.description || 'تأكد من نسخه كاملاً من @BotFather'}`,
        });
        return;
      }

      const botUsername = meData.result?.username;

      // 2. Try sending test message
      const sendRes = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChat,
          text: `✅ *تم اختبار الاتصال بنجاح*\nبوت: @${botUsername}\nمنصة: «دمك مفتاح حياة» جاهزة لبث نداءات التبرع بالدم فوراً.`,
          parse_mode: 'Markdown',
        }),
      });

      const sendData = await sendRes.json();
      if (sendData.ok) {
        setTestStatus({
          loading: false,
          success: true,
          msg: `ممتاز! تم الاتصال بنجاح بالبوت (@${botUsername}) وإرسال رسالة تجريبية للقناة (${cleanChat}).`,
        });
      } else {
        setTestStatus({
          loading: false,
          success: false,
          msg: `البوت صحيح (@${botUsername})، لكن فشل الإرسال للقناة: ${sendData.description}. (تأكد من إضافة البوت كـ Admin أو المشرف في القناة/الجروب).`,
        });
      }
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        msg: 'تعذر الاتصال بخوادم تيليجرام. تأكد من اتصال الإنترنت أو صحة الرمز.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 text-right my-6" dir="rtl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4 rotate-[-20deg]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">إعدادات Telegram API</h3>
              <p className="text-[11px] text-stone-500">نشر التنبيهات المباشر عبر البوت والقناة</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>Telegram Bot Token:</span>
              </label>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>إنشاء بوت عبر @BotFather</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              placeholder="مثال: 7123456789:AAHq_AbCd..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sky-500 font-mono text-left text-xs"
              dir="ltr"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              انسخ الـ HTTP API Token الذي أرسله لك بوت @BotFather والصقه هنا.
            </p>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>معرّف القناة أو الجروب (Chat ID / Username):</span>
            </label>
            <input
              type="text"
              placeholder="@اسم_القناة أو -100123456789"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sky-500 font-mono text-left text-xs"
              dir="ltr"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              ⚠️ تنبيه هام: يجب إضافة البوت كـ <b>مشرف (Admin)</b> في القناة حتى يستطيع النشر فيها.
            </p>
          </div>

          {/* Test Status feedback */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                testStatus.loading
                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                  : testStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {testStatus.loading ? (
                <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0 mt-0.5" />
              ) : testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{testStatus.loading ? 'جارٍ فحص البوت وإرسال رسالة تجريبية...' : testStatus.msg}</span>
            </div>
          )}

          {saved && !testStatus && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تم حفظ الإعدادات بنجاح في المتصفح!</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus?.loading}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus?.loading ? 'animate-spin' : ''}`} />
              <span>فحص الاتصال وإرسال تجربة</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
              >
                حفظ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
