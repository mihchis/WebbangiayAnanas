'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useCartStore } from '@/store/useCartStore';
import {
  ShoppingCart, Heart, Star, StarHalf, Check, ChevronLeft,
  ChevronRight, Truck, RotateCcw, ShieldCheck, Package, RefreshCw, ArrowLeft
} from 'lucide-react';

interface ProductVariant {
  id: string;
  stock: number;
  color: { id: number; name: string; hexCode: string };
  size: { id: number; value: string };
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  color?: { id: number; name: string };
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number;
  isSale: boolean;
  discountPercent: number;
  style: string;
  gender: string;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const addItem = useCartStore((s) => s.addItem);

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 w-full">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-xs font-semibold text-neutral-400">Đang tải thông tin sản phẩm...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 w-full">
        <span className="text-5xl">😕</span>
        <h2 className="text-base font-bold text-neutral-700">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay về danh sách
        </Link>
      </div>
    );
  }

  // Derived data
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color.id, v.color])).values()
  );
  const sizes = Array.from(
    new Map(product.variants.map((v) => [v.size.id, v.size])).values()
  ).sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

  const selectedVariant = selectedColorId !== null && selectedSizeId !== null
    ? product.variants.find((v) => v.color.id === selectedColorId && v.size.id === selectedSizeId)
    : null;

  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true;

  // Images: filter by selected color or show all
  const displayImages = selectedColorId
    ? product.images.filter((img) => !img.color || img.color.id === selectedColorId)
    : product.images;

  const currentImages = displayImages.length > 0 ? displayImages : product.images;
  const mainImage = currentImages[currentImageIndex]?.url || '/images/images.jpg';

  const handleAddToCart = () => {
    if (!selectedSizeId) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    if (!selectedColorId) {
      // auto select first color
      const firstColor = colors[0];
      if (firstColor) setSelectedColorId(firstColor.id);
      return;
    }
    if (!selectedVariant) return;

    const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || '/images/images.jpg';
    const color = colors.find((c) => c.id === selectedColorId) || colors[0];
    const size = sizes.find((s) => s.id === selectedSizeId) || sizes[0];

    addItem({
      productVariantId: selectedVariant.id,
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        isSale: product.isSale,
        style: product.style,
        gender: product.gender,
      },
      color: { id: color.id, name: color.name, hexCode: color.hexCode },
      size: { id: size.id, value: size.value },
      image: primaryImage,
    }, quantity);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const styleLabel: Record<string, string> = {
    'low-top': 'Low Top (Cổ thấp)',
    'high-top': 'High Top (Cổ cao)',
    'slip-on': 'Slip-on (Giày lười)',
  };
  const genderLabel: Record<string, string> = {
    men: 'Nam', women: 'Nữ', unisex: 'Unisex',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] font-semibold text-neutral-400 mb-8">
        <Link href="/" className="hover:text-orange-500 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-500 transition">Sản phẩm</Link>
        <span>/</span>
        <span className="text-neutral-700 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image Viewer */}
          <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden group">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isSale && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-extrabold text-xs tracking-widest px-3 py-1 rounded-full shadow">
                -{product.discountPercent}% OFF
              </span>
            )}
            {/* Prev/Next buttons for gallery */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-orange-500 hover:text-white text-neutral-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-orange-500 hover:text-white text-neutral-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {currentImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {currentImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    idx === currentImageIndex
                      ? 'border-orange-500 scale-105 shadow-md'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          {/* Title block */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
              SKU: {product.sku}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-neutral-900 uppercase tracking-tight mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating (decorative, matching original Detail.html) */}
            <div className="flex items-center gap-1.5 mt-3">
              {[1,2,3,4].map((i) => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
              <StarHalf className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span className="text-xs text-neutral-500 font-semibold ml-1">4.5 (5,000 đánh giá)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-orange-500">
              {formatPrice(product.price)}
            </span>
            {product.isSale && product.originalPrice && (
              <span className="text-base text-neutral-400 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-700">
                  Màu sắc
                </h3>
                {selectedColorId && (
                  <span className="text-xs text-neutral-500 font-semibold">
                    {colors.find((c) => c.id === selectedColorId)?.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => { setSelectedColorId(color.id); setCurrentImageIndex(0); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 relative ${
                      selectedColorId === color.id
                        ? 'border-neutral-900 ring-2 ring-orange-500/50 scale-110 shadow-md'
                        : 'border-neutral-200 hover:scale-105 hover:border-neutral-400'
                    }`}
                    style={{ backgroundColor: color.hexCode }}
                    title={color.name}
                  >
                    {selectedColorId === color.id && (
                      <Check className={`w-4 h-4 font-bold ${
                        color.hexCode.toUpperCase() === '#FFFFFF' ? 'text-black' : 'text-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-extrabold uppercase tracking-widest transition ${sizeError ? 'text-red-500' : 'text-neutral-700'}`}>
                {sizeError ? '⚠ Vui lòng chọn size!' : 'Kích thước (Size)'}
              </h3>
              <button className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition underline">
                Hướng dẫn chọn size
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {sizes.map((size) => {
                // Check stock for this size+selected color combo
                const variantForSize = selectedColorId
                  ? product.variants.find((v) => v.size.id === size.id && v.color.id === selectedColorId)
                  : product.variants.find((v) => v.size.id === size.id);
                const outOfStock = variantForSize ? variantForSize.stock === 0 : false;

                return (
                  <button
                    key={size.id}
                    disabled={outOfStock}
                    onClick={() => { setSelectedSizeId(size.id); setSizeError(false); }}
                    className={`border text-xs font-bold py-2.5 rounded-xl transition-all duration-200 relative ${
                      outOfStock
                        ? 'border-neutral-100 text-neutral-300 bg-neutral-50 cursor-not-allowed line-through'
                        : selectedSizeId === size.id
                        ? 'border-orange-500 bg-orange-500 text-white shadow-md scale-105'
                        : `border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700 ${sizeError ? 'border-red-200 bg-red-50' : ''}`
                    }`}
                  >
                    {size.value}
                    {outOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-neutral-300 rotate-45 block" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="flex gap-3 items-center">
            <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-neutral-600 hover:bg-neutral-100 transition font-bold text-lg leading-none"
              >
                −
              </button>
              <span className="px-5 py-3 text-sm font-bold text-neutral-900 border-x border-neutral-200 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 text-neutral-600 hover:bg-neutral-100 transition font-bold text-lg leading-none"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm uppercase tracking-wide ${
                addedToCart
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-neutral-900 hover:bg-orange-500 text-white hover:scale-[1.02]'
              }`}
            >
              {addedToCart ? (
                <><Check className="w-4 h-4" /> Đã thêm vào giỏ!</>
              ) : (
                <><ShoppingCart className="w-4 h-4" /> Thêm vào giỏ hàng</>
              )}
            </button>

            <button className="border border-neutral-200 hover:border-red-300 hover:bg-red-50 p-3.5 rounded-xl transition group">
              <Heart className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition" />
            </button>
          </div>

          {/* Delivery badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: Truck, label: 'Freeship toàn quốc', sub: 'Giao 2–5 ngày làm việc' },
              { icon: RotateCcw, label: 'Đổi trả 30 ngày', sub: 'Không cần lý do' },
              { icon: ShieldCheck, label: 'Bảo hành 6 tháng', sub: 'Lỗi nhà sản xuất' },
              { icon: Package, label: 'Double Box', sub: 'Đóng gói cẩn thận' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-2.5 bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                <Icon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">{label}</p>
                  <p className="text-[10px] text-neutral-400 font-light">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Product details info */}
          <div className="border-t border-neutral-100 pt-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-700 mb-3">
              Thông tin sản phẩm
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-light mb-4">
              {product.description}
            </p>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Kiểu dáng', styleLabel[product.style] || product.style],
                ['Giới tính', genderLabel[product.gender] || product.gender],
                ['Mã sản phẩm', product.sku],
                ['Phạm vi giao hàng', 'Toàn quốc'],
                ['Tình trạng', 'Factory New'],
                ['Đế giày', 'Rubber / Gum Sole'],
              ].map(([label, val]) => (
                <li key={label} className="bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-100">
                  <span className="text-neutral-400 block font-semibold">{label}</span>
                  <span className="text-neutral-800 font-bold">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section — static showcase */}
      <section className="border-t border-neutral-100 pt-12">
        <h2 className="text-xl font-black uppercase text-neutral-900 mb-6 tracking-tight">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { img: '/images/LuckyLukeShoes.jpg', name: 'Ananas x Lucky Luke Pattas - High Top - Blue Sunset', price: 850000 },
            { img: '/images/Doreamonshoes.jpg', name: 'Ananas x Doraemon 50 Years Pattas - White/Sunrise 50th', price: 950000 },
            { img: '/images/LuckyLukeShoes2.jpg', name: 'Ananas x Lucky Luke Pattas - High Top - Dalton Yellow', price: 850000 },
            { img: '/images/Doreamonshoes2.jpg', name: 'Ananas x Doraemon 50 Years Pattas - White/Corydalis 50th', price: 890000 },
          ].map((rel) => (
            <Link key={rel.name} href="/products" className="group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3">
                <img
                  src={rel.img}
                  alt={rel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <p className="text-xs font-bold text-neutral-800 line-clamp-2 group-hover:text-orange-500 transition">{rel.name}</p>
              <p className="text-xs font-black text-orange-500 mt-1">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rel.price)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
