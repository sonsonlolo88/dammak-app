import { BloodBank, Donor, TelegramConfig, UrgentRequest } from '../types/blood';
import {
  INITIAL_BLOOD_BANKS,
  INITIAL_DONORS,
  INITIAL_TELEGRAM_CONFIG,
  INITIAL_URGENT_REQUESTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  URGENT_REQUESTS: 'dammak_urgent_requests_v1',
  DONORS: 'dammak_donors_v1',
  BLOOD_BANKS: 'dammak_blood_banks_v1',
  TELEGRAM_CONFIG: 'dammak_telegram_config_v1',
  USER_PLEDGES: 'dammak_user_pledges_v1',
};

export function getStoredUrgentRequests(): UrgentRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.URGENT_REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.URGENT_REQUESTS, JSON.stringify(INITIAL_URGENT_REQUESTS));
      return INITIAL_URGENT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading urgent requests from localStorage', e);
    return INITIAL_URGENT_REQUESTS;
  }
}

export function saveUrgentRequests(requests: UrgentRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.URGENT_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed saving urgent requests to localStorage', e);
  }
}

export function getStoredDonors(): Donor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
      return INITIAL_DONORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading donors from localStorage', e);
    return INITIAL_DONORS;
  }
}

export function saveDonors(donors: Donor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  } catch (e) {
    console.error('Failed saving donors to localStorage', e);
  }
}

export function getStoredBloodBanks(): BloodBank[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOOD_BANKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BLOOD_BANKS, JSON.stringify(INITIAL_BLOOD_BANKS));
      return INITIAL_BLOOD_BANKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading blood banks from localStorage', e);
    return INITIAL_BLOOD_BANKS;
  }
}

export function saveBloodBanks(banks: BloodBank[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOOD_BANKS, JSON.stringify(banks));
  } catch (e) {
    console.error('Failed saving blood banks to localStorage', e);
  }
}

export function getStoredTelegramConfig(): TelegramConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TELEGRAM_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(INITIAL_TELEGRAM_CONFIG));
      return INITIAL_TELEGRAM_CONFIG;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading telegram config from localStorage', e);
    return INITIAL_TELEGRAM_CONFIG;
  }
}

export function saveTelegramConfig(config: TelegramConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed saving telegram config to localStorage', e);
  }
}

export function getStoredUserPledges(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PLEDGES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveUserPledges(pledgeIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PLEDGES, JSON.stringify(pledgeIds));
  } catch (e) {
    console.error('Failed saving pledges', e);
  }
}
