'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Package } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore();

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 w-full flex flex-col items-center justify-center gap-6 flex-1">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-orange-300" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black text-neutral-800 uppercase mb-2">Giỏ hàng trống</h1>
          <p className="text-sm text-neutral-400 font-light">Hãy khám phá và thêm sản phẩm yêu thích của bạn vào đây!</p>
        </div>
        <Link
          href="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-8 py-3 rounded-full text-sm transition shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8 border-b border-neutral-100 pb-5">
        <h1 className="text-2xl font-black uppercase text-neutral-900 tracking-tight">
          Giỏ hàng
          <span className="ml-2 text-sm font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
            {getTotalItems()} sản phẩm
          </span>
        </h1>
        <Link href="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tiếp tục mua hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productVariantId}
              className="bg-white border border-neutral-100 rounded-2xl p-5 flex gap-5 hover:border-orange-100 hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail */}
              <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100">
                  <img src={item.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-1.5">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="text-sm font-bold text-neutral-900 hover:text-orange-500 transition line-clamp-2 leading-tight">
                    {item.product.name}
                  </h3>
                </Link>

                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-200 flex-shrink-0"
                      style={{ backgroundColor: item.color.hexCode }}
                    />
                    {item.color.name}
                  </span>
                  <span className="inline-flex items-center text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">
                    Size {item.size.value}
                  </span>
                  {item.product.isSale && (
                    <span className="inline-flex items-center text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      -{item.product.discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                      className="px-3 py-1.5 text-neutral-500 hover:bg-neutral-100 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold text-neutral-900 border-x border-neutral-200 min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                      className="px-3 py-1.5 text-neutral-500 hover:bg-neutral-100 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-orange-500">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productVariantId)}
                      className="text-neutral-300 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-neutral-800 mb-5 pb-4 border-b border-neutral-100">
              Tóm tắt đơn hàng
            </h2>

            <div className="flex flex-col gap-3 text-sm mb-5">
              <div className="flex justify-between text-neutral-600">
                <span className="font-semibold">Tạm tính ({getTotalItems()} sản phẩm)</span>
                <span className="font-bold">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="font-semibold">Phí vận chuyển</span>
                <span className="font-bold text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-dashed border-neutral-200 pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-neutral-900">Tổng cộng</span>
                <span className="text-xl font-black text-orange-500">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Mã giảm giá..."
                className="flex-1 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
              />
              <button className="bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-orange-500 transition">
                Áp dụng
              </button>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              Tiến hành thanh toán
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-semibold">
              <Package className="w-3.5 h-3.5" />
              Đóng gói Double Box • Giao hàng toàn quốc • Đổi trả 30 ngày
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
