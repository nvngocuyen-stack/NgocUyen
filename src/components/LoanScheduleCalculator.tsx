import React, { useState, useMemo, useId } from 'react';
import {
  Calculator,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  X,
  Info,
  Layers,
  ArrowDownRight,
  TrendingDown,
  RotateCcw,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { LoanRepaymentRow } from '../types';

export const LoanScheduleCalculator: React.FC = () => {
  const { loan } = contentData;

  // Form states
  const [assetValueStr, setAssetValueStr] = useState<string>('33,333,333,333');
  const [loanAmountStr, setLoanAmountStr] = useState<string>('6,666,666,667');
  const [termMonths, setTermMonths] = useState<number>(240);
  const [annualRateStr, setAnnualRateStr] = useState<string>('8.0');
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-06-16');
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | 'quarterly' | 'semiAnnual' | 'yearly'>('monthly');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundingMode, setRoundingMode] = useState<'exact' | 'thousand'>('thousand');

  // Modal detail table view state
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [filterPeriod, setFilterPeriod] = useState<string>('all'); // all, first12, etc.

  const assetInputId = useId();
  const loanInputId = useId();
  const termInputId = useId();
  const rateInputId = useId();
  const dateInputId = useId();
  const dayInputId = useId();

  // Helper to format currency
  const formatCurrency = (val: number): string => {
    return val.toLocaleString('vi-VN');
  };

  const parseNumber = (val: string): number => {
    const raw = val.replace(/\D/g, '');
    return raw ? parseInt(raw, 10) : 0;
  };

  const assetValue = parseNumber(assetValueStr);
  const loanAmount = parseNumber(loanAmountStr);
  const annualRate = parseFloat(annualRateStr) || 0;

  // Loan to Value ratio (%)
  const ltvPercent = assetValue > 0 ? ((loanAmount / assetValue) * 100).toFixed(1) : '0';

  // Number of periods & periodic rate calculation
  const { totalPeriods, periodicRate, cycleStepMonths } = useMemo(() => {
    let divisor = 12;
    let step = 1;

    if (paymentCycle === 'quarterly') {
      divisor = 4;
      step = 3;
    } else if (paymentCycle === 'semiAnnual') {
      divisor = 2;
      step = 6;
    } else if (paymentCycle === 'yearly') {
      divisor = 1;
      step = 12;
    }

    const periods = Math.max(1, Math.ceil(termMonths / step));
    const pRate = (annualRate / 100) / divisor;

    return {
      totalPeriods: periods,
      periodicRate: pRate,
      cycleStepMonths: step,
    };
  }, [termMonths, paymentCycle, annualRate]);

  // Generate Amortization Schedule with exact rules from banking specs
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || totalPeriods <= 0) return [];

    const rows: LoanRepaymentRow[] = [];
    const basePrincipalPerPeriod = roundingMode === 'thousand'
      ? Math.round(loanAmount / totalPeriods / 1000) * 1000
      : Math.round(loanAmount / totalPeriods);

    let remainingBalance = loanAmount;
    let accumulatedPrincipalPaid = 0;

    // Parse disbursement date
    const [startYear, startMonth, startDay] = disbursementDate.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);

    // Period 0 (Disbursement)
    rows.push({
      period: 0,
      paymentDate: startDate.toLocaleDateString('vi-VN'),
      beginningBalance: loanAmount,
      principal: 0,
      interest: 0,
      totalPayment: 0,
      endingBalance: loanAmount,
    });

    for (let p = 1; p <= totalPeriods; p++) {
      const beginning = remainingBalance;

      // Periodic interest = beginning balance * periodic rate
      let interest = beginning * periodicRate;
      if (roundingMode === 'thousand') {
        interest = Math.round(interest / 1000) * 1000;
      } else {
        interest = Math.round(interest);
      }

      // Principal for this period
      let principal = basePrincipalPerPeriod;

      // Last period adjustment so total principal strictly matches loan amount
      if (p === totalPeriods) {
        principal = loanAmount - accumulatedPrincipalPaid;
      }

      if (principal > beginning) {
        principal = beginning;
      }

      const totalPayment = principal + interest;
      const ending = Math.max(0, beginning - principal);

      // Generate payment date
      const payDate = new Date(startYear, startMonth - 1 + p * cycleStepMonths, paymentDay || startDay);
      // Format as DD/MM/YYYY
      const formattedDate = `${String(payDate.getDate()).padStart(2, '0')}/${String(
        payDate.getMonth() + 1
      ).padStart(2, '0')}/${payDate.getFullYear()}`;

      rows.push({
        period: p,
        paymentDate: formattedDate,
        beginningBalance: beginning,
        principal,
        interest,
        totalPayment,
        endingBalance: ending,
      });

      remainingBalance = ending;
      accumulatedPrincipalPaid += principal;
    }

    return rows;
  }, [loanAmount, totalPeriods, periodicRate, roundingMode, disbursementDate, cycleStepMonths, paymentDay]);

  // Aggregate Totals
  const { totalInterest, totalPaymentOverall, firstPeriodPayment, lastPeriodPayment } = useMemo(() => {
    const paymentRows = scheduleData.filter((r) => r.period > 0);
    const sumInterest = paymentRows.reduce((acc, cur) => acc + cur.interest, 0);
    const sumPayment = paymentRows.reduce((acc, cur) => acc + cur.totalPayment, 0);
    const firstP = paymentRows.length > 0 ? paymentRows[0].totalPayment : 0;
    const lastP = paymentRows.length > 0 ? paymentRows[paymentRows.length - 1].totalPayment : 0;

    return {
      totalInterest: sumInterest,
      totalPaymentOverall: sumPayment,
      firstPeriodPayment: firstP,
      lastPeriodPayment: lastP,
    };
  }, [scheduleData]);

  const handleExportCSV = () => {
    const headers = ['Kỳ', 'Ngày trả nợ', 'Số gốc còn lại (VND)', 'Gốc (VND)', 'Lãi (VND)', 'Tổng gốc + Lãi (VND)', 'Dư nợ cuối kỳ (VND)'];
    const csvRows = scheduleData.map((r) =>
      [
        r.period,
        r.paymentDate,
        r.beginningBalance,
        r.principal,
        r.interest,
        r.totalPayment,
        r.endingBalance,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lich_tra_no_VietinBank_${loanAmount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-400/20 border border-sky-300/30 rounded-full text-xs font-semibold text-sky-200">
            <Calculator className="w-3.5 h-3.5 text-sky-300" />
            <span>Phương thức: Trả gốc đều · Lãi tính trên dư nợ giảm dần</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {loan.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {loan.subtitle}
          </p>
        </div>
      </div>

      {/* Main Form & Summary View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step 1: Input Form (NO SLIDER - Direct Numeric Inputs as specified in PDF) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-sky-600" />
              <span>Bước 1: Nhập thông tin khoản vay</span>
            </h3>
            <button
              onClick={() => {
                setAssetValueStr('33,333,333,333');
                setLoanAmountStr('6,666,666,667');
                setTermMonths(240);
                setAnnualRateStr('8.0');
                setDisbursementDate('2026-06-16');
                setPaymentCycle('monthly');
                setPaymentDay(25);
                setRoundingMode('thousand');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-sky-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dữ liệu mẫu</span>
            </button>
          </div>

          {/* 1. Asset Value */}
          <div className="space-y-1.5">
            <label htmlFor={assetInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
              Giá trị bất động sản / tài sản thế chấp (VND)
            </label>
            <div className="relative">
              <input
                id={assetInputId}
                type="text"
                value={assetValueStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setAssetValueStr(raw ? parseInt(raw, 10).toLocaleString('vi-VN') : '');
                }}
                className="w-full px-4 py-3 text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 tabular-nums"
                placeholder="Nhập giá trị tài sản..."
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* 2. Loan Amount (Direct numeric input, redesigned without slider as explicitly instructed!) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={loanInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
                Số tiền vay (VND) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Tỷ lệ vay / Tài sản: {ltvPercent}%
              </span>
            </div>
            <div className="relative">
              <input
                id={loanInputId}
                type="text"
                value={loanAmountStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setLoanAmountStr(raw ? parseInt(raw, 10).toLocaleString('vi-VN') : '');
                }}
                className="w-full px-4 py-3 text-base sm:text-lg font-black rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sky-950 tabular-nums"
                placeholder="Nhập số tiền muốn vay..."
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              * Thiết kế dạng ô nhập số tiền trực tiếp (không kéo thả), giúp nhập chính xác từng đồng theo nhu cầu.
            </p>
          </div>

          {/* 3. Term Months & Annual Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={termInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
                Thời gian vay (Tháng)
              </label>
              <div className="relative">
                <input
                  id={termInputId}
                  type="number"
                  min="1"
                  max="420"
                  value={termMonths}
                  onChange={(e) => setTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-3 text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Tháng ({Math.floor(termMonths / 12)} năm {termMonths % 12 > 0 ? `${termMonths % 12} th` : ''})
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={rateInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
                Lãi suất (%/Năm)
              </label>
              <div className="relative">
                <input
                  id={rateInputId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  className="w-full px-4 py-3 text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/Năm
                </span>
              </div>
            </div>
          </div>

          {/* 4. Disbursement Date & Repayment Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={dateInputId} className="block text-xs sm:text-sm font-bold text-slate-800">
                Ngày giải ngân
              </label>
              <input
                id={dateInputId}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                Chu kỳ trả nợ
              </label>
              <select
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value as any)}
                className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 bg-white"
              >
                <option value="monthly">Hằng tháng (Lãi suất năm / 12)</option>
                <option value="quarterly">Hằng quý (Lãi suất năm / 4)</option>
                <option value="semiAnnual">6 tháng (Lãi suất năm / 2)</option>
                <option value="yearly">Hằng năm (Lãi suất năm)</option>
              </select>
            </div>
          </div>

          {/* 5. Payment Day & Rounding Rule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label htmlFor={dayInputId} className="block text-xs font-bold text-slate-700">
                Ngày trả nợ định kỳ hằng tháng
              </label>
              <input
                id={dayInputId}
                type="number"
                min="1"
                max="31"
                value={paymentDay}
                onChange={(e) => setPaymentDay(Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Quy tắc làm tròn số
              </label>
              <select
                value={roundingMode}
                onChange={(e) => setRoundingMode(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="thousand">Làm tròn đến 1.000 đồng</option>
                <option value="exact">Làm tròn đến 1 đồng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2 Trigger: Summary Card (Matching PDF Page 1 screenshot!) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
                  $
                </div>
                <div>
                  <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
                    VietinBank Credit
                  </span>
                  <span className="text-sm font-bold text-white">Dự tính nghĩa vụ trả nợ</span>
                </div>
              </div>
            </div>

            {/* Monthly Range display: từ [Kỳ 1] đến [Kỳ cuối] */}
            <div className="space-y-2">
              <span className="text-xs text-sky-200 font-medium">Số tiền trả hàng tháng</span>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-300">Từ (Kỳ đầu):</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                    {formatCurrency(firstPeriodPayment)} <span className="text-xs font-semibold text-white">VND</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-white/10">
                  <span className="text-xs text-slate-300">Đến (Kỳ cuối):</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-300 tabular-nums">
                    {formatCurrency(lastPeriodPayment)} <span className="text-xs font-semibold text-white">VND</span>
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-sky-200/80 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Số tiền trả giảm dần theo thời gian (giảm dần qua các kỳ)</span>
              </p>
            </div>

            {/* Total Interest & Total Overall */}
            <div className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between text-xs sm:text-sm">
                <span className="text-sky-200">Tổng lãi phải trả:</span>
                <strong className="text-white text-base sm:text-lg font-bold tabular-nums">
                  {formatCurrency(totalInterest)} VND
                </strong>
              </div>

              <div className="flex items-baseline justify-between text-xs sm:text-sm pt-2 border-t border-white/10">
                <span className="text-sky-200">Tổng số tiền gốc + lãi:</span>
                <strong className="text-amber-300 text-lg sm:text-xl font-extrabold tabular-nums">
                  {formatCurrency(totalPaymentOverall)} VND
                </strong>
              </div>
            </div>

            {/* Button "Xem chi tiết" (as specified in PDF Page 1) */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Business rules callout */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              <span>Nguyên tắc tính toán nghiệp vụ</span>
            </h4>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-500">
              <li>
                <strong>Gốc trả mỗi kỳ</strong> = Số tiền vay / Tổng số kỳ trả nợ.
              </li>
              <li>
                <strong>Lãi kỳ hiện tại</strong> = Dư nợ đầu kỳ × Lãi suất kỳ.
              </li>
              <li>
                <strong>Tổng tiền trả kỳ</strong> = Gốc kỳ + Lãi kỳ.
              </li>
              <li>
                Sai lệch làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng để khớp 100% gốc vay.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STEP 2: FULL AMORTIZATION SCHEDULE MODAL ("Xem chi tiết")
          ===================================================================== */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  VietinBank Loan Amortization Schedule
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-300 hidden sm:block">
                  Vốn vay: {formatCurrency(loanAmount)} VND · Thời hạn: {termMonths} tháng · Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
                  title="Xuất file CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Xuất CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  title="In lịch trả nợ"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">In ấn</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Table Filter / Quick Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Bộ lọc xem:</span>
                <button
                  onClick={() => setFilterPeriod('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    filterPeriod === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Tất cả ({scheduleData.length - 1} kỳ)
                </button>
                <button
                  onClick={() => setFilterPeriod('first12')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    filterPeriod === 'first12'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  12 kỳ đầu tiên
                </button>
                <button
                  onClick={() => setFilterPeriod('first24')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    filterPeriod === 'first24'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  24 kỳ đầu
                </button>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <span>
                  Tổng gốc: <strong className="text-slate-900">{formatCurrency(loanAmount)} đ</strong>
                </span>
                <span>
                  Tổng lãi: <strong className="text-sky-700">{formatCurrency(totalInterest)} đ</strong>
                </span>
              </div>
            </div>

            {/* Scrollable Data Table (matching columns from PDF page 1 screenshot) */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200 sticky top-0 z-10">
                    <th className="py-3 px-3 w-16 text-center">STT</th>
                    <th className="py-3 px-4">Kỳ trả nợ</th>
                    <th className="py-3 px-4 text-right">Số gốc còn lại</th>
                    <th className="py-3 px-4 text-right">Gốc</th>
                    <th className="py-3 px-4 text-right">Lãi</th>
                    <th className="py-3 px-4 text-right font-black">Tổng gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {scheduleData
                    .filter((row) => {
                      if (filterPeriod === 'first12') return row.period <= 12;
                      if (filterPeriod === 'first24') return row.period <= 24;
                      return true;
                    })
                    .map((row) => (
                      <tr
                        key={row.period}
                        className={`hover:bg-sky-50/50 transition-colors ${
                          row.period === 0 ? 'bg-slate-50/80 font-bold text-slate-500' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          {row.paymentDate}
                          {row.period === 0 && (
                            <span className="ml-2 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                              Giải ngân
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-700">
                          {formatCurrency(row.beginningBalance)}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-700">
                          {row.period === 0 ? '-' : formatCurrency(row.principal)}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-700">
                          {row.period === 0 ? '-' : formatCurrency(row.interest)}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums font-bold text-sky-900">
                          {row.period === 0 ? '-' : formatCurrency(row.totalPayment)}
                        </td>
                      </tr>
                    ))}
                </tbody>

                {/* Footer Total Row (matching PDF page 1 screenshot) */}
                <tfoot>
                  <tr className="bg-slate-800 text-white font-extrabold sticky bottom-0 text-xs sm:text-sm">
                    <td colSpan={3} className="py-3 px-4 uppercase tracking-wider text-left">
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatCurrency(loanAmount)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-amber-300">
                      {formatCurrency(totalInterest)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-300 text-sm sm:text-base font-black">
                      {formatCurrency(totalPaymentOverall)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Bottom note */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
              <p>
                * Bảng tính được lập dựa trên quy định tính lãi trên dư nợ giảm dần chuẩn của VietinBank.
              </p>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-colors"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
