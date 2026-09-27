export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'NORMAL';

export type RequestStatus = 'ACTIVE' | 'FULFILLED' | 'CANCELLED';

export interface BloodRequest {
  id: string;
  patientName: string;
  hospital: string;
  city: string;
  requiredBloodType: BloodType;
  unitsNeeded: number;
  unitsPledged: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  contactPhone: string;
  notes?: string;
  reason?: string;
  createdAt: string;
  createdByEmail?: string;
  pledgedDonors?: Array<{
    donorName?: string;
    donorPhone?: string;
    donorEmail?: string;
    pledgedAt?: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  city: string;
  donorAvailability: boolean;
  role?: string;
  isOwner?: boolean;
  lastDonationDate?: string;
  canTravel?: boolean;
  totalDonationsCount?: number;
  notes?: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  requestId: string;
  recipientEmail: string;
  recipientName: string;
  bloodType: string;
  city: string;
  hospital: string;
  sentAt: string;
  status: 'SENT' | 'FAILED';
}

export const CITIES_LIST: string[] = [
  'القاهرة (العاصمة)',
  'الجيزة (الجيزة)',
  'الإسكندرية (الإسكندرية)',
  'المنصورة (الدقهلية)',
  'طنطا (الغربية)',
  'الزقازيق (الشرقية)',
  'شبين الكوم (المنوفية)',
  'دمنهور (البحيرة)',
  'بنها (القليوبية)',
  'كفر الشيخ (كفر الشيخ)',
  'دمياط (دمياط)',
  'بورسعيد (بورسعيد)',
  'الإسماعيلية (الإسماعيلية)',
  'السويس (السويس)',
  'الفيوم (الفيوم)',
  'بني سويف (بني سويف)',
  'المنيا (المنيا)',
  'أسيوط (أسيوط)',
  'سوهاج (سوهاج)',
  'قنا (قنا)',
  'الأقصر (الأقصر)',
  'أسوان (أسوان)',
  'الغردقة (البحر الأحمر)',
  'شرم الشيخ (جنوب سيناء)',
];

export const BLOOD_COMPATIBILITY_DONORS: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

export const BLOOD_CAN_DONATE_TO: Record<BloodType, BloodType[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export function isSameCityOrGovernorate(c1: string, c2: string): boolean {
  if (!c1 || !c2) return false;
  const p1 = c1.toLowerCase().replace(/[^a-z\u0600-\u06FF]/g, '');
  const p2 = c2.toLowerCase().replace(/[^a-z\u0600-\u06FF]/g, '');
  return p1.includes(p2) || p2.includes(p1) || c1.split(' ')[0] === c2.split(' ')[0];
}

export function isUserOwner(user: User | null): boolean {
  if (!user) return false;
  if (user.isOwner || user.role === 'admin') return true;
  const adminEmails = [
    'sonsonlolo88@gmail.com',
    'admin@damak.life',
    'printparadise20102010@gmail.com'
  ];
  if (user.email && adminEmails.includes(user.email.toLowerCase())) return true;
  return false;
}
