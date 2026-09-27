export type BloodType = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export type UrgencyLevel = 'critical' | 'urgent' | 'normal';

export interface UrgentRequest {
  id: string;
  patientName: string;
  caseCode?: string;
  bloodType: BloodType;
  unitsNeeded: number;
  unitsPledged: number;
  hospital: string;
  city: string;
  governorate?: string;
  urgency: UrgencyLevel;
  phone: string;
  contactPerson: string;
  reason?: string;
  notes?: string;
  createdAt: string; // ISO string
  deadlineHours?: number;
  status: 'active' | 'fulfilled' | 'closed';
}

export interface Donor {
  id: string;
  fullName: string;
  bloodType: BloodType;
  city: string;
  phone: string;
  lastDonationDate: string; // YYYY-MM-DD or empty
  isAvailable: boolean;
  canTravel: boolean;
  totalDonationsCount?: number;
  createdAt: string;
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours: string;
  is24Hours: boolean;
  mapsUrl: string;
  stockStatus: {
    'O+'?: 'available' | 'low' | 'critical';
    'O-'?: 'available' | 'low' | 'critical';
    'A+'?: 'available' | 'low' | 'critical';
    'A-'?: 'available' | 'low' | 'critical';
    'B+'?: 'available' | 'low' | 'critical';
    'B-'?: 'available' | 'low' | 'critical';
    'AB+'?: 'available' | 'low' | 'critical';
    'AB-'?: 'available' | 'low' | 'critical';
  };
  notes?: string;
}

export interface TelegramConfig {
  channelUrl: string;
  botToken: string;
  chatId: string;
  autoBroadcast: boolean;
}
