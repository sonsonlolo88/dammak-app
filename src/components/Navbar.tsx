import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Bell,
  Home,
  Send,
  Clock,
  ClipboardCheck,
  BarChart2,
  Menu,
  X,
  PlusCircle,
  Building2,
  Users,
  Shield,
  Lock,
} from 'lucide-react';
import { User, isUserOwner } from '../types';

export type MainNavTab = 'REQUESTS' | 'DONORS' | 'BLOOD_BANKS' | 'STATS' | 'MY_REQUESTS';

interface NavbarProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenCreateRequest: () => void;
  onOpenConditions: () => void;
  onOpenCalculator: () => void;
  onOpenTelegramSettings: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  currentUser: User | null;
  activeRequestsCount?: number;
  totalDonorsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateRequest,
  onOpenConditions,
  onOpenCalculator,
  onOpenTelegramSettings,
  onOpenAdminLogin,
  onOpenAdminPanel,
  currentUser,
  activeRequestsCount,
  totalDonorsCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = isUserOwner(currentUser);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 select-none" dir="rtl">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-2">
          {/* 1. Right Section: Official App Logo */}
          <button
            onClick={() => onSelectTab('REQUESTS')}
            className="text-right cursor-pointer shrink-0"
          >
            <Logo size="md" />
          </button>

          {/* 2. Middle Section: Navigation Pills and Action Badges (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2">
            {/* طلبات الدم (Pill) */}
            <button
              type="button"
              onClick={() => onSelectTab('REQUESTS')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                currentTab === 'REQUESTS'
                  ? 'border-red-500 bg-red-50/80 text-red-600 shadow-2xs'
                  : 'border-stone-200 bg-white hover:border-red-300 text-stone-700'
              }`}
            >
              طلبات الدم
            </button>

            {/* بنوك ومراكز الدم */}
            <button
              type="button"
              onClick={() => onSelectTab('BLOOD_BANKS')}
              className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                currentTab === 'BLOOD_BANKS'
                  ? 'text-red-600'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              بنوك ومراكز الدم
            </button>

            {/* قائمة المتبرعين */}
            <button
              type="button"
              onClick={() => onSelectTab('DONORS')}
              className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                currentTab === 'DONORS'
                  ? 'text-red-600'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              قائمة المتبرعين
            </button>

            {/* الإحصائيات والأثر */}
            <button
              type="button"
              onClick={() => onSelectTab('STATS')}
              className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                currentTab === 'STATS'
                  ? 'text-red-600'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-stone-500" />
              <span>الإحصائيات والأثر</span>
            </button>

            {/* طلباتي */}
            <button
              type="button"
              onClick={() => onSelectTab('MY_REQUESTS')}
              className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                currentTab === 'MY_REQUESTS'
                  ? 'text-red-600'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              طلباتي
            </button>

            {/* انضم لقناة التنبيهات العاجلة (Bright Cyan-Blue Pill Button) */}
            <a
              href="https://t.me/dammak_alerts"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
              title="انضم لقناة التنبيهات العاجلة على تيليجرام"
            >
              <span className="text-sm">🔔</span>
              <span>انضم لقناة التنبيهات العاجلة</span>
            </a>

            {/* إعدادات البوت */}
            <button
              type="button"
              onClick={onOpenTelegramSettings}
              className="px-3 py-1.5 rounded-2xl border border-sky-300 bg-sky-50/70 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="إعدادات بوت وتنبيهات تيليجرام"
            >
              <Send className="w-3.5 h-3.5 text-sky-600 rotate-[-20deg]" />
              <span>إعدادات البوت</span>
            </button>

            {/* موعد التبرع */}
            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-3 py-1.5 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="حاسبة موعد التبرع الطبي القادم"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>موعد التبرع</span>
            </button>

            {/* شروط التبرع */}
            <button
              type="button"
              onClick={onOpenConditions}
              className="px-3 py-1.5 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="شروط التبرع الطبية والمعايير"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>شروط التبرع</span>
            </button>
          </div>

          {/* 3. Left Section: Action Button & Icon Controls & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Admin Badge or Login Button */}
            {isAdmin ? (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap border border-stone-700"
                title="فتح لوحة تحكم المشرف والإحصائيات"
              >
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">لوحة المشرف</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                title="تسجيل دخول المشرف (Admin)"
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden md:inline">دخول المشرف</span>
              </button>
            )}

            {/* Quick Action: طلب دم عاجل Button */}
            <button
              type="button"
              onClick={onOpenCreateRequest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>طلب دم عاجل</span>
            </button>

            {/* Red Bell Icon Button (Notifications) */}
            <a
              href="https://t.me/dammak_alerts"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200"
              title="تنبيهات الحالات العاجلة على تيليجرام"
            >
              <Bell className="w-4 h-4" />
            </a>

            {/* Red Home Icon Button */}
            <button
              type="button"
              onClick={() => onSelectTab('REQUESTS')}
              className="w-9 h-9 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200 cursor-pointer"
              title="الصفحة الرئيسية"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Red Hamburger Menu Button on Far Left */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer text-red-600 xl:hidden"
              title="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3 animate-fadeIn shadow-lg">
          {/* Admin Row in Mobile */}
          <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  onOpenAdminPanel();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-red-400" />
                <span>فتح لوحة المشرف والأدمن (إدارة ومسح البيانات)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAdminLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-stone-500" />
                <span>تسجيل دخول المشرف والأدمن</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectTab('REQUESTS');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                currentTab === 'REQUESTS'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              طلبات الدم العاجلة
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('DONORS');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                currentTab === 'DONORS'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              قائمة المتبرعين
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('BLOOD_BANKS');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                currentTab === 'BLOOD_BANKS'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              بنوك ومراكز الدم
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('STATS');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                currentTab === 'STATS'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              الإحصائيات والأثر
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
            <a
              href="https://t.me/dammak_alerts"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0088cc] text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <span>🔔 انضم لقناة التنبيهات العاجلة</span>
            </a>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onOpenTelegramSettings();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 font-bold"
              >
                إعدادات البوت
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenCalculator();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold"
              >
                موعد التبرع
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenConditions();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold"
              >
                شروط التبرع
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
