import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Award
} from 'lucide-react';
import contentData from './data/contentData.json';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { GamesSection } from './components/GamesSection';
import { SavingsCalculator } from './components/SavingsCalculator';
import { LoanScheduleCalculator } from './components/LoanScheduleCalculator';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchNetworkSection } from './components/BranchNetworkSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const { menuItems, brand } = contentData;

  const iconMap: Record<string, React.ReactNode> = {
    HelpCircle: <HelpCircle className="w-5 h-5 text-sky-600" />,
    Smartphone: <Smartphone className="w-5 h-5 text-emerald-600" />,
    Gamepad2: <Gamepad2 className="w-5 h-5 text-amber-500" />,
    PiggyBank: <PiggyBank className="w-5 h-5 text-indigo-600" />,
    Calculator: <Calculator className="w-5 h-5 text-rose-600" />,
    Sparkles: <Sparkles className="w-5 h-5 text-violet-600" />,
    MapPin: <MapPin className="w-5 h-5 text-sky-700" />,
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    if (contentContainerRef.current) {
      gsap.to(contentContainerRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          setActiveTab(tabId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gsap.fromTo(
            contentContainerRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
          );
        },
      });
    } else {
      setActiveTab(tabId);
    }
  };

  // Initial GSAP entrance animation
  useEffect(() => {
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Banner Notice for Counter Customers */}
      <div className="bg-sky-950 text-sky-200 text-xs py-2 px-4 border-b border-sky-900/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              VietinBank {brand.branchName}
            </span>
            <span className="text-slate-400">·</span>
            <span>Ứng dụng hỗ trợ giao dịch viên & phục vụ khách hàng trực tiếp tại quầy</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" /> Giờ làm việc: 07:30 - 11:30 | 13:30 - 16:30
            </span>
            <span className="text-slate-500">|</span>
            <a
              href={`tel:${brand.advisor.phone.replace(/\./g, '')}`}
              className="text-amber-300 font-bold hover:underline"
            >
              Hotline CVTV: {brand.advisor.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <Header activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Primary 7-Feature Quick Dashboard Bar */}
      <section className="bg-white border-b border-slate-200 shadow-2xs py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between group ${
                    isActive
                      ? 'bg-sky-50 border-sky-600 shadow-xs ring-1 ring-sky-600'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/90 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 group-hover:bg-sky-100 text-slate-700'
                      }`}
                    >
                      {iconMap[item.icon] || <HelpCircle className="w-4 h-4" />}
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-xs font-bold leading-tight ${
                        isActive ? 'text-sky-950' : 'text-slate-900 group-hover:text-sky-800'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div ref={contentContainerRef}>
          {activeTab === 'faq' && <FaqSection />}
          {activeTab === 'app-download' && <AppDownloadSection />}
          {activeTab === 'games' && <GamesSection />}
          {activeTab === 'savings' && <SavingsCalculator />}
          {activeTab === 'loan-schedule' && <LoanScheduleCalculator />}
          {activeTab === 'featured-products' && <FeaturedProductsSection />}
          {activeTab === 'branches' && <BranchNetworkSection />}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
