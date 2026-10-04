import React, { useState, useId } from 'react';
import {
  PiggyBank,
  Calculator,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Video
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const SavingsCalculator: React.FC = () => {
  const { savings } = contentData;

  const [depositAmountStr, setDepositAmountStr] = useState<string>('100,000,000');
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(savings.defaultTerm);
  const [interestRateStr, setInterestRateStr] = useState<string>(savings.defaultRate.toString());
  const [errorAmount, setErrorAmount] = useState<string | null>(null);
  const [errorTerm, setErrorTerm] = useState<string | null>(null);
  const [errorRate, setErrorRate] = useState<string | null>(null);

  const amountInputId = useId();
  const termSelectId = useId();
  const rateInputId = useId();

  // Parse numeric amount
  const parseAmount = (val: string): number => {
    const raw = val.replace(/\D/g, '');
    return raw ? parseInt(raw, 10) : 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setDepositAmountStr('');
      setErrorAmount('Vui lòng nhập số tiền gửi hợp lệ.');
      return;
    }
    const num = parseInt(rawVal, 10);
    setDepositAmountStr(num.toLocaleString('vi-VN'));

    if (num < savings.minAmount) {
      setErrorAmount(`Số tiền gửi tối thiểu là ${savings.minAmount.toLocaleString('vi-VN')} VND.`);
    } else {
      setErrorAmount(null);
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const months = parseInt(e.target.value, 10);
    if (isNaN(months) || months <= 0) {
      setErrorTerm('Vui lòng chọn kỳ hạn gửi.');
      return;
    }
    setErrorTerm(null);
    setSelectedTermMonths(months);

    // Auto update suggested rate from VietinBank table
    const matchedTerm = savings.terms.find((t) => t.months === months);
    if (matchedTerm) {
      setInterestRateStr(matchedTerm.rate.toString());
      setErrorRate(null);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInterestRateStr(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 20) {
      setErrorRate('Vui lòng nhập lãi suất hợp lệ (từ 0% đến 20%/năm).');
    } else {
      setErrorRate(null);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setDepositAmountStr(amount.toLocaleString('vi-VN'));
    setErrorAmount(null);
  };

  // Calculation
  const amount = parseAmount(depositAmountStr);
  const rate = parseFloat(interestRateStr) || 0;
  const isFormValid = amount >= savings.minAmount && selectedTermMonths > 0 && rate >= 0 && !errorAmount && !errorRate;

  // Formula: Lãi = Tiền gửi * Lãi suất * (Số ngày gửi / 365) ~ Tiền gửi * (Lãi suất / 100) * (Tháng / 12)
  const interestEarned = isFormValid ? Math.round(amount * (rate / 100) * (selectedTermMonths / 12)) : 0;
  const totalPayout = amount + interestEarned;
  const monthlyAverage = selectedTermMonths > 0 ? Math.round(interestEarned / selectedTermMonths) : 0;
  const dailyAverage = Math.round(interestEarned / (selectedTermMonths * 30));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-400/20 border border-sky-300/30 rounded-full text-xs font-semibold text-sky-200">
            <PiggyBank className="w-3.5 h-3.5 text-sky-300" />
            <span>Tiền gửi thông thường trả lãi sau · An toàn tuyệt đối</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {savings.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {savings.subtitle}
          </p>
        </div>
      </div>

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left Column - 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-600" />
              <span>Nhập thông tin tiền gửi</span>
            </h3>
            <button
              onClick={() => {
                setDepositAmountStr('100,000,000');
                setSelectedTermMonths(12);
                setInterestRateStr('5.0');
                setErrorAmount(null);
                setErrorTerm(null);
                setErrorRate(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-sky-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>
          </div>

          {/* 1. Deposit Amount */}
          <div className="space-y-2">
            <label htmlFor={amountInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
              Số tiền gửi (VND) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id={amountInputId}
                type="text"
                value={depositAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền..."
                className={`w-full px-4 py-3.5 text-base sm:text-lg font-bold rounded-xl border focus:outline-none focus:ring-2 transition-all tabular-nums ${
                  errorAmount
                    ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20 text-rose-900'
                    : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500 text-slate-900'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            {errorAmount && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorAmount}</span>
              </p>
            )}

            {/* Quick Amount Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[20000000, 50000000, 100000000, 500000000, 1000000000].map((quick) => (
                <button
                  key={quick}
                  onClick={() => handleQuickAmount(quick)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-600 transition-colors"
                >
                  {quick >= 1000000000
                    ? `${quick / 1000000000} Tỷ`
                    : `${quick / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Term Selection */}
          <div className="space-y-2">
            <label htmlFor={termSelectId} className="block text-xs sm:text-sm font-bold text-slate-800">
              Kỳ hạn gửi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id={termSelectId}
                value={selectedTermMonths}
                onChange={handleTermChange}
                className="w-full px-4 py-3.5 text-sm sm:text-base font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white cursor-pointer"
              >
                {savings.terms.map((t) => (
                  <option key={t.months} value={t.months}>
                    {t.label} — Lãi suất niêm yết: {t.rate}%/năm
                  </option>
                ))}
              </select>
            </div>
            {errorTerm && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorTerm}</span>
              </p>
            )}
          </div>

          {/* 3. Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={rateInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
                Lãi suất (%/năm) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Tự động lấy theo biểu lãi suất VietinBank
              </span>
            </div>
            <div className="relative">
              <input
                id={rateInputId}
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={interestRateStr}
                onChange={handleRateChange}
                className="w-full px-4 py-3 text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 tabular-nums"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {errorRate && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorRate}</span>
              </p>
            )}
          </div>

          {/* Formula disclosure notice */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              Công thức tính lãi theo quy định NHNN:
            </p>
            <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
              Tiền lãi = (Số tiền gửi × Lãi suất (%/năm) × Số ngày thực gửi) / 365 ngày
            </p>
          </div>
        </div>

        {/* Results Card (Right Column - 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-sky-900 via-sky-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-sky-700/50 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                KẾT QUẢ DỰ TÍNH
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                Lãi cuối kỳ
              </span>
            </div>

            {/* Interest Earned High Priority Metric */}
            <div className="space-y-1">
              <span className="text-xs text-sky-200 font-medium">Tiền lãi dự tính</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 tabular-nums tracking-tight">
                {interestEarned.toLocaleString('vi-VN')} <span className="text-xl font-bold text-white">VND</span>
              </div>
            </div>

            {/* Total Balance at Maturity */}
            <div className="pt-4 border-t border-white/10 space-y-1">
              <span className="text-xs text-sky-200 font-medium">
                Tổng tiền nhận được khi đáo hạn (Gốc + Lãi)
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                {totalPayout.toLocaleString('vi-VN')} <span className="text-lg font-normal text-sky-200">VND</span>
              </div>
            </div>

            {/* Breakdown Mini Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-sky-200 block">Lãi trung bình / tháng</span>
                <strong className="text-sm sm:text-base font-bold text-white tabular-nums">
                  ~{monthlyAverage.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-sky-200 block">Lãi trung bình / ngày</span>
                <strong className="text-sm sm:text-base font-bold text-white tabular-nums">
                  ~{dailyAverage.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            </div>

            <div className="text-[11px] text-sky-200/80 leading-relaxed border-t border-white/10 pt-4">
              * Kết quả mang tính chất tham khảo tại thời điểm hiện tại. Lãi suất thực tế sẽ được áp dụng theo biểu phí niêm yết tại thời điểm mở sổ.
            </div>
          </div>

          {/* Video Guide Link (as specified in PDF) */}
          {savings.videoGuide && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  <Video className="w-3.5 h-3.5" /> Video clip hướng dẫn
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {savings.videoGuide.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Xem clip ngắn mẹo gửi tiết kiệm thông minh và tối ưu lợi nhuận
                </p>
              </div>
              <a
                href={savings.videoGuide.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 p-3 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all shadow-xs"
                title="Xem video trên TikTok"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
