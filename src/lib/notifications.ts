import { BloodRequest, User } from '../types';

export interface TelegramSendResult {
  success: boolean;
  message: string;
  telegramError?: string;
  isTokenMissing?: boolean;
}

/**
 * Format standard Egyptian phone number to international WhatsApp format (e.g. 201012345678)
 */
export function formatEgyptianPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('0')) {
    return '2' + cleaned;
  }
  if (cleaned.startsWith('20')) {
    return cleaned;
  }
  if (
    cleaned.length === 10 &&
    (cleaned.startsWith('10') || cleaned.startsWith('11') || cleaned.startsWith('12') || cleaned.startsWith('15'))
  ) {
    return '20' + cleaned;
  }
  return cleaned;
}

/**
 * Generates ready-to-send WhatsApp link with customized emergency message
 */
export function buildDonorWhatsAppEmergencyLink(donor: User, request: BloodRequest): string {
  const intlPhone = formatEgyptianPhoneForWhatsApp(donor.phone);
  const urgencyText =
    request.urgency === 'CRITICAL' ? '🚨 حالة حرجة جداً' : request.urgency === 'URGENT' ? '⚠️ حالة طارئة' : 'طلب تبرع';

  const text =
    `السلام عليكم ورحمة الله يا أ/ ${donor.name}،\n` +
    `أتمنى تكون بخير. نتواصل معك عبر منصة "دمك مفتاح حياة" لأن فصيلتك المسجلة (${donor.bloodType}) متطابقة مع نداء دم عاجل:\n\n` +
    `🩸 *نداء تبرع دم: ${urgencyText}*\n` +
    `👤 *المريض:* ${request.patientName}\n` +
    `💉 *الفصيلة المطلوبة:* ${request.requiredBloodType}\n` +
    `🏥 *المستشفى:* ${request.hospital}\n` +
    `📍 *المدينة/المحافظة:* ${request.city}\n` +
    `🔢 *الوحدات المطلوبة:* ${request.unitsNeeded} وحدة\n` +
    (request.reason ? `📋 *تفاصيل الحالة:* ${request.reason}\n` : '') +
    (request.notes ? `📝 *ملاحظات:* ${request.notes}\n` : '') +
    `📞 *رقم أهل المريض للتواصل المباشر:* ${request.contactPhone}\n\n` +
    `قال الله تعالى: {وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا}.\n` +
    `إذا كنت متاحاً للتبرع برجاء الرد والتواصل معنا مباشرة. جزاك الله خيراً!`;

  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds WhatsApp share link to publish request to groups and statuses
 */
export function buildWhatsAppShareBroadcastLink(request: BloodRequest): string {
  const urgencyText = request.urgency === 'CRITICAL' ? '🚨 نداء دم عاجل جداً' : 'نداء تبرع بالدم';

  const text =
    `${urgencyText} - منصة دمك مفتاح حياة\n\n` +
    `🩸 الفصيلة المطلوبة: *${request.requiredBloodType}*\n` +
    `👤 المريض: ${request.patientName}\n` +
    `🏥 المستشفى: ${request.hospital} (${request.city})\n` +
    `🔢 الوحدات: ${request.unitsNeeded} وحدة\n` +
    `📞 هاتف التواصل: ${request.contactPhone}\n\n` +
    `من فضلك شارك الرسالة، الدال على الخير كفاعله!`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Sends emergency broadcast to Telegram channel / group via Telegram Bot API
 */
export async function sendTelegramBroadcast(request: BloodRequest): Promise<TelegramSendResult> {
  const token = (localStorage.getItem('damak_telegram_token') || '').trim();
  const rawChatId = (localStorage.getItem('damak_telegram_chat') || '').trim();
  const chatId = rawChatId || '@dammak_alerts';

  if (!token) {
    return {
      success: false,
      message: 'لم يتم حفظ Bot Token. يرجى الضغط على زر «ضبط التوكن ⚙️» بالأسفل ولصق الرمز ثم الضغط على حفظ.',
      telegramError: 'NO_TOKEN',
      isTokenMissing: true,
    };
  }

  const urgencyEmoji = request.urgency === 'CRITICAL' ? '🚨🚨🚨' : '⚠️';
  const urgencyLabel = request.urgency === 'CRITICAL' ? 'نداء عاجل جداً (حالة حرجة)' : 'نداء طارئ';

  // HTML mode is much safer against reserved markdown characters (like dashes, underscores in names)
  const htmlMessage =
    `<b>${urgencyEmoji} ${urgencyLabel}</b>\n` +
    `<b>منصة «دمك مفتاح حياة»</b>\n\n` +
    `🩸 <b>الفصيلة المطلوبة:</b> ${request.requiredBloodType}\n` +
    `👤 <b>اسم المريض:</b> ${request.patientName}\n` +
    `🏥 <b>المستشفى:</b> ${request.hospital}\n` +
    `📍 <b>المحافظة / المدينة:</b> ${request.city}\n` +
    `🔢 <b>الاحتياج:</b> ${request.unitsNeeded} وحدة دم\n` +
    (request.reason ? `📋 <b>القسم / الحالة:</b> ${request.reason}\n` : '') +
    (request.notes ? `📝 <b>ملاحظات:</b> ${request.notes}\n` : '') +
    `📞 <b>رقم التواصل والواتساب:</b> <code>${request.contactPhone}</code>\n\n` +
    `💬 <a href="https://wa.me/${formatEgyptianPhoneForWhatsApp(request.contactPhone)}">اضغط هنا لمراسلة أهل الحالة عبر واتساب فوراً</a>\n\n` +
    `قال تعالى: <i>{وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا}</i>\n` +
    `#تبرع_بالدم #دمك_مفتاح_حياة`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return {
        success: true,
        message: `تم نشر النداء فوراً على تيليجرام بنجاح في (${chatId})!`,
      };
    } else {
      let friendlyError = data.description || '';
      if (data.description?.includes('Unauthorized')) {
        friendlyError = 'رمز الـ Bot Token غير صحيح أو منتهي. تأكد من نسخه كاملاً من @BotFather.';
      } else if (data.description?.includes('chat not found')) {
        friendlyError = `لم يتم العثور على القناة (${chatId}). تأكد من كتابة اسمها صحيحاً وجعلها عامة، أو إرسال رسالة للبوت أولاً.`;
      } else if (data.description?.includes('have no rights') || data.description?.includes('bot is not a member')) {
        friendlyError = `البوت ليس مشرفاً (Admin) في القناة (${chatId}). يرجى إضافة البوت كـ Admin مع صلاحية نشر الرسائل.`;
      }

      return {
        success: false,
        message: `خطأ في إرسال تيليجرام: ${friendlyError}`,
        telegramError: data.description,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'تعذر الاتصال بخوادم تيليجرام: ' + (err.message || 'تحقق من اتصال الإنترنت'),
      telegramError: err.message,
    };
  }
}
