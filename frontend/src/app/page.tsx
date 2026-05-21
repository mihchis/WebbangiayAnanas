'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, RefreshCw, Flame, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  isSale: boolean;
  discountPercent: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  variants: Array<{ id: string; stock: number }>;
}

const HERO_SLIDES = [
  {
    image: '/images/track6.jpg',
    title: 'TRACK 6 - UTILITY GUM SOLE',
    subtitle: 'Nét cổ điển hòa quyện cùng phong cách phố thị thời thượng',
    link: '/products',
  },
  {
    image: '/images/Banner_Clothing.jpg',
    title: 'ANANAS CASUAL TEE',
    subtitle: 'Buy 2 Get 10% Off - Áp dụng cho toàn bộ thun Basic',
    link: '/products',
  },
  {
    image: '/images/Vintas-Temperate_desktop.jpg',
    title: 'VINTAS TEMPERATE',
    subtitle: 'Cảm hứng Retro thập niên 70 đầy hoài niệm và thanh lịch',
    link: '/products',
  },
  {
    image: '/images/AnanasxLuckyLuke-Pack_banner_desktop.jpg',
    title: 'ANANAS x LUCKY LUKE',
    subtitle: 'Chàng cao bồi nghèo đơn độc phiêu lưu trên nền giày Pattas',
    link: '/products',
  },
];

export default function Home() {
  const queryClient = useQueryClient();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Fetch products from API
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
  });

  // Seed DB Mutation
  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/products/seed');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });

  const handleSeed = () => {
    seedMutation.mutate();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {/* 1. Promo Ticker Strip */}
      <div className="bg-orange-50 border-y border-orange-100/60 py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-2 text-xs font-bold text-orange-600 tracking-wide text-center animate-pulse">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>BUY 2 GET 10% OFF - ÁP DỤNG VỚI TẤT CẢ BASIC TEE & VỚ</span>
        </div>
      </div>

      {/* 2. Hero Interactive Slideshow */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-neutral-900 overflow-hidden group">
        <div className="w-full h-full relative">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-10000"
              />
              {/* Overlay content for a premium feeling */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
                <div className="max-w-3xl transform translate-y-0 transition-transform duration-500 delay-300">
                  <span className="bg-orange-500 text-white font-extrabold text-[10px] tracking-widest px-2.5 py-1 rounded mb-3 inline-block">
                    MỚI RA MẮT
                  </span>
                  <h2 className="text-xl md:text-4xl font-black tracking-tight mb-2 uppercase">
                    {slide.title}
                  </h2>
                  <p className="text-xs md:text-lg font-light text-neutral-200 mb-6 drop-shadow-xs">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-2.5 rounded-full text-xs hover:bg-orange-500 hover:text-white transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    MUA NGAY
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slides Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-xs text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-orange-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-xs text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-orange-500"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-orange-500 w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. Empty database & Seed Trigger Banner */}
      {(!products || products.length === 0) && !isLoading && (
        <section className="max-w-7xl mx-auto my-12 px-4 w-full">
          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-2xl p-8 md:p-12 text-white shadow-xl text-center flex flex-col items-center gap-6">
            <Sparkles className="w-12 h-12 animate-bounce text-yellow-300" />
            <div>
              <h3 className="text-xl md:text-3xl font-black uppercase mb-2">Chào mừng đến với Ananas Store!</h3>
              <p className="text-sm md:text-base font-light text-orange-100 max-w-xl">
                Cơ sở dữ liệu của bạn hiện đang trống. Hãy bấm nút dưới đây để tự động tạo toàn bộ kích thước, màu sắc và 12 sản phẩm giày/phụ kiện thật của Ananas!
              </p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seedMutation.isPending}
              className="bg-white text-orange-600 font-extrabold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {seedMutation.isPending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Đang khởi tạo dữ liệu...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  KHỞI TẠO DỮ LIỆU CATALOG
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* 4. Beautiful Promotional Grid (Ananas Style) */}
      <section className="max-w-7xl mx-auto my-16 px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md group">
          <img
            src="/images/Banner_Clothing.jpg"
            alt="Clothing"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
            <h4 className="text-lg md:text-2xl font-black uppercase mb-1">CLOTHING & ACCESSORIES</h4>
            <p className="text-xs md:text-sm text-neutral-200 mb-4 font-light">Tất cả phụ kiện, mũ và túi phong cách urban</p>
            <Link
              href="/products"
              className="w-fit bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-full text-xs font-bold transition shadow-md"
            >
              KHÁM PHÁ NGAY
            </Link>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md group">
          <img
            src="/images/Clearance-Sale-Desktop.jpg"
            alt="Sale off"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
            <h4 className="text-lg md:text-2xl font-black uppercase mb-1 text-red-400">CLEARANCE SALE - UP TO 50%</h4>
            <p className="text-xs md:text-sm text-neutral-200 mb-4 font-light">Đừng bỏ lỡ các ưu đãi khủng cuối mùa</p>
            <Link
              href="/products?isSale=true"
              className="w-fit bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full text-xs font-bold transition shadow-md"
            >
              XEM KHUYẾN MÃI
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Dynamic Products Catalog Grid */}
      {products && products.length > 0 && (
        <section className="max-w-7xl mx-auto mb-20 px-4 w-full">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight uppercase flex items-center gap-2">
                Sản phẩm nổi bật
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-1">Những mẫu thiết kế được tìm mua nhiều nhất tuần này</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-orange-500 hover:text-orange-600 transition flex items-center gap-1 mt-2 md:mt-0"
            >
              Xem tất cả sản phẩm &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => {
              const primaryImage = product.images.find((img) => img.isPrimary)?.url || '/images/images.jpg';
              return (
                <div
                  key={product.id}
                  className="bg-white border border-neutral-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-orange-200 group flex flex-col"
                >
                  {/* Product Thumbnail container */}
                  <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    />

                    {/* Sale Ribbon */}
                    {product.isSale && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        -{product.discountPercent}%
                      </span>
                    )}

                    {/* Hover Actions Panel */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-white hover:bg-orange-500 hover:text-white text-neutral-900 p-3 rounded-full transition shadow-md hover:scale-110"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                        SKU: {product.sku}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 line-clamp-2 hover:text-orange-500 transition mb-2">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                      </h4>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-sm font-black text-orange-500">
                        {formatPrice(product.price)}
                      </span>
                      {product.isSale && product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="max-w-7xl mx-auto my-20 w-full flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-xs text-neutral-400 font-medium">Đang tải sản phẩm nổi bật...</span>
        </div>
      )}
    </div>
  );
}
