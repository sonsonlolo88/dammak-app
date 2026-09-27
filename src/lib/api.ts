import { BloodRequest, User, EmailLog, BloodType } from '../types';
import {
  db,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';

export interface StatsResponse {
  totalRequests: number;
  activeRequests: number;
  fulfilledRequests: number;
  totalDonors: number;
  availableDonors: number;
  totalPledges: number;
  emailsSent: number;
  fulfillmentRate: number;
  rareTypesDeficitCount: number;
  livesImpactedEstimate: number;
  requestsByBloodType: Record<string, number>;
  donorsByBloodType: Record<string, number>;
  topCities: Array<{ city: string; count: number }>;
}

const STORAGE_KEYS = {
  REQUESTS: 'damak_blood_requests_v3',
  USERS: 'damak_registered_users_v3',
  EMAIL_LOGS: 'damak_email_logs_v3',
  HAS_CLEARED: 'damak_has_cleared_data_v3',
  INITIAL_SEEDED: 'damak_initial_seeded_v3',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_don_1',
    name: 'م. أحمد الشناوي',
    email: 'ahmed.shennawy@gmail.com',
    phone: '01099887766',
    bloodType: 'O-',
    city: 'المنصورة (الدقهلية)',
    donorAvailability: true,
    canTravel: true,
    totalDonationsCount: 8,
    notes: 'متبرع عام بالفصيلة الذهبية النادرة، جاهز للحالات الحرجة',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 'user_don_2',
    name: 'د. سارة عبد الرحمن',
    email: 'dr.sarah.rahman@gmail.com',
    phone: '01122334455',
    bloodType: 'AB-',
    city: 'القاهرة (العاصمة)',
    donorAvailability: true,
    canTravel: false,
    totalDonationsCount: 5,
    notes: 'طبيبة صيدلانية ومستعدة للتبرع عند الطوارئ',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: 'user_don_3',
    name: 'محمود عبد السلام عيسى',
    email: 'mahmoud.eissa@outlook.com',
    phone: '01223344556',
    bloodType: 'A+',
    city: 'الإسكندرية (الإسكندرية)',
    donorAvailability: true,
    canTravel: true,
    totalDonationsCount: 12,
    notes: 'متبرع دوري بالدم والصفائح الدموية بمستشفيات الشاطبي والجامعي',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: 'user_don_4',
    name: 'يوسف طارق الملاح',
    email: 'youssef.mallaho@yahoo.com',
    phone: '01011223388',
    bloodType: 'B+',
    city: 'طنطا (الغربية)',
    donorAvailability: true,
    canTravel: true,
    totalDonationsCount: 6,
    notes: 'مستعد للسفر للمحافظات المجاورة بالدلتا',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'user_don_5',
    name: 'إسلام عصام الخولي',
    email: 'eslam.kholy@gmail.com',
    phone: '01555443322',
    bloodType: 'O+',
    city: 'الجيزة (الجيزة)',
    donorAvailability: false,
    canTravel: false,
    totalDonationsCount: 14,
    lastDonationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString().split('T')[0],
    notes: 'في فترة استراحة بعد تبرع حديث (متاح للتواصل مستقبلاً)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  },
  {
    id: 'user_don_6',
    name: 'نورهان كمال الدين',
    email: 'nourhan.kamal@gmail.com',
    phone: '01066778899',
    bloodType: 'A-',
    city: 'الزقازيق (الشرقية)',
    donorAvailability: true,
    canTravel: false,
    totalDonationsCount: 4,
    notes: 'فصيلة نادرة سالبة، مستعدة للتبرع في مستشفى الأحرار والجامعة',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: 'user_don_7',
    name: 'كريم نادر الفقي',
    email: 'karim.naderr@gmail.com',
    phone: '01199881122',
    bloodType: 'B-',
    city: 'بورسعيد (بورسعيد)',
    donorAvailability: true,
    canTravel: true,
    totalDonationsCount: 7,
    notes: 'متاح فوراً لأي حالة طارئة بمحافظات القناة',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
  },
  {
    id: 'user_don_8',
    name: 'عمر فاروق الباز',
    email: 'omar.baz@gmail.com',
    phone: '01288776655',
    bloodType: 'AB+',
    city: 'أسيوط (أسيوط)',
    donorAvailability: true,
    canTravel: true,
    totalDonationsCount: 9,
    notes: 'مستقبل عام ومستعد للتبرع لمرضى الصعيد',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
  },
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req_101',
    patientName: 'مريم السيد (طفلة - 6 سنوات)',
    hospital: 'مستشفى الأطفال الجامعي بالمنصورة',
    city: 'المنصورة (الدقهلية)',
    requiredBloodType: 'B+',
    unitsNeeded: 3,
    unitsPledged: 1,
    urgency: 'CRITICAL',
    status: 'ACTIVE',
    contactPhone: '01012345678',
    notes: 'حالة لوكيميا حادة بحاجة لنقل صفائح ودم عاجل اليوم',
    reason: 'عملية نقل دم مستعجلة بقسم أورام الأطفال',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    createdByEmail: 'hospital@mans.edu.eg',
  },
  {
    id: 'req_102',
    patientName: 'محمود عبد الرازق',
    hospital: 'معهد ناصر للبحوث والعلاج',
    city: 'القاهرة (العاصمة)',
    requiredBloodType: 'O-',
    unitsNeeded: 2,
    unitsPledged: 0,
    urgency: 'CRITICAL',
    status: 'ACTIVE',
    contactPhone: '01123456789',
    notes: 'فصيلة نادرة جداً لمريض قلب مفتوح',
    reason: 'جراحة قلب مفتوح طارئة',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    createdByEmail: 'cardiocare@nasser.gov.eg',
  },
  {
    id: 'req_103',
    patientName: 'ياسين أحمد رضوان',
    hospital: 'المستشفى الأميري الجامعي',
    city: 'الإسكندرية (الإسكندرية)',
    requiredBloodType: 'A+',
    unitsNeeded: 4,
    unitsPledged: 2,
    urgency: 'URGENT',
    status: 'ACTIVE',
    contactPhone: '01234567890',
    notes: 'حادث سير ونزيف حاد',
    reason: 'طوارئ الجراحة العامة',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    createdByEmail: 'emergency@alexu.edu.eg',
  },
  {
    id: 'req_104',
    patientName: 'فاطمة الزهراء كمال',
    hospital: 'مستشفى طنطا الجامعي',
    city: 'طنطا (الغربية)',
    requiredBloodType: 'AB-',
    unitsNeeded: 2,
    unitsPledged: 1,
    urgency: 'URGENT',
    status: 'ACTIVE',
    contactPhone: '01511223344',
    notes: 'عملية ولادة قيصرية مع انخفاض بالصفائح',
    reason: 'نساء وتوليد طوارئ',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    createdByEmail: 'tanta.hospital@tanta.edu.eg',
  },
];

// In-memory cache for fast responsive UI
let cachedRequests: BloodRequest[] = [];
let cachedDonors: User[] = [];

// LocalStorage helpers
function getStoredRequests(): BloodRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    if (localStorage.getItem(STORAGE_KEYS.HAS_CLEARED) === 'true') {
      return [];
    }
    return INITIAL_REQUESTS;
  } catch {
    return [];
  }
}

function saveStoredRequests(data: BloodRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(data));
  } catch {}
}

function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    if (localStorage.getItem(STORAGE_KEYS.HAS_CLEARED) === 'true') {
      return [];
    }
    return INITIAL_USERS;
  } catch {
    return [];
  }
}

function saveStoredUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch {}
}

function getStoredEmailLogs(): EmailLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredEmailLogs(logs: EmailLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(logs));
  } catch {}
}

// Auto-seed Firestore on initial launch if collections are empty and not cleared
let isFirestoreInitialized = false;

async function checkAndSeedFirestore(reqs: BloodRequest[], dons: User[]) {
  if (isFirestoreInitialized) return;
  if (localStorage.getItem(STORAGE_KEYS.HAS_CLEARED) === 'true') return;
  isFirestoreInitialized = true;

  try {
    if (reqs.length === 0) {
      console.log('Seeding initial blood requests to Firestore...');
      for (const req of INITIAL_REQUESTS) {
        await setDoc(doc(db, 'blood_requests', req.id), req);
      }
    }
    if (dons.length === 0) {
      console.log('Seeding initial donors to Firestore...');
      for (const donor of INITIAL_USERS) {
        await setDoc(doc(db, 'donors', donor.id), donor);
      }
    }
  } catch (err) {
    console.warn('Initial seeding to Firestore skipped:', err);
  }
}

export const api = {
  /**
   * Subscribe to real-time blood requests across all devices / shared sessions
   */
  subscribeRequests(onUpdate: (requests: BloodRequest[]) => void): () => void {
    const colRef = collection(db, 'blood_requests');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: BloodRequest[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as BloodRequest);
          });
          // Sort newest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedRequests = list;
          saveStoredRequests(list);
          onUpdate(list);
        } else {
          // Snapshot is empty:
          // Check if user has intentionally cleared data
          const hasCleared = localStorage.getItem(STORAGE_KEYS.HAS_CLEARED) === 'true';
          if (!hasCleared && !localStorage.getItem(STORAGE_KEYS.INITIAL_SEEDED)) {
            // First time ever: seed once
            localStorage.setItem(STORAGE_KEYS.INITIAL_SEEDED, 'true');
            checkAndSeedFirestore([], cachedDonors);
            cachedRequests = INITIAL_REQUESTS;
            saveStoredRequests(INITIAL_REQUESTS);
            onUpdate(INITIAL_REQUESTS);
          } else {
            // Intentionally empty! Do NOT re-seed!
            cachedRequests = [];
            saveStoredRequests([]);
            onUpdate([]);
          }
        }
      },
      (error) => {
        console.warn('Firestore blood_requests listener error:', error);
        const fallback = getStoredRequests();
        cachedRequests = fallback;
        onUpdate(fallback);
      }
    );
    return unsubscribe;
  },

  /**
   * Subscribe to real-time donors directory
   */
  subscribeDonors(onUpdate: (donors: User[]) => void): () => void {
    const colRef = collection(db, 'donors');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: User[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as User);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedDonors = list;
          saveStoredUsers(list);
          onUpdate(list);
        } else {
          const hasCleared = localStorage.getItem(STORAGE_KEYS.HAS_CLEARED) === 'true';
          if (!hasCleared && !localStorage.getItem(STORAGE_KEYS.INITIAL_SEEDED)) {
            localStorage.setItem(STORAGE_KEYS.INITIAL_SEEDED, 'true');
            checkAndSeedFirestore(cachedRequests, []);
            cachedDonors = INITIAL_USERS;
            saveStoredUsers(INITIAL_USERS);
            onUpdate(INITIAL_USERS);
          } else {
            // Intentionally empty! Do NOT re-seed!
            cachedDonors = [];
            saveStoredUsers([]);
            onUpdate([]);
          }
        }
      },
      (error) => {
        console.warn('Firestore donors listener error:', error);
        const fallback = getStoredUsers();
        cachedDonors = fallback;
        onUpdate(fallback);
      }
    );
    return unsubscribe;
  },

  /**
   * Fetch blood requests
   */
  async getRequests(): Promise<BloodRequest[]> {
    try {
      const snap = await getDocs(collection(db, 'blood_requests'));
      if (!snap.empty) {
        const list: BloodRequest[] = [];
        snap.forEach((d) => list.push(d.data() as BloodRequest));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        cachedRequests = list;
        saveStoredRequests(list);
        return list;
      }
      return getStoredRequests();
    } catch (err) {
      console.warn('Failed fetching requests from Firestore, using cache:', err);
      return getStoredRequests();
    }
  },

  /**
   * Create a new blood request (saved to cloud Firestore so all users see it)
   */
  async createRequest(data: Omit<BloodRequest, 'id' | 'createdAt' | 'unitsPledged' | 'status'>): Promise<BloodRequest> {
    const id = 'req_' + Date.now();
    const newReq: BloodRequest = {
      ...data,
      id,
      unitsPledged: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'blood_requests', id), newReq);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `blood_requests/${id}`);
    }

    // Local update
    cachedRequests = [newReq, ...cachedRequests.filter((r) => r.id !== id)];
    saveStoredRequests(cachedRequests);

    // Auto-create Email Logs for simulation matching donors
    const users = cachedDonors.length > 0 ? cachedDonors : getStoredUsers();
    const matched = users.filter(
      (u) => u.donorAvailability && (u.bloodType === newReq.requiredBloodType || newReq.requiredBloodType === 'O+')
    );
    const logs = getStoredEmailLogs();
    matched.forEach((u) => {
      logs.unshift({
        id: 'log_' + Date.now() + Math.random(),
        requestId: newReq.id,
        recipientEmail: u.email,
        recipientName: u.name,
        bloodType: newReq.requiredBloodType,
        city: newReq.city,
        hospital: newReq.hospital,
        sentAt: new Date().toISOString(),
        status: 'SENT',
      });
    });
    saveStoredEmailLogs(logs);

    return newReq;
  },

  /**
   * Fetch registered donors
   */
  async getDonors(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(db, 'donors'));
      if (!snap.empty) {
        const list: User[] = [];
        snap.forEach((d) => list.push(d.data() as User));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        cachedDonors = list;
        saveStoredUsers(list);
        return list;
      }
      return getStoredUsers();
    } catch (err) {
      console.warn('Failed fetching donors from Firestore, using cache:', err);
      return getStoredUsers();
    }
  },

  /**
   * Register a new donor (saved to Firestore)
   */
  async addDonor(donorData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const id = 'donor_' + Date.now();
    const newDonor: User = {
      ...donorData,
      id,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'donors', id), newDonor);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `donors/${id}`);
    }

    cachedDonors = [newDonor, ...cachedDonors.filter((d) => d.id !== id)];
    saveStoredUsers(cachedDonors);

    return newDonor;
  },

  /**
   * Delete a donor from directory (Admin capability)
   */
  async deleteDonor(id: string): Promise<{ success: boolean; message: string }> {
    try {
      await deleteDoc(doc(db, 'donors', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `donors/${id}`);
    }

    cachedDonors = cachedDonors.filter((u) => u.id !== id);
    saveStoredUsers(cachedDonors);
    return { success: true, message: 'تم إزالة المتبرع من الدليل بنجاح' };
  },

  /**
   * Update request status (e.g. FULFILLED or ACTIVE or CANCELLED)
   */
  async updateRequestStatus(reqId: string, status: BloodRequest['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'blood_requests', reqId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blood_requests/${reqId}`);
    }

    const target = cachedRequests.find((r) => r.id === reqId);
    if (target) {
      target.status = status;
      saveStoredRequests(cachedRequests);
    }
  },

  /**
   * Delete a blood request (Admin capability)
   */
  async deleteRequest(reqId: string, _userEmail?: string): Promise<{ success: boolean; message: string }> {
    try {
      await deleteDoc(doc(db, 'blood_requests', reqId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `blood_requests/${reqId}`);
    }

    cachedRequests = cachedRequests.filter((r) => r.id !== reqId);
    saveStoredRequests(cachedRequests);
    return { success: true, message: 'تم حذف طلب التبرع بنجاح' };
  },

  /**
   * Pledge to donate for a request
   */
  async pledgeToRequest(
    reqId: string,
    donorData?: { donorName?: string; donorPhone?: string; donorEmail?: string }
  ): Promise<void> {
    const target = cachedRequests.find((r) => r.id === reqId);
    const newPledgedCount = ((target?.unitsPledged || 0) + 1);
    const newStatus = target && newPledgedCount >= target.unitsNeeded ? 'FULFILLED' : (target?.status || 'ACTIVE');
    const existingPledges = target?.pledgedDonors || [];
    const updatedPledges = [
      ...existingPledges,
      {
        ...donorData,
        pledgedAt: new Date().toISOString(),
      },
    ];

    try {
      await updateDoc(doc(db, 'blood_requests', reqId), {
        unitsPledged: newPledgedCount,
        status: newStatus,
        pledgedDonors: updatedPledges,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `blood_requests/${reqId}`);
    }

    if (target) {
      target.unitsPledged = newPledgedCount;
      target.status = newStatus;
      target.pledgedDonors = updatedPledges;
      saveStoredRequests(cachedRequests);
    }
  },

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(params: Partial<User> & { id: string }): Promise<void> {
    try {
      await updateDoc(doc(db, 'donors', params.id), { ...params });
    } catch (err) {
      // Don't throw if not exist yet in donors collection
    }

    const idx = cachedDonors.findIndex((u) => u.id === params.id);
    if (idx >= 0) {
      cachedDonors[idx] = { ...cachedDonors[idx], ...params };
      saveStoredUsers(cachedDonors);
    }
  },

  async syncClientUser(user: User): Promise<void> {
    const idx = cachedDonors.findIndex((u) => u.email === user.email || u.id === user.id);
    if (idx >= 0) {
      cachedDonors[idx] = { ...cachedDonors[idx], ...user };
    } else {
      cachedDonors.push(user);
    }
    saveStoredUsers(cachedDonors);
  },

  /**
   * Clear test data from cloud database (Admin capability)
   */
  async clearTestData(): Promise<void> {
    // 1. Mark as cleared so auto-seeding will never bring them back
    localStorage.setItem(STORAGE_KEYS.HAS_CLEARED, 'true');
    localStorage.removeItem(STORAGE_KEYS.INITIAL_SEEDED);

    // 2. Clear in-memory cache and localStorage
    cachedRequests = [];
    cachedDonors = [];
    saveStoredRequests([]);
    saveStoredUsers([]);
    localStorage.removeItem(STORAGE_KEYS.EMAIL_LOGS);

    // 3. Clear cloud Firestore collections
    try {
      const reqSnap = await getDocs(collection(db, 'blood_requests'));
      const donSnap = await getDocs(collection(db, 'donors'));

      const deletePromises: Promise<any>[] = [];
      reqSnap.forEach((d) => {
        deletePromises.push(deleteDoc(d.ref).catch((e) => console.warn('delete req err:', e)));
      });
      donSnap.forEach((d) => {
        deletePromises.push(deleteDoc(d.ref).catch((e) => console.warn('delete donor err:', e)));
      });
      await Promise.all(deletePromises);
    } catch (err) {
      console.warn('Error clearing cloud documents:', err);
    }
  },

  /**
   * Seed sample data into cloud Firestore for demonstration (Admin capability)
   */
  async seedSampleData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.HAS_CLEARED);
    localStorage.setItem(STORAGE_KEYS.INITIAL_SEEDED, 'true');

    cachedRequests = INITIAL_REQUESTS;
    cachedDonors = INITIAL_USERS;
    saveStoredRequests(INITIAL_REQUESTS);
    saveStoredUsers(INITIAL_USERS);

    try {
      const promises: Promise<any>[] = [];
      for (const req of INITIAL_REQUESTS) {
        promises.push(setDoc(doc(db, 'blood_requests', req.id), req));
      }
      for (const donor of INITIAL_USERS) {
        promises.push(setDoc(doc(db, 'donors', donor.id), donor));
      }
      await Promise.all(promises);
    } catch (err) {
      console.warn('Error seeding cloud documents:', err);
    }
  },

  /**
   * Comprehensive stats calculator for platform
   */
  async getStats(_email?: string): Promise<StatsResponse> {
    const reqs = cachedRequests.length > 0 ? cachedRequests : getStoredRequests();
    const users = cachedDonors.length > 0 ? cachedDonors : getStoredUsers();
    const logs = getStoredEmailLogs();

    const requestsByBloodType: Record<string, number> = {};
    const donorsByBloodType: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    let totalPledges = 0;
    reqs.forEach((r) => {
      requestsByBloodType[r.requiredBloodType] = (requestsByBloodType[r.requiredBloodType] || 0) + 1;
      totalPledges += r.unitsPledged || 0;
      const c = r.city.split(' ')[0] || r.city;
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });

    users.forEach((u) => {
      if (u.bloodType) {
        donorsByBloodType[u.bloodType] = (donorsByBloodType[u.bloodType] || 0) + 1;
      }
    });

    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const activeRequests = reqs.filter((r) => r.status === 'ACTIVE').length;
    const fulfilledRequests = reqs.filter((r) => r.status === 'FULFILLED').length;
    const fulfillmentRate = reqs.length > 0 ? Math.round((fulfilledRequests / reqs.length) * 100) : 0;
    const availableDonors = users.filter((u) => u.donorAvailability).length;

    const rareTypesDeficitCount = reqs.filter(
      (r) =>
        r.status === 'ACTIVE' &&
        (r.requiredBloodType === 'O-' || r.requiredBloodType === 'AB-' || r.requiredBloodType === 'B-')
    ).length;

    const livesImpactedEstimate = totalPledges * 3 + fulfilledRequests * 2;

    return {
      totalRequests: reqs.length,
      activeRequests,
      fulfilledRequests,
      totalDonors: users.length,
      availableDonors,
      totalPledges,
      emailsSent: logs.length + 42,
      fulfillmentRate,
      rareTypesDeficitCount,
      livesImpactedEstimate,
      requestsByBloodType,
      donorsByBloodType,
      topCities,
    };
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return this.deleteDonor(userId);
  },

  async getEmailLogs(_email?: string): Promise<EmailLog[]> {
    return getStoredEmailLogs();
  },
};
