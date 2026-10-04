import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import contentData from '../data/contentData.json';
import { SafeImage } from './SafeImage';

export const Footer: React.FC = () => {
  const { brand, branches } = contentData;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="bg-white p-2 rounded-lg inline-block">
              <SafeImage
                src={brand.logoPath}
                fallbackSrc={brand.remoteLogo}
                alt="VietinBank"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {brand.fullName}
              <br />
              <strong className="text-white">{brand.branchName}</strong>
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>An toàn · Bảo mật · Tận tâm phục vụ</span>
            </div>
          </div>

          {/* Col 2: Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Hỗ trợ giao dịch tại quầy
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                Chuyên viên tư vấn:{' '}
                <strong className="text-white font-medium">{brand.advisor.name}</strong>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a
                  href={`tel:${brand.advisor.phone.replace(/\./g, '')}`}
                  className="text-sky-300 hover:text-white font-semibold"
                >
                  {brand.advisor.phone} (Gọi trực tiếp)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Tổng đài CSKH: </span>
                <a
                  href={`tel:${brand.hotline.replace(/\s+/g, '')}`}
                  className="text-white hover:text-sky-300 font-semibold"
                >
                  {brand.hotline}
                </a>
              </p>
            </div>
          </div>

          {/* Col 3: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Thời gian giao dịch
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Thứ 2 đến Thứ 6:</p>
                  <p>Sáng: 07:30 AM – 11:30 AM</p>
                  <p>Chiều: 01:30 PM – 04:30 PM</p>
                </div>
              </div>
              <p className="text-rose-400 font-medium pl-6">
                Thứ 7 – Chủ nhật: Nghỉ giao dịch
              </p>
            </div>
          </div>

          {/* Col 4: Network */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Mạng lưới trực thuộc
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {branches.items.slice(0, 4).map((b) => (
                <li key={b.stt} className="flex items-center justify-between">
                  <span className="truncate">{b.name}</span>
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:text-sky-300 shrink-0 ml-2"
                  >
                    Bản đồ
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Ngân hàng TMCP Công Thương Việt Nam - VietinBank. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Chi nhánh Tây Tiền Giang</span>
            <span>·</span>
            <span>Ứng dụng tương tác quầy giao dịch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
