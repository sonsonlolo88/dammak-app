import React, { useState, useEffect, useMemo } from 'react';
import {
  BloodRequest,
  User,
  BloodType,
  UrgencyLevel,
  CITIES_LIST,
  BLOOD_COMPATIBILITY_DONORS,
  BLOOD_CAN_DONATE_TO,
  RequestStatus,
  isSameCityOrGovernorate,
  isUserOwner,
} from './types';
import { api, StatsResponse } from './lib/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TelegramUrgentBanner } from './components/TelegramUrgentBanner';
import { HomeActionCards } from './components/HomeActionCards';
import { DonationConditionsModal } from './components/DonationConditionsModal';
import { LastDonationModal } from './components/LastDonationModal';
import { RequestCard } from './components/RequestCard';
import { CreateRequestModal } from './components/CreateRequestModal';
import { RequestDetailsModal } from './components/RequestDetailsModal';
import { RequestCreatedBroadcastModal } from './components/RequestCreatedBroadcastModal';
import { CompatibilityWidget } from './components/CompatibilityWidget';
import { BloodBanksDirectory } from './components/BloodBanksDirectory';
import { DonorsDirectory } from './components/DonorsDirectory';
import { MyRequests } from './components/MyRequests';
import { StatisticsHub } from './components/StatisticsHub';
import { DonationCountdownTracker } from './components/DonationCountdownTracker';
import { DonorHonorCardModal } from './components/DonorHonorCardModal';
import { HomeQuickStats } from './components/HomeQuickStats';
import { Logo } from './components/Logo';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Droplet,
  ShieldCheck,
  ShieldAlert,
  MailCheck,
  Send,
  Sparkles,
  Phone,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  X,
  Lock,
  Shield,
} from 'lucide-react';
import { TelegramSettingsModal } from './components/TelegramSettingsModal';

const ALL_BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function App() {
  // Current User Session (Default is null for general visitor view; no auto-admin access)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('damak_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  const isOwner = isUserOwner(currentUser);

  // Main UI Navigation Tab
  const [currentTab, setCurrentTab] = useState<'REQUESTS' | 'DONORS' | 'BLOOD_BANKS' | 'STATS' | 'MY_REQUESTS'>('REQUESTS');

  // Requests, Stats and Donors Data
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [donors, setDonors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterTab, setFilterTab] = useState<'ALL' | 'COMPATIBLE' | 'CRITICAL' | 'MY_CITY' | 'DONOR_MATCH'>('ALL');
  const [donorMatchFilter, setDonorMatchFilter] = useState<{ bloodType: BloodType; city: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | ''>('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | ''>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [broadcastModalRequest, setBroadcastModalRequest] = useState<BloodRequest | null>(null);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isLastDonationModalOpen, setIsLastDonationModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isHonorCardModalOpen, setIsHonorCardModalOpen] = useState(false);
  const [isTelegramSettingsOpen, setIsTelegramSettingsOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [showCompatibilityWidget, setShowCompatibilityWidget] = useState(false);
  const [authToast, setAuthToast] = useState<string | null>(null);

  // Save user session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('damak_user', JSON.stringify(currentUser));
      // Sync client user with backend datastore so donor notifications always find them
      api.syncClientUser(currentUser).catch(() => {});
    } else {
      localStorage.removeItem('damak_user');
    }
  }, [currentUser]);

  // Update last donation date
  const handleUpdateLastDonationDate = async (newDate: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, lastDonationDate: newDate };
    setCurrentUser(updated);
    try {
      await api.updateUserProfile({
        id: currentUser.id,
        lastDonationDate: newDate,
      });
      setAuthToast(`تم تحديث آخر تاريخ تبرع: ${newDate}`);
      setTimeout(() => setAuthToast(null), 4000);
    } catch (err) {
      console.error('Error updating last donation date:', err);
    }
  };

  // Clear test data
  const handleClearTestData = async () => {
    try {
      await api.clearTestData();
      setRequests([]);
      setDonors([]);
      const newStats = await api.getStats();
      setStats(newStats);
      setAuthToast('تم مسح جميع البيانات والطلبات الافتراضية بنجاح ✓');
      setTimeout(() => setAuthToast(null), 4000);
    } catch (err) {
      console.error('Error clearing test data:', err);
    }
  };

  // Seed sample data for testing and demonstrations
  const handleSeedSampleData = async () => {
    try {
      await api.seedSampleData();
      await loadData();
      setAuthToast('تمت إضافة حالات تجريبية واقعية بمستشفيات مختلفة لمعاينة الإحصائيات والفلاتر بنجاح');
      setTimeout(() => setAuthToast(null), 4000);
    } catch (err) {
      console.error('Error seeding sample data:', err);
    }
  };

  // Real-time Data Synchronization with Firebase Cloud Firestore
  useEffect(() => {
    setLoading(true);

    // Subscribe to live requests (works across Netlify, shared links, and all devices)
    const unsubscribeRequests = api.subscribeRequests((updatedRequests) => {
      setRequests(updatedRequests);
      setLoading(false);
      // Auto-update stats
      api.getStats().then((st) => setStats(st)).catch(() => {});
    });

    // Subscribe to live donors directory
    const unsubscribeDonors = api.subscribeDonors((updatedDonors) => {
      setDonors(updatedDonors);
      // Auto-update stats
      api.getStats().then((st) => setStats(st)).catch(() => {});
    });

    return () => {
      unsubscribeRequests();
      unsubscribeDonors();
    };
  }, []);

  // Data Fetching fallback and URL query handler
  const loadData = async () => {
    try {
      const [reqData, statsData, donorsData] = await Promise.all([
        api.getRequests(),
        api.getStats(currentUser?.email).catch(() => null),
        api.getDonors().catch(() => []),
      ]);
      setRequests(reqData);
      setStats(statsData);
      setDonors(donorsData);

      // Check URL parameters (e.g. ?request=req_101)
      const urlParams = new URLSearchParams(window.location.search);
      const reqParam = urlParams.get('request');
      if (reqParam) {
        const found = reqData.find((r) => r.id === reqParam);
        if (found) {
          setSelectedRequest(found);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Donors Directory
  const handleAddDonor = async (donorData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const created = await api.addDonor(donorData);
      setDonors((prev) => [created, ...prev]);
      await loadData();
      setAuthToast('تم تسجيلك كمتبرع بنجاح، جزاك الله خيراً');
      setTimeout(() => setAuthToast(null), 4000);
    } catch (err) {
      console.error('Error adding donor:', err);
    }
  };

  const handleDeleteDonor = async (donorId: string) => {
    try {
      await api.deleteDonor(donorId);
      setDonors((prev) => prev.filter((d) => d.id !== donorId));
      await loadData();
      setAuthToast('تم حذف المتبرع من القائمة بنجاح');
      setTimeout(() => setAuthToast(null), 4000);
    } catch (err) {
      console.error('Error deleting donor:', err);
    }
  };

  // Filter and Search Logic
  const filteredRequests = useMemo(() => {
    const filtered = requests.filter((r) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchHospital = r.hospital.toLowerCase().includes(q);
        const matchCity = r.city.toLowerCase().includes(q);
        const matchPatient = r.patientName.toLowerCase().includes(q);
        const matchType = r.requiredBloodType.toLowerCase().includes(q);
        if (!matchHospital && !matchCity && !matchPatient && !matchType) return false;
      }

      // 2. Tab Filter
      if (filterTab === 'DONOR_MATCH') {
        const targetBloodType = donorMatchFilter?.bloodType || currentUser?.bloodType || 'B+';
        // Strictly match the donor's blood type
        if (r.requiredBloodType !== targetBloodType) return false;
      }

      if (filterTab === 'COMPATIBLE' && currentUser) {
        // Can this donor donate to the requiredBloodType?
        const allowedRecipients = BLOOD_CAN_DONATE_TO[currentUser.bloodType] || [];
        if (!allowedRecipients.includes(r.requiredBloodType)) return false;
      }

      if (filterTab === 'CRITICAL') {
        if (r.urgency !== 'CRITICAL') return false;
      }

      if (filterTab === 'MY_CITY' && currentUser) {
        const cityCore = currentUser.city.split(' ')[0];
        if (!r.city.includes(cityCore)) return false;
      }

      // 3. Dropdown Filters
      if (selectedBloodType && r.requiredBloodType !== selectedBloodType) {
        return false;
      }

      if (selectedCity && !r.city.includes(selectedCity.split(' ')[0])) {
        return false;
      }

      if (selectedUrgency && r.urgency !== selectedUrgency) {
        return false;
      }

      return true;
    });

    // If viewing DONOR_MATCH, prioritize cases in the user's city at the top
    if (filterTab === 'DONOR_MATCH') {
      const targetCity = donorMatchFilter?.city || currentUser?.city || 'المنصورة (الدقهلية)';
      return [...filtered].sort((a, b) => {
        const aSame = isSameCityOrGovernorate(a.city, targetCity) ? 1 : 0;
        const bSame = isSameCityOrGovernorate(b.city, targetCity) ? 1 : 0;
        return bSame - aSame;
      });
    }

    return filtered;
  }, [requests, searchQuery, filterTab, donorMatchFilter, currentUser, selectedBloodType, selectedCity, selectedUrgency]);

  // Handler after creating new request
  const handleRequestCreated = async (newReq: BloodRequest) => {
    await loadData();
    // Open the automated broadcast & matching donor messaging modal
    setBroadcastModalRequest(newReq);
    setSelectedRequest(newReq);
    setAuthToast(`تم تسجيل نداء الدم بنجاح وبدء إشعار متبرعي فصيلة ${newReq.requiredBloodType}`);
  };

  // Handler after donor pledge
  const handlePledgeAction = async (
    reqId: string,
    donorData?: { donorName?: string; donorPhone?: string; donorEmail?: string }
  ) => {
    try {
      await api.pledgeToRequest(reqId, donorData);
      await loadData();
      const updated = requests.find((r) => r.id === reqId);
      if (updated) setSelectedRequest(updated);
    } catch (err: any) {
      console.error('Error pledging to request:', err);
    }
  };

  const handlePledgeSuccess = async (reqId: string) => {
    await loadData();
    // Update active modal request if open
    const updated = requests.find((r) => r.id === reqId);
    if (updated) setSelectedRequest(updated);
  };

  // Handler after status change
  const handleStatusChange = async (reqId: string, newStatus: RequestStatus) => {
    await loadData();
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  // Handler for Deleting a Blood Request (Admin or Creator)
  const handleDeleteRequest = async (reqId: string) => {
    try {
      const res = await api.deleteRequest(reqId, currentUser?.email);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      if (selectedRequest && selectedRequest.id === reqId) {
        setSelectedRequest(null);
      }
      setAuthToast(res.message || 'تم حذف طلب التبرع بنجاح ✓');
      setTimeout(() => setAuthToast(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'فشل حذف طلب التبرع');
    }
  };

  const handleOpenWantToDonate = () => {
    setIsLastDonationModalOpen(true);
    setAuthToast('تنبيه هام: التبرع بالدم عمل إنساني تطوعي مجاني 100%، والتطبيق مجاني بالكامل ولا يتطلب أي رسوم وهو غير هادف للربح إطلاقاً، والمنصة غير مسؤولة عن أي إساءة استخدام.');
    setTimeout(() => setAuthToast(null), 7000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-['Cairo',sans-serif] text-stone-900 selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateRequest={() => setIsCreateModalOpen(true)}
        onOpenConditions={() => setIsConditionsModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onOpenTelegramSettings={() => setIsTelegramSettingsOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        currentUser={currentUser}
        activeRequestsCount={requests.filter((r) => r.status === 'ACTIVE').length}
        totalDonorsCount={donors.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Urgent Donor Alert Ribbon if compatible cases exist */}
        {currentUser && currentUser.donorAvailability && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-red-700/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-sm block">
                  مرحباً بك {currentUser.name} (فصيلتك: {currentUser.bloodType})
                </span>
                <span className="text-red-100">
                  أنت متاح للتبرع بالدم. سنرسل لك بريداً إلكترونياً عند وجود أي حالة متوافقة طبياً في منطقتك.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setFilterTab('COMPATIBLE');
                  setCurrentTab('REQUESTS');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition-colors shrink-0 shadow-xs"
              >
                عرض الحالات المتوافقة معي
              </button>
            </div>
          </div>
        )}

        {/* 3 Main Action Cards & Quick Stats (Visible on Home / Requests tab) */}
        {currentTab === 'REQUESTS' && (
          <div className="mb-8 space-y-6">
            {/* Telegram Urgent Network Alert Banner from image */}
            <TelegramUrgentBanner channelUrl="https://t.me/dammak_alerts" />

            <HomeActionCards
              onOpenNeedDonor={() => setIsCreateModalOpen(true)}
              onOpenWantToDonate={handleOpenWantToDonate}
              onOpenBloodBanks={() => setCurrentTab('BLOOD_BANKS')}
              onOpenConditions={() => setIsConditionsModalOpen(true)}
              onOpenDonorsList={() => setCurrentTab('DONORS')}
              onOpenStats={() => setCurrentTab('STATS')}
              activeRequestsCount={requests.filter((r) => r.status === 'ACTIVE').length}
              currentUserBloodType={currentUser?.bloodType}
            />

            {/* Pulse of Platform & Community Impact Banner from image */}
            <HomeQuickStats
              stats={stats}
              onOpenStatsTab={() => setCurrentTab('STATS')}
              onOpenCalculator={() => setIsCalculatorModalOpen(true)}
              onOpenConditions={() => setIsConditionsModalOpen(true)}
            />
          </div>
        )}

        {/* Interactive Compatibility Guide Widget (Toggleable) */}
        {showCompatibilityWidget && (
          <div className="animate-fadeIn mb-8">
            <CompatibilityWidget />
          </div>
        )}

        {/* Views Orchestration */}
        {/* Screen 2: قائمة المتبرعين */}
        {currentTab === 'DONORS' && (
          <DonorsDirectory
            donors={donors}
            onAddDonor={handleAddDonor}
            onDeleteDonor={handleDeleteDonor}
            currentUser={currentUser}
          />
        )}

        {/* Screen 3: بنوك الدم */}
        {currentTab === 'BLOOD_BANKS' && <BloodBanksDirectory />}

        {/* Screen 4: إحصائيات سريعة */}
        {currentTab === 'STATS' && (
          <StatisticsHub
            stats={stats}
            onSelectBloodTypeFilter={(bt) => {
              setSelectedBloodType(bt);
              setFilterTab('ALL');
              setCurrentTab('REQUESTS');
            }}
            onSelectCityFilter={(city) => {
              setSelectedCity(city);
              setFilterTab('ALL');
              setCurrentTab('REQUESTS');
            }}
            onOpenCreateRequest={() => setIsCreateModalOpen(true)}
            onOpenWantToDonate={handleOpenWantToDonate}
            onOpenConditions={() => setIsConditionsModalOpen(true)}
            onRefreshStats={loadData}
            onSeedSampleData={handleSeedSampleData}
            onClearTestData={handleClearTestData}
            onDeleteRequest={handleDeleteRequest}
            onDeleteDonor={handleDeleteDonor}
            isOwner={isOwner}
          />
        )}

        {/* Optional: طلباتي */}
        {currentTab === 'MY_REQUESTS' && (
          <MyRequests
            currentUser={currentUser}
            onOpenCreateRequest={() => setIsCreateModalOpen(true)}
            onSelectRequest={setSelectedRequest}
            onDeleteRequest={handleDeleteRequest}
          />
        )}

        {currentTab === 'REQUESTS' && (
          <div className="space-y-6">
            {/* Feed Filter & Search Controls */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              {/* Quick Tab Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setFilterTab('ALL')}
                    className={`px-3.5 py-2 rounded-xl transition-colors ${
                      filterTab === 'ALL'
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    جميع الطلبات ({requests.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const bType = donorMatchFilter?.bloodType || currentUser?.bloodType || 'B+';
                      const uCity = donorMatchFilter?.city || currentUser?.city || 'المنصورة (الدقهلية)';
                      setDonorMatchFilter({ bloodType: bType, city: uCity });
                      setFilterTab('DONOR_MATCH');
                    }}
                    className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                      filterTab === 'DONOR_MATCH'
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/20 font-bold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium'
                    }`}
                  >
                    <Droplet className={`w-3.5 h-3.5 ${filterTab === 'DONOR_MATCH' ? 'fill-white text-white' : 'fill-red-600 text-red-600'}`} />
                    <span>مطابقة لفصيلتي ({donorMatchFilter?.bloodType || currentUser?.bloodType || 'B+'})</span>
                  </button>

                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setFilterTab('COMPATIBLE')}
                      className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                        filterTab === 'COMPATIBLE'
                          ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>متوافقة مع فصيلتي ({currentUser.bloodType})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setFilterTab('CRITICAL')}
                    className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                      filterTab === 'CRITICAL'
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>حالات حرجة جداً</span>
                  </button>

                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setFilterTab('MY_CITY')}
                      className={`px-3.5 py-2 rounded-xl transition-colors ${
                        filterTab === 'MY_CITY'
                          ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      مدينتي ({currentUser.city.split(' ')[0]})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleClearTestData}
                    className="text-stone-500 hover:text-red-700 font-semibold flex items-center gap-1 py-1.5 px-2.5 rounded-xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                    title="مسح جميع البيانات والطلبات التجريبية"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-red-600" />
                    <span>مسح البيانات التجريبية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCompatibilityWidget(!showCompatibilityWidget)}
                    className="text-stone-600 hover:text-red-600 font-semibold flex items-center gap-1 py-1.5 px-2.5 rounded-xl hover:bg-stone-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showCompatibilityWidget ? 'إخفاء دليل التوافق' : 'دليل التوافق'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={loadData}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                    title="تحديث البيانات"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Search Bar & Dropdown Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                {/* Search Text */}
                <div className="lg:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="ابحث باسم المستشفى، المدينة، أو فصيلة الدم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Filter Blood Type */}
                <div className="lg:col-span-2">
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value as BloodType | '')}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">جميع الفصائل</option>
                    {ALL_BLOOD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        فصيلة {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter City */}
                <div className="lg:col-span-3">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">جميع المحافظات والمدن</option>
                    {CITIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Urgency */}
                <div className="lg:col-span-2">
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value as UrgencyLevel | '')}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">كل درجات الاستعجال</option>
                    <option value="CRITICAL">🚨 عاجل جداً</option>
                    <option value="URGENT">⚠️ طارئ</option>
                    <option value="NORMAL">📅 عادي</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Match Banner when filtering by same blood type and city */}
            {filterTab === 'DONOR_MATCH' && donorMatchFilter && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-red-900 font-bold">
                  <Droplet className="w-4 h-4 text-red-600 fill-red-600 shrink-0" />
                  <span>
                    عرض الطلبات المطابقة لفصيلة ({donorMatchFilter.bloodType}) في ({donorMatchFilter.city}) فقط
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFilterTab('ALL');
                    setDonorMatchFilter(null);
                  }}
                  className="text-stone-500 hover:text-red-700 font-bold underline shrink-0 cursor-pointer"
                >
                  إلغاء التصفية وعرض الكل
                </button>
              </div>
            )}

            {/* Requests Grid */}
            {loading ? (
              <div className="p-16 text-center text-stone-400 text-xs space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto" />
                <p className="font-bold text-stone-700">جاري تحميل طلبات الدم...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 text-center rounded-3xl border border-stone-200 space-y-4">
                {filterTab === 'DONOR_MATCH' ? (
                  <div className="space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-200 shadow-xs">
                      <MailCheck className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-stone-900">
                        لا يوجد حالات محتاجة للتبرع الآن
                      </h3>
                      <div className="inline-block p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm font-black leading-relaxed shadow-xs max-w-lg">
                        سيتم إشعارك فوراً عبر واتساب وتيليجرام عند تسجيل أي احتياج لنفس الفصيلة ({donorMatchFilter?.bloodType || currentUser?.bloodType || 'O+'}) في ({donorMatchFilter?.city || currentUser?.city || 'المنصورة (الدقهلية)'})
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
                      شكراً لمبادرتك النبيلة ورغبتك في إنقاذ الأرواح. تم تسجيل رغبتك وجاهزيتك للتبرع، ونظام التنبيهات المباشر يقوم بمطابقة فصيلة الدم والموقع الجغرافي فور نشر أي نداء استغاثة جديد.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFilterTab('ALL');
                          setDonorMatchFilter(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        استعراض جميع الطلبات العامة
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                      >
                        تسجيل طلب دم الآن
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-red-600 flex items-center justify-center mx-auto border border-rose-100">
                      <Droplet className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900">
                      {requests.length === 0
                        ? 'لا توجد طلبات دم حالياً (تم مسح البيانات الافتراضية)'
                        : 'لا توجد طلبات دم مطابقة لمعايير البحث الحالية'}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                      {requests.length === 0
                        ? 'قاعدة البيانات نقية وجاهزة لاستقبال نداءات التبرع الحقيقية، وسيقوم النظام فوراً بإرسال إشعارات للمتبرعين المطابقين فقط في نفس المحافظة.'
                        : 'يمكنك إعادة ضبط معايير التصفية، أو تسجيل طلب تبرع جديد إن كان لديك مريض بحاجة للدم.'}
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      {requests.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterTab('ALL');
                            setSearchQuery('');
                            setSelectedBloodType('');
                            setSelectedCity('');
                            setSelectedUrgency('');
                          }}
                          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          إعادة ضبط الفلاتر
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                      >
                        تسجيل طلب دم الآن
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    currentUser={currentUser}
                    onSelect={setSelectedRequest}
                    onPledge={handlePledgeAction}
                    onDelete={handleDeleteRequest}
                    onOpenTelegramSettings={() => setIsTelegramSettingsOpen(true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals Container */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onSuccess={handleRequestCreated}
        onViewMatchingRequests={(bType) => {
          setIsCreateModalOpen(false);
          setCurrentTab('REQUESTS');
          setDonorMatchFilter({
            bloodType: bType,
            city: currentUser?.city || 'المنصورة (الدقهلية)',
          });
          setFilterTab('DONOR_MATCH');
        }}
      />

      <RequestDetailsModal
        request={selectedRequest}
        currentUser={currentUser}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
        onPledgeSuccess={handlePledgeSuccess}
        onDelete={handleDeleteRequest}
        onOpenTelegramSettings={() => setIsTelegramSettingsOpen(true)}
        onOpenMatchingBroadcast={(req) => setBroadcastModalRequest(req)}
      />

      {/* Broadcast and WhatsApp matching donors modal */}
      <RequestCreatedBroadcastModal
        isOpen={Boolean(broadcastModalRequest)}
        request={broadcastModalRequest}
        matchingDonors={donors.filter(
          (d) =>
            d.donorAvailability &&
            broadcastModalRequest &&
            (d.bloodType === broadcastModalRequest.requiredBloodType ||
              d.bloodType === 'O-' ||
              (broadcastModalRequest.requiredBloodType.endsWith('+') && d.bloodType === 'O+'))
        )}
        onClose={() => setBroadcastModalRequest(null)}
        onOpenTelegramSettings={() => setIsTelegramSettingsOpen(true)}
      />

      {/* Floating Auth Toast Notification */}
      {authToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl border flex items-start gap-3 animate-fadeIn text-right ${
            authToast.includes('تنبيه')
              ? 'bg-amber-950 text-amber-50 border-amber-500/50 shadow-amber-950/40'
              : 'bg-emerald-800 text-white border-emerald-700 shadow-emerald-950/30'
          }`}
          dir="rtl"
        >
          {authToast.includes('تنبيه') ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs font-bold leading-relaxed">{authToast}</div>
          <button
            type="button"
            onClick={() => setAuthToast(null)}
            className="p-1 text-white/70 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Blood Donation Conditions Modal */}
      <DonationConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
      />

      {/* Last Donation Tracker Modal */}
      <LastDonationModal
        isOpen={isLastDonationModalOpen}
        onClose={() => setIsLastDonationModalOpen(false)}
        currentUser={currentUser}
        requests={requests}
        onSelectRequest={(req) => {
          setSelectedRequest(req);
        }}
        onNext={(filterInfo) => {
          setIsLastDonationModalOpen(false);
          setCurrentTab('REQUESTS');
          setDonorMatchFilter(filterInfo);
          setFilterTab('DONOR_MATCH');
          setSearchQuery('');
          setSelectedBloodType('');
          setSelectedCity('');
          setSelectedUrgency('');
        }}
        onUpdateLastDonationDate={handleUpdateLastDonationDate}
        onDonorRegistered={async (user) => {
          setCurrentUser(user);
          try {
            await handleAddDonor({
              name: user.name,
              phone: user.phone,
              email: user.email,
              bloodType: user.bloodType,
              city: user.city,
              donorAvailability: true,
              canTravel: user.canTravel,
              lastDonationDate: user.lastDonationDate,
              notes: user.notes,
              totalDonationsCount: 1,
            });
          } catch (e) {
            console.error(e);
          }
          setAuthToast(`تم تسجيلك كمتبرع جاهز (${user.name} - فصيلة ${user.bloodType}) بنجاح! جزاك الله خيراً`);
        }}
      />

      {/* Donation Countdown & Eligibility Tracker Modal */}
      {isCalculatorModalOpen && (
        <DonationCountdownTracker
          isOpenAsModal
          currentUser={currentUser}
          onOpenWantToDonate={() => {
            setIsCalculatorModalOpen(false);
            handleOpenWantToDonate();
          }}
          onClose={() => setIsCalculatorModalOpen(false)}
        />
      )}

      {/* Donor Honor Card & Life Saver Badge Modal */}
      {isHonorCardModalOpen && (
        <DonorHonorCardModal
          currentUser={currentUser}
          onClose={() => setIsHonorCardModalOpen(false)}
        />
      )}

      {/* Telegram Direct Bot & Channel Settings Modal */}
      <TelegramSettingsModal
        isOpen={isTelegramSettingsOpen}
        onClose={() => setIsTelegramSettingsOpen(false)}
        onConfigSaved={() => {
          setAuthToast('تم تحديث وحفظ إعدادات تيليجرام بنجاح ✓');
          setTimeout(() => setAuthToast(null), 3500);
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(adminUser) => {
          setCurrentUser(adminUser);
          setAuthToast(`أهلاً بك يا ${adminUser.name}، تم تسجيل دخول المشرف بنجاح 🛡️`);
          setTimeout(() => setAuthToast(null), 4000);
        }}
      />

      {/* Admin Control Panel & Statistics Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={currentUser}
        requests={requests}
        donors={donors}
        stats={stats}
        onDeleteRequest={handleDeleteRequest}
        onDeleteDonor={handleDeleteDonor}
        onUpdateRequestStatus={async (id, status) => {
          await api.updateRequestStatus(id, status);
          await loadData();
        }}
        onClearTestData={handleClearTestData}
        onSeedSampleData={handleSeedSampleData}
        onLogoutAdmin={() => {
          setCurrentUser(null);
          localStorage.removeItem('damak_user');
          setIsAdminPanelOpen(false);
          setAuthToast('تم تسجيل الخروج من حساب المشرف');
          setTimeout(() => setAuthToast(null), 3000);
        }}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-stone-200 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <Logo size="md" />
              <p className="text-stone-500 leading-relaxed max-w-md text-xs">
                منصة رقمية وطنية غير ربحية تهدف لتسهيل وصول كل مريض محتاج للدم إلى أقرب متبرع متوافق طبياً،
                معتمدة على التنبيهات الفورية عبر واتساب وتيليجرام بدون إعلانات وبدون أي وسطاء.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  بدون إعلانات تماماً
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  تنبيهات فورية ومباشرة
                </span>
                <span>•</span>
                <span>بيانات المتبرعين محمية ومشفرة</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-stone-900 mb-3 text-xs">أرقام الطوارئ وبنوك الدم</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between">
                  <span>طوارئ وزارة الصحة:</span>
                  <strong className="font-mono text-red-600">137</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>خدمات نقل الدم القومية:</span>
                  <strong className="font-mono text-stone-800">15366</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>الإسعاف المصري:</span>
                  <strong className="font-mono text-red-600">123</strong>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-stone-900 mb-3 text-xs">روابط سريعة</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('REQUESTS');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    قائمة طلبات التبرع الحالية
                  </button>
                </li>
                {isOwner && (
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab('STATS');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-red-600 font-bold text-red-600 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>لوحة الإحصائيات والأثر الحي</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold border border-amber-200">
                        المالك
                      </span>
                    </button>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('BLOOD_BANKS');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    دليل بنوك الدم والمستشفيات
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCalculatorModalOpen(true)}
                    className="hover:text-amber-700 text-stone-700 cursor-pointer"
                  >
                    حاسبة ومحدد موعد التبرع القادم
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsHonorCardModalOpen(true)}
                    className="hover:text-purple-700 text-stone-700 cursor-pointer"
                  >
                    بطاقة وشارة بطل حياة (للمشاركة)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowCompatibilityWidget(true)}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    دليل التوافق الطبي بين الفصائل
                  </button>
                </li>
                <li>
                  <a
                    href="https://t.me/dammak_alerts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 text-sky-700 font-bold flex items-center gap-1.5"
                  >
                    <span>🔔 قناة التنبيهات العاجلة (تيليجرام)</span>
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTelegramSettingsOpen(true)}
                    className="hover:text-sky-600 text-stone-600 font-semibold cursor-pointer"
                  >
                    إعدادات شبكة نداء تيليجرام (Bot Token)
                  </button>
                </li>
                <li className="pt-2 border-t border-stone-100">
                  <div className="text-xs text-stone-500 font-semibold mb-1">البريد الإلكتروني للتواصل:</div>
                  <a
                    href="mailto:printparadise20102010@gmail.com?subject=استفسار%20-%20منصة%20دمك%20مفتاح%20حياة"
                    className="font-mono text-xs text-red-600 hover:text-red-700 font-bold underline"
                    title="إرسال بريد إلكتروني للتواصل ومتابعة الإشعارات"
                  >
                    printparadise20102010@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* تنبيه إنساني وقانوني وإخلاء مسؤولية - أسفل التطبيق */}
          <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50/90 via-rose-50/40 to-amber-50/90 border-2 border-amber-200/90 shadow-xs text-right" dir="rtl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-amber-200/80">
              <div className="flex items-center gap-2.5 text-amber-950 font-black text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-amber-800" />
                </div>
                <span>تنبيه وإخلاء مسؤولية قانوني وإنساني</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  التبرع مجاني 100%
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  تطبيق غير هادف للربح
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  بدون أي رسوم
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 bg-white/90 rounded-2xl border border-amber-100 shadow-2xs">
                <strong className="block font-bold text-red-700 mb-1">❤️ التبرع مجاني تماماً:</strong>
                التبرع بالدم عمل إنساني تطوعي مجاني خالص لوجه الله تعالى. يُحظر تماماً وبشكل قاطع بيع أو شراء الدم أو طلب أو دفع أي مبالغ مالية أو مقابل مادي تحت أي مسمى.
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-amber-100 shadow-2xs">
                <strong className="block font-bold text-emerald-800 mb-1">🎁 تطبيق مجاني وغير هادف للربح:</strong>
                تطبيق "دمك مفتاح حياة" مجاني بالكامل للجميع، لا يتطلب أي رسوم أو اشتراكات، وهو مشروع إنساني خيري غير هادف للربح إطلاقاً لخدمة المرضى والمحتاجين.
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-amber-100 shadow-2xs">
                <strong className="block font-bold text-amber-900 mb-1">⚖️ إخلاء مسؤولية قانوني:</strong>
                المنصة مجرد وسيط تقني لتسهيل التواصل التطوعي بين المتبرعين وأصحاب الحالات، والتطبيق وإدارته غير مسؤولين قانونياً أو مدنياً عن أي إساءة استخدام أو أي تعاملات واتفاقات تتم خارج المنصة.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
            <p>© 2026 دمك مفتاح حياة. منصة وطنية إنسانية للتبرع بالدم مطورة بالكامل لخدمة المرضى.</p>
            <p>التبرع بالدم صدقة جارية تنقذ حياة إنسان.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
