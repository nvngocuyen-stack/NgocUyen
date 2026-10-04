import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
  Building2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { BranchItem } from '../types';
import { SafeImage } from './SafeImage';

export const BranchNetworkSection: React.FC = () => {
  const { branches, brand } = contentData;
  const [selectedBranchStt, setSelectedBranchStt] = useState<number>(1);

  const selectedBranch = branches.items.find((b) => b.stt === selectedBranchStt) || branches.items[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-400/20 border border-sky-300/30 rounded-full text-xs font-semibold text-sky-200">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>Mạng lưới Chi nhánh & Phòng Giao dịch rộng khắp</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {branches.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {branches.subtitle}
          </p>
        </div>
      </div>

      {/* Operating Hours Info Card (Exact from PDF Page 2) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-sm sm:text-base">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>Thời gian giao dịch tại quầy</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 space-y-1 font-medium">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong>Thứ 2 đến thứ 6:</strong>
            </p>
            <div className="pl-4 text-slate-600">
              <p>• Sáng: từ <strong>07:30 AM</strong> đến <strong>11:30 AM</strong></p>
              <p>• Chiều: từ <strong>01:30 PM</strong> đến <strong>04:30 PM</strong></p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs sm:text-sm">
          <p className="text-rose-600 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Thứ 7 - Chủ nhật: Nghỉ giao dịch</span>
          </p>
          <p className="text-slate-500 text-xs leading-relaxed">
            * Trong thời gian ngoài giờ làm việc hoặc cuối tuần, Quý khách có thể thực hiện mọi giao dịch chuyển khoản, gửi tiết kiệm, thanh toán 24/7 trên ứng dụng <strong>VietinBank iPay Mobile</strong> hoặc hệ thống ATM/CDM.
          </p>
        </div>
      </div>

      {/* Branch Selection & Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Branch List (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Danh sách điểm giao dịch ({branches.items.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Chọn để xem chi tiết</span>
          </div>

          <div className="space-y-2">
            {branches.items.map((b) => {
              const isSelected = selectedBranchStt === b.stt;
              return (
                <button
                  key={b.stt}
                  onClick={() => setSelectedBranchStt(b.stt)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'bg-sky-50/90 border-sky-500 shadow-xs text-sky-950 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {b.stt}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold line-clamp-1">{b.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{b.address}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-sky-600 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Branch Spotlight Card (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[11px] font-bold uppercase tracking-wider">
                {selectedBranch.room}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {selectedBranch.name}
              </h3>
            </div>
            {selectedBranch.isHeadquarter && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Hội sở Chi nhánh
              </span>
            )}
          </div>

          {/* Branch Image */}
          <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 max-h-72 flex items-center justify-center">
            <SafeImage
              src={selectedBranch.image}
              fallbackSrc={selectedBranch.remoteImage}
              alt={selectedBranch.name}
              className="w-full h-72 object-cover"
            />
          </div>

          {/* Address & Direct Click-to-Call Hotline */}
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Địa chỉ trụ sở:</span>
                <p className="text-slate-700 leading-relaxed">{selectedBranch.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Direct Click-to-Call Hotline */}
              <a
                href={`tel:${selectedBranch.hotline.replace(/\./g, '')}`}
                className="p-4 bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 flex items-center justify-between transition-colors group"
                title="Bấm để gọi hotline ngay"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Hotline Tư Vấn (Bấm gọi luôn)
                  </span>
                  <strong className="text-base sm:text-lg font-black text-emerald-950 font-mono">
                    {selectedBranch.hotline}
                  </strong>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
              </a>

              {/* Google Maps Link with Icon */}
              <a
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-sky-50 hover:bg-sky-100/80 rounded-2xl border border-sky-200 flex items-center justify-between transition-colors group"
                title="Mở Google Maps chỉ đường"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                    Bản đồ Google Maps
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-1">
                    Xem vị trí & Chỉ đường
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Điện thoại bàn PGD: {selectedBranch.phone}</span>
              <span>Tổng đài VietinBank: 1900 558 868</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
