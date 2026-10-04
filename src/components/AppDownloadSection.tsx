import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Download,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Sparkles,
  CreditCard
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const AppDownloadSection: React.FC = () => {
  const { appDownload } = contentData;
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-400/20 border border-sky-300/30 rounded-full text-xs font-semibold text-sky-200">
            <Smartphone className="w-3.5 h-3.5 text-sky-300" />
            <span>Ngân hàng số thông minh trên di động</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {appDownload.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {appDownload.description}
          </p>
        </div>
      </div>

      {/* QR Codes & Download Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <span>{appDownload.ios.platform}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Apple App Store</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              VietinBank iPay cho iPhone / iPad
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Quét mã QR dưới đây bằng Camera iPhone hoặc bấm tải về trực tiếp từ App Store.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img
                  src={appDownload.ios.qr}
                  alt="QR Code iOS VietinBank iPay"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <p className="text-xs font-medium text-slate-600">
                  <QrCode className="w-4 h-4 inline-block mr-1 text-sky-600" />
                  Mở camera quét mã để tải nhanh trong 10 giây
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <a
                    href={appDownload.ios.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải trên App Store</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  <button
                    onClick={() => handleCopy(appDownload.ios.url, 'ios')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                  >
                    {copiedLink === 'ios' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Đã chép link</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{appDownload.android.platform}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Google Play Store</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              VietinBank iPay cho máy Android
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Quét mã QR bằng Camera Google Lens / Zalo hoặc bấm tải về trực tiếp từ CH Play.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img
                  src={appDownload.android.qr}
                  alt="QR Code Android VietinBank iPay"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <p className="text-xs font-medium text-slate-600">
                  <QrCode className="w-4 h-4 inline-block mr-1 text-emerald-600" />
                  Mở camera hoặc Zalo quét mã để tải ngay
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <a
                    href={appDownload.android.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải trên Google Play</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  <button
                    onClick={() => handleCopy(appDownload.android.url, 'android')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                  >
                    {copiedLink === 'android' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Đã chép link</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition & Benefits */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
        <div className="max-w-xl mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Đặc quyền khi trải nghiệm VietinBank iPay Mobile
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ứng dụng đạt giải Ngân hàng số tiêu biểu Việt Nam nhiều năm liền
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appDownload.benefits.map((benefit, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 hover:border-sky-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                {i === 0 && <Zap className="w-4 h-4" />}
                {i === 1 && <CreditCard className="w-4 h-4" />}
                {i === 2 && <Shield className="w-4 h-4" />}
                {i === 3 && <Sparkles className="w-4 h-4" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{benefit.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
