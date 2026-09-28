import { TelegramConfig, UrgentRequest } from '../types/blood';

export const OFFICIAL_TELEGRAM_CHANNEL = 'https://t.me/dammak_alerts';

// القيم الافتراضية الثابتة الخاصة بالنظام
const DEFAULT_BOT_TOKEN = '8992340194:AAGaQN9wF-FBwAgzP8tkOdmTRra9rFMr3ho';
const DEFAULT_CHAT_ID = '@dammak_alerts';

export function formatTelegramHtmlMessage(req: UrgentRequest): string {
  const urgencyHeader =
    req.urgency === 'critical'
      ? '🚨 <b>نداء استغاثة عاجل جداً (حالة حرجة)</b>'
      : req.urgency === 'urgent'
      ? '⚠️ <b>نداء تبرع عاجل بالدم</b>'
      : '🩸 <b>طلب تبرع بالدم</b>';

  return `
${urgencyHeader}
<b>منصة دمك مفتاح حياة</b>

👤 <b>المريض:</b> ${req.patientName}
🩸 <b>الفصيلة المطلوبة:</b> <code>${req.bloodType}</code>
📦 <b>الكمية:</b> ${req.unitsNeeded} وحدة دم
🏥 <b>المستشفى:</b> ${req.hospital} (${req.city})
⏳ <b>المهلة:</b> ${req.deadlineHours ? `خلال ${req.deadlineHours} ساعات` : 'عاجل'}
${req.reason ? `📋 <b>الحالة:</b> ${req.reason}\n` : ''}${req.notes ? `ℹ️ <b>ملاحظات:</b> ${req.notes}\n` : ''}
📞 <b>للتواصل:</b> <code>${req.phone}</code> (${req.contactPerson || 'منسق الحالة'})

قناة التنبيهات: @dammak_alerts
<i>دمك مفتاح حياة - قطرة دم تنقذ نفساً</i>
`.trim();
}

export function createTelegramShareLink(req: UrgentRequest): string {
  const plainText = `🚨 نداء تبرع بالدم عاجل [فصيلة ${req.bloodType}] للمريض: ${req.patientName} في ${req.hospital} - ${req.city}. للتواصل: ${req.phone}. انضم لقناة التنبيهات: https://t.me/dammak_alerts`;
  return `https://t.me/share/url?url=${encodeURIComponent('https://t.me/dammak_alerts')}&text=${encodeURIComponent(plainText)}`;
}

export async function sendTelegramApiAlert(
  config: TelegramConfig,
  request: UrgentRequest
): Promise<{ success: boolean; message: string }> {
  // استخدام الإعداد المدخل أو اللجوء للقيم الافتراضية الثابتة
  const activeToken = (config?.botToken?.trim()) || DEFAULT_BOT_TOKEN;
  const activeChatId = (config?.chatId?.trim()) || DEFAULT_CHAT_ID;

  if (!activeToken || !activeChatId) {
    return {
      success: false,
      message: 'يرجى إدخال رمز البوت (Bot Token) ومعرّف القناة أو المحادثة (Chat ID) لإرسال التنبيه التلقائي عبر Telegram API مباشرة.',
    };
  }

  try {
    const text = formatTelegramHtmlMessage(request);
    const endpoint = `https://api.telegram.org/bot${activeToken}/sendMessage`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: activeChatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return {
        success: true,
        message: 'تم إرسال التنبيه الفوري بنجاح إلى تيليجرام عبر Telegram Bot API!',
      };
    } else {
      return {
        success: false,
        message: `خطأ من واجهة تيليجرام: ${data.description || 'فشل الإرسال'}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `تعذر الاتصال بـ Telegram API: ${error.message || 'خطأ في الشبكة أو CORS'}`,
    };
  }
}
