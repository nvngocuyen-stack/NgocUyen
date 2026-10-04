import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Gift,
  PhoneCall,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  Tag
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ProductItem } from '../types';
import { SafeImage } from './SafeImage';

export const FeaturedProductsSection: React.FC = () => {
  const { featuredProducts, brand } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const filteredItems = (featuredProducts.items as ProductItem[]).filter((item) => {
    if (selectedCategory === 'Tất cả') return true;
    if (selectedCategory === 'Cá nhân') return item.category.includes('Cá nhân');
    if (selectedCategory === 'Hộ kinh doanh') return item.category.includes('Hộ kinh doanh');
    if (selectedCategory === 'Doanh nghiệp') return item.category.includes('Doanh nghiệp');
    if (selectedCategory === 'Ưu đãi') return item.category.includes('Ưu đãi');
    if (selectedCategory === 'Đấu giá tài sản') return item.category.includes('Đấu giá');
    return true;
  });

  const handleNextCarousel = () => {
    setActiveCarouselIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCarousel = () => {
    setActiveCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full text-xs font-semibold text-amber-200">
            <Star className="w-3.5 h-3.5 text-amber-300" />
            <span>Ưu đãi & Tiện ích đặc quyền tại Chi nhánh</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {featuredProducts.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {featuredProducts.description}
          </p>
        </div>
      </div>

      {/* Filter Chips Bar (As requested in PDF) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {featuredProducts.categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveCarouselIndex(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'carousel' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Dạng Carousel
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Dạng Lưới
          </button>
        </div>
      </div>

      {/* CAROUSEL VIEW (Recommended in PDF) */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-sm overflow-hidden">
          {(() => {
            const item = filteredItems[activeCarouselIndex % filteredItems.length];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Poster Display */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border-2 border-rose-100/60 shadow-lg bg-slate-50">
                    <SafeImage
                      src={item.posterImage}
                      fallbackSrc={item.remoteImage}
                      alt={item.name}
                      className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{item.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Poster Description & Actions */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                      {item.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2">
                    {item.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA "Tôi quan tâm" (As requested in PDF) */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setInterestedProduct(item)}
                      className="px-6 py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Tôi quan tâm</span>
                    </button>
                    <a
                      href={`tel:${brand.advisor.phone.replace(/\./g, '')}`}
                      className="inline-flex items-center gap-2 px-5 py-3.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs sm:text-sm rounded-2xl border border-sky-200 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Tư vấn: {brand.advisor.phone}</span>
                    </a>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center justify-between pt-4 text-xs font-bold text-slate-500">
                    <span>
                      {activeCarouselIndex + 1} / {filteredItems.length} sản phẩm
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevCarousel}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                        title="Poster trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextCarousel}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                        title="Poster tiếp theo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* GRID VIEW (Alternative full display) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  <SafeImage
                    src={item.posterImage}
                    fallbackSrc={item.remoteImage}
                    alt={item.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-sky-700 uppercase">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setInterestedProduct(item)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog when clicking "Tôi quan tâm" (As specified in PDF) */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  Đăng ký nhận tư vấn
                </h4>
              </div>
              <button
                onClick={() => setInterestedProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200/80">
                <span className="text-[11px] font-bold text-sky-800 uppercase block">
                  Sản phẩm quan tâm
                </span>
                <strong className="text-slate-900 text-sm font-extrabold">
                  {interestedProduct.name}
                </strong>
              </div>

              {/* Exact Text from PDF Page 1 */}
              <p className="font-medium text-slate-800">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <p className="font-semibold text-amber-950">
                  Hoặc liên hệ Chuyên viên tư vấn:
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{brand.advisor.name}</p>
                    <p className="text-xs text-slate-500">{brand.advisor.title}</p>
                  </div>
                  <a
                    href={`tel:${brand.advisor.phone.replace(/\./g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{brand.advisor.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setInterestedProduct(null)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
