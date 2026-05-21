'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Search, SlidersHorizontal, Check, Eye, Heart, HelpCircle, ChevronDown, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  isSale: boolean;
  discountPercent: number;
  style: string;
  gender: string;
  images: Array<{ url: string; isPrimary: boolean }>;
}

interface Color {
  id: number;
  name: string;
  hexCode: string;
}

interface Size {
  id: number;
  value: string;
}

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States from URL Params (storing in React state and syncing with URL)
  const [style, setStyle] = useState<string>(searchParams.get('style') || '');
  const [gender, setGender] = useState<string>(searchParams.get('gender') || '');
  const [isSale, setIsSale] = useState<string>(searchParams.get('isSale') || '');
  const [colorId, setColorId] = useState<string>(searchParams.get('colorId') || '');
  const [sizeId, setSizeId] = useState<string>(searchParams.get('sizeId') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'newest');
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [line, setLine] = useState<string>(searchParams.get('line') || '');

  // Keep state in sync when URL changes
  useEffect(() => {
    setStyle(searchParams.get('style') || '');
    setGender(searchParams.get('gender') || '');
    setIsSale(searchParams.get('isSale') || '');
    setColorId(searchParams.get('colorId') || '');
    setSizeId(searchParams.get('sizeId') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
    setSearch(searchParams.get('search') || '');
    setLine(searchParams.get('line') || '');
  }, [searchParams]);

  // Sync state back to URL
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  // Queries
  const { data: colors } = useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const response = await api.get('/products/colors');
      return response.data;
    },
  });

  const { data: sizes } = useQuery<Size[]>({
    queryKey: ['sizes'],
    queryFn: async () => {
      const response = await api.get('/products/sizes');
      return response.data;
    },
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', style, gender, isSale, colorId, sizeId, minPrice, maxPrice, sortBy, search, line],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (style) params.append('style', style);
      if (gender) params.append('gender', gender);
      if (isSale) params.append('isSale', isSale);
      if (colorId) params.append('colorId', colorId);
      if (sizeId) params.append('sizeId', sizeId);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (search) params.append('search', search);
      if (line) params.append('line', line);

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    },
  });

  const handleClearFilters = () => {
    router.push('/products');
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 w-full flex-1 flex flex-col">
      {/* 1. Header Toolbar */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase text-neutral-900 tracking-tight flex items-baseline gap-2">
            Danh mục sản phẩm
            {products && (
              <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                {products.length} sản phẩm
              </span>
            )}
          </h1>
          {search && (
            <p className="text-xs text-neutral-400 mt-1 font-light">
              Kết quả tìm kiếm cho từ khóa: <strong className="text-orange-500 font-bold">"{search}"</strong>
            </p>
          )}
        </div>

        {/* Sort and Filters helper */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 bg-white border border-neutral-200 rounded-full px-4 py-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ lọc</span>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => updateUrl({ sortBy: e.target.value })}
              className="appearance-none bg-white border border-neutral-200 rounded-full px-5 py-2 pr-10 text-xs font-bold text-neutral-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. Main content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* left sidebar: Filters */}
        <aside className="lg:col-span-1 bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm sticky top-24">
          <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-black uppercase text-neutral-900 tracking-wider">Lọc sản phẩm</h3>
            {(style || gender || isSale || colorId || sizeId || minPrice || maxPrice || search || line) && (
              <button
                onClick={handleClearFilters}
                className="text-[10px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-widest cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Style Filter */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Kiểu dáng</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Low Top (Cổ thấp)', value: 'low-top' },
                { label: 'High Top (Cổ cao)', value: 'high-top' },
                { label: 'Slip-on (Giày lười)', value: 'slip-on' },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style === item.value}
                    onChange={() => updateUrl({ style: style === item.value ? null : item.value })}
                    className="accent-orange-500 rounded border-neutral-300"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Line Filter */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Dòng sản phẩm</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Basas', value: 'basas' },
                { label: 'Vintas', value: 'vintas' },
                { label: 'Urbas', value: 'urbas' },
                { label: 'Track 6', value: 'track 6' },
                { label: 'Pattas', value: 'pattas' },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={line.toLowerCase() === item.value}
                    onChange={() => updateUrl({ line: line.toLowerCase() === item.value ? null : item.value })}
                    className="accent-orange-500 rounded border-neutral-300"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Giới tính</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Nam', value: 'men' },
                { label: 'Nữ', value: 'women' },
                { label: 'Unisex', value: 'unisex' },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gender === item.value}
                    onChange={() => updateUrl({ gender: gender === item.value ? null : item.value })}
                    className="accent-orange-500 rounded border-neutral-300"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sale Filter */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Khuyến mãi</h4>
            <label className="flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isSale === 'true'}
                onChange={() => updateUrl({ isSale: isSale === 'true' ? null : 'true' })}
                className="accent-red-500 rounded border-neutral-300"
              />
              <span>Sản phẩm Sale-off</span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Khoảng giá</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Dưới 300k', min: '', max: '300000' },
                { label: '300k - 600k', min: '300000', max: '600000' },
                { label: '600k - 1 triệu', min: '600000', max: '1000000' },
                { label: 'Trên 1 triệu', min: '1000000', max: '' },
              ].map((range, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={minPrice === range.min && maxPrice === range.max}
                    onChange={() => {
                      if (minPrice === range.min && maxPrice === range.max) {
                        updateUrl({ minPrice: null, maxPrice: null });
                      } else {
                        updateUrl({ minPrice: range.min, maxPrice: range.max });
                      }
                    }}
                    className="accent-orange-500 rounded border-neutral-300"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          {colors && colors.length > 0 && (
            <div className="mb-6 pb-6 border-b border-neutral-100">
              <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Màu sắc</h4>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateUrl({ colorId: colorId === String(color.id) ? null : String(color.id) })}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 relative ${
                      colorId === String(color.id)
                        ? 'border-neutral-900 ring-2 ring-orange-500/40 scale-110'
                        : 'border-neutral-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hexCode }}
                    title={color.name}
                  >
                    {colorId === String(color.id) && (
                      <Check
                        className={`w-3.5 h-3.5 font-bold ${
                          color.hexCode.toUpperCase() === '#FFFFFF' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes Filter */}
          {sizes && sizes.length > 0 && (
            <div className="mb-2">
              <h4 className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider mb-3">Kích thước (Size)</h4>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateUrl({ sizeId: sizeId === String(size.id) ? null : String(size.id) })}
                    className={`border text-[11px] font-bold py-2 rounded transition-all duration-200 flex items-center justify-center ${
                      sizeId === String(size.id)
                        ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-600'
                    }`}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Section: Products list */}
        <section className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              <span className="text-xs font-semibold text-neutral-400">Đang tìm sản phẩm phù hợp...</span>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="bg-neutral-50 rounded-2xl py-20 px-6 text-center border border-neutral-100 flex flex-col items-center gap-4">
              <HelpCircle className="w-10 h-10 text-neutral-400 animate-pulse" />
              <h3 className="text-base font-bold text-neutral-800 uppercase">Không tìm thấy sản phẩm!</h3>
              <p className="text-xs text-neutral-400 max-w-sm font-light">
                Hãy thử nới lỏng các điều kiện lọc hoặc quay lại danh mục sản phẩm mặc định.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-neutral-900 text-white text-xs font-extrabold px-6 py-2.5 rounded-full hover:bg-orange-500 transition duration-300 shadow-md"
              >
                VỀ TRANG CATALOG CHÍNH
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryImage = product.images.find((img) => img.isPrimary)?.url || '/images/images.jpg';
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-neutral-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-orange-200 group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                      {product.isSale && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white font-extrabold text-[10px] tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                          -{product.discountPercent}%
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="bg-white hover:bg-orange-500 hover:text-white text-neutral-900 p-3 rounded-full transition shadow-md hover:scale-110"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Content */}
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
          )}
        </section>
      </div>
    </div>
  );
}

export default function ProductsCatalog() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 gap-3 w-full flex-1">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-xs font-semibold text-neutral-400">Đang khởi tạo danh mục...</span>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
