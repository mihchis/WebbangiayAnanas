'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { Search, ShoppingBag, Heart, MapPin, ClipboardList, LogIn, User, LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, clearAuth } = useUserStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    // Clean auth state
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="w-full z-50 sticky top-0 shadow-sm bg-white/95 backdrop-blur-md">
      {/* 1. Top Sub-header Bar */}
      <section className="bg-neutral-800 text-neutral-300 text-xs py-2 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-6">
          <Link href="/orders/lookup" className="hover:text-white transition flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" />
            Tra cứu đơn hàng
          </Link>
          <a
            href="https://goo.gl/maps/fGVtA5FVoMZFDd5d7"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            Tìm cửa hàng
          </a>
          <Link href="/favorites" className="hover:text-white transition flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-neutral-400 hover:text-red-500" />
            Yêu thích
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-orange-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Hi, {user.firstName || user.email.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-white transition flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              Đăng nhập
            </Link>
          )}
        </div>
      </section>

      {/* 2. Main Navigation Header */}
      <section className="border-b border-neutral-100 py-4 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand Logo */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-orange-500 tracking-wider transition group-hover:scale-105 duration-300">
                ANANAS
              </span>
              <span className="text-xs bg-neutral-900 text-white font-bold px-1.5 py-0.5 rounded">
                CLONE
              </span>
            </Link>
          </div>

          {/* Nav Categories */}
          <nav className="flex items-center gap-8 font-bold text-sm tracking-wide text-neutral-800">
            <Link href="/products" className="hover:text-orange-500 transition duration-200">
              SẢN PHẨM
            </Link>
            <Link href="/products?gender=men" className="hover:text-orange-500 transition duration-200">
              NAM
            </Link>
            <Link href="/products?gender=women" className="hover:text-orange-500 transition duration-200">
              NỮ
            </Link>
            <Link href="/products?isSale=true" className="text-red-500 hover:text-red-600 transition duration-200">
              SALE OFF
            </Link>
          </nav>

          {/* Search bar and Cart */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-10 py-1.5 border border-neutral-300 rounded-full text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all bg-neutral-50"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <Link href="/cart" className="relative p-2 bg-neutral-50 hover:bg-neutral-100 rounded-full transition group">
              <ShoppingBag className="w-5 h-5 text-neutral-700 group-hover:text-orange-500 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </section>
    </header>
  );
}
