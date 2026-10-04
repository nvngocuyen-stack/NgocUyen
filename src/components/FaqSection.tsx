import React, { useState } from 'react';
import {
  HelpCircle,
  KeyRound,
  CreditCard,
  Fingerprint,
  Receipt,
  CalendarDays,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  LogOut,
  PhoneCall,
  Youtube,
  ZoomIn,
  X
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FaqTopic, FaqStep } from '../types';
import { SafeImage } from './SafeImage';

export const FaqSection: React.FC = () => {
  const { faq, brand } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'ok' | 'not-ok' | 'ended'>('idle');
  const [zoomImage, setZoomImage] = useState<{ src: string; fallback: string; title: string } | null>(null);

  const selectedTopic = faq.topics.find((t) => t.id === selectedTopicId) as FaqTopic | undefined;

  const topicIcons: Record<string, React.ReactNode> = {
    'forgot-password': <KeyRound className="w-6 h-6 text-sky-600" />,
    'close-card': <CreditCard className="w-6 h-6 text-indigo-600" />,
    'biometrics': <Fingerprint className="w-6 h-6 text-teal-600" />,
    'e-tax': <Receipt className="w-6 h-6 text-amber-600" />,
    'book-appointment': <CalendarDays className="w-6 h-6 text-rose-600" />,
  };

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
  };

  const handleResetToMenu = () => {
    setSelectedTopicId(null);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
  };

  const handleFeedback = (isOk: boolean) => {
    setFeedbackState(isOk ? 'ok' : 'not-ok');
    if (isOk) {
      setTimeout(() => {
        handleResetToMenu();
      }, 1200);
    }
  };

  const handleEndChat = () => {
    setFeedbackState('ended');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-400/20 border border-sky-300/30 rounded-full text-xs font-semibold text-sky-200">
            <HelpCircle className="w-3.5 h-3.5 text-sky-300" />
            <span>Hỗ trợ thao tác & giải đáp trực tiếp tại quầy</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {faq.question}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {faq.promptText}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedTopic ? (
        /* Topic Selection Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {faq.topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSelectTopic(topic.id)}
              className="group text-left bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-500/80 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-sky-50 transition-all">
                  {topicIcons[topic.id] || <HelpCircle className="w-6 h-6 text-sky-600" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                <span>{topic.steps.length} bước thực hiện</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Xem ngay <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Detailed Step-by-Step Viewer */
        <div className="space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <button
              onClick={handleResetToMenu}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Quay lại danh mục</span>
            </button>
            <div className="text-center font-bold text-slate-800 text-sm sm:text-base">
              {selectedTopic.title}
            </div>
            {selectedTopic.youtubeUrl && (
              <a
                href={selectedTopic.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <Youtube className="w-4 h-4 text-rose-600" />
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>
                Bước {currentStepIndex + 1} / {selectedTopic.steps.length}:{' '}
                <strong className="text-slate-900">
                  {selectedTopic.steps[currentStepIndex].title}
                </strong>
              </span>
              <span className="text-sky-700 font-bold">
                {Math.round(((currentStepIndex + 1) / selectedTopic.steps.length) * 100)}% hoàn thành
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / selectedTopic.steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Step Selector Pills for quick jump */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {selectedTopic.steps.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 transition-colors ${
                    idx === currentStepIndex
                      ? 'bg-sky-600 text-white'
                      : idx < currentStepIndex
                      ? 'bg-sky-50 text-sky-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  B{st.step}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content with Image & Instructions */}
          {(() => {
            const step = selectedTopic.steps[currentStepIndex];
            return (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Step Text */}
                <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                    <span>Bước {step.step}</span>
                    <span>·</span>
                    <span>{step.title}</span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                    {step.content}
                  </p>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>
                    {currentStepIndex < selectedTopic.steps.length - 1 ? (
                      <button
                        onClick={() =>
                          setCurrentStepIndex((prev) =>
                            Math.min(selectedTopic.steps.length - 1, prev + 1)
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 rounded-xl transition-all shadow-xs"
                      >
                        <span>Tiếp tục</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã xem hết các bước</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Image with Lightbox / Zoom */}
                <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
                  <div
                    onClick={() =>
                      setZoomImage({
                        src: step.image,
                        fallback: step.remoteImage,
                        title: `Bước ${step.step}: ${step.title}`,
                      })
                    }
                    className="relative group cursor-pointer w-full max-w-md max-h-[380px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center"
                  >
                    <SafeImage
                      src={step.image}
                      fallbackSrc={step.remoteImage}
                      alt={step.title}
                      className="w-full h-auto max-h-[380px] object-contain group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/75 text-white text-xs font-bold rounded-lg backdrop-blur-xs">
                        <ZoomIn className="w-3.5 h-3.5" /> Phóng to xem rõ
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2">
                    Nhấp vào ảnh để phóng to chi tiết giao diện
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Feedback & Interaction Bar (Mandatory based on prompt) */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 text-center">
              {faq.feedbackPrompt}
            </h4>

            {feedbackState === 'idle' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleFeedback(true)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn, tôi làm được rồi</span>
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 active:scale-98 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>
                <button
                  onClick={handleEndChat}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-200/60 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Kết thúc cuộc trò chuyện</span>
                </button>
              </div>
            )}

            {feedbackState === 'ok' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <p className="text-sm font-semibold text-emerald-800">
                  Tuyệt vời! Cảm ơn Quý khách. Đang chuyển về danh mục chính...
                </p>
              </div>
            )}

            {feedbackState === 'not-ok' && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
                <p className="text-sm font-medium text-amber-900 leading-relaxed">
                  {faq.unresolvedResponse}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${brand.advisor.phone.replace(/\./g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Gọi Chuyên viên: {brand.advisor.phone}</span>
                  </a>
                  <button
                    onClick={handleResetToMenu}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Quay lại menu chính</span>
                  </button>
                  <button
                    onClick={handleEndChat}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Kết thúc</span>
                  </button>
                </div>
              </div>
            )}

            {feedbackState === 'ended' && (
              <div className="p-6 bg-sky-50 border border-sky-200 rounded-2xl text-center space-y-4">
                <h5 className="text-base sm:text-lg font-bold text-sky-950">
                  {faq.farewellMessage}
                </h5>
                <div>
                  <button
                    onClick={handleResetToMenu}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Về màn hình chính</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / Image Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {zoomImage.title}
              </h4>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <SafeImage
                src={zoomImage.src}
                fallbackSrc={zoomImage.fallback}
                alt={zoomImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
