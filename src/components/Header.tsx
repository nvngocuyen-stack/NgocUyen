import React from 'react';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const { brand } = contentData;

  const navLinks = [
    { id: 'faq', label: 'Giải đáp' },
    { id: 'app-download', label: 'Tải iPay' },
    { id: 'games', label: 'Game nhận quà' },
    { id: 'savings', label: 'Tính lãi gửi' },
    { id: 'loan-schedule', label: 'Lịch trả nợ' },
    { id: 'featured-products', label: 'Sản phẩm hot' },
    { id: 'branches', label: 'Điểm giao dịch' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Zone 1: Brand lockup with logo and bank name */}
          <button
            onClick={() => onSelectTab('faq')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg p-1 transition-transform active:scale-98"
          >
            <div className="h-9 sm:h-11 flex items-center">
              <SafeImage
                src={brand.logoPath}
                fallbackSrc={brand.remoteLogo}
                alt="VietinBank Logo"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-xs font-semibold text-slate-800 tracking-wide uppercase">
                {brand.branchName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {brand.slogan}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 border-b-2 border-sky-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Advisor Quick Call */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${brand.advisor.phone.replace(/\./g, '')}`}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-700 to-sky-800 hover:from-sky-800 hover:to-sky-900 active:scale-98 rounded-lg shadow-sm transition-all whitespace-nowrap"
              title={`Gọi Chuyên viên tư vấn: ${brand.advisor.name}`}
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 animate-pulse" />
              <span className="hidden sm:inline">Tư vấn:</span>
              <span>{brand.advisor.phone}</span>
            </a>
          </div>
        </div>

        {/* Mobile secondary scrollable nav */}
        <div className="md:hidden flex items-center gap-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
