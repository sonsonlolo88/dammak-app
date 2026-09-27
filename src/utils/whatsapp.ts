import { Donor, UrgentRequest } from '../types/blood';

export function cleanPhoneNumber(phone: string): string {
  // Remove non-numeric characters like +, -, spaces
  return phone.replace(/[^0-9]/g, '');
}

export function formatUrgentRequestMessage(req: UrgentRequest): string {
  const urgencyLabel =
    req.urgency === 'critical'
      ? '🚨 نداء إنساني عاجل جداً (حالة حرجة)'
      : req.urgency === 'urgent'
      ? '⚠️ نداء تبرع عاجل بالدم'
      : '🩸 طلب تبرع بالدم';

  const unitsText = `${req.unitsNeeded} كيس / وحدة`;
  const timeRemaining = req.deadlineHours ? `خلال ${req.deadlineHours} ساعات القادمة` : 'في أسرع وقت ممكن';

  return `
${urgencyLabel}
منصة "دمك مفتاح حياة" 

👤 المريض: ${req.patientName}
🩸 فصيلة الدم المطلوبة: *[ ${req.bloodType} ]*
📦 الكمية المطلوبة: ${unitsText}
🏥 المستشفى: ${req.hospital} - ${req.city}
⏳ الوقت المستهدف: ${timeRemaining}
${req.reason ? `📋 الحالة: ${req.reason}\n` : ''}${req.notes ? `ℹ️ ملاحظات: ${req.notes}\n` : ''}
📞 للتواصل المباشر مع ذوي المريض:
${req.contactPerson ? `${req.contactPerson}: ` : ''}${req.phone}

قال تعالى: {وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا}
شارك النداء وكن سبباً في إنقاذ روح!
  `.trim();
}

export function createWhatsAppDirectUrl(phone: string, req?: UrgentRequest): string {
  const cleanPhone = cleanPhoneNumber(phone);
  let text = '';
  if (req) {
    text = `السلام عليكم ورحمة الله، بخصوص طلب التبرع بالدم للمريض/ة ${req.patientName} فصيلة (${req.bloodType}) في ${req.hospital}. أنا مستعد للمساعدة والتبرع بإذن الله.`;
  } else {
    text = 'السلام عليكم ورحمة الله، أتواصل معكم بخصوص التبرع بالدم عبر منصة "دمك مفتاح حياة".';
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function createWhatsAppShareUrl(req: UrgentRequest): string {
  const message = formatUrgentRequestMessage(req);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function createDonorWhatsAppUrl(donor: Donor, caseContext?: UrgentRequest): string {
  const cleanPhone = cleanPhoneNumber(donor.phone);
  let text = '';
  if (caseContext) {
    text = `السلام عليكم يا أخ ${donor.fullName}، نتوجه إليك كمتبرع مسجل بفصيلة (${donor.bloodType}) في منصة "دمك مفتاح حياة". توجد حالة حرجة للمريض ${caseContext.patientName} في ${caseContext.hospital} بمدينة ${caseContext.city} بحاجة ماسة لدم من نفس فصيلتك. هل أنت متاح للتبرع بارك الله فيك؟`;
  } else {
    text = `السلام عليكم يا أخ ${donor.fullName}، أتواصل معك عبر منصة "دمك مفتاح حياة" بخصوص استعدادك للتبرع بالدم بفصيلة (${donor.bloodType}). هل أنت متاح حالياً؟ جزاك الله خيراً.`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
