'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, Shield, Award, Mail } from 'lucide-react';

// Inline SVG social icons (lucide-react doesn't include brand icons)
const FacebookIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-sm border-t border-neutral-800">
      {/* 1. Pre-Footer Brand Statement */}
      <section className="bg-neutral-950 py-6 border-b border-neutral-800/50 px-4 md:px-12 text-center text-xs tracking-wider font-semibold text-neutral-500 uppercase">
        ANANAS - DISCOVER YOU - CHẤT RIÊNG TRONG TỪNG BƯỚC ĐI
      </section>

      {/* 2. Main Footer Grid */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: PRODUCT LISTING */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold tracking-wider text-base border-b-2 border-orange-500 pb-2 w-fit">
            SẢN PHẨM
          </h3>
          <ul className="flex flex-col gap-2.5 text-neutral-400">
            <li>
              <Link href="/products?gender=men" className="hover:text-orange-500 transition duration-150">
                Giày Nam
              </Link>
            </li>
            <li>
              <Link href="/products?gender=women" className="hover:text-orange-500 transition duration-150">
                Giày Nữ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-orange-500 transition duration-150">
                Thời trang &amp; Phụ kiện
              </Link>
            </li>
            <li>
              <Link href="/products?isSale=true" className="hover:text-red-400 transition duration-150">
                Sale-off
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: CORPORATE PAGES */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold tracking-wider text-base border-b-2 border-orange-500 pb-2 w-fit">
            VỀ CÔNG TY
          </h3>
          <ul className="flex flex-col gap-2.5 text-neutral-400">
            <li>
              <Link href="/careers" className="hover:text-orange-500 transition duration-150">
                Dứa tuyển dụng
              </Link>
            </li>
            <li>
              <Link href="/franchise" className="hover:text-orange-500 transition duration-150">
                Liên hệ nhượng quyền
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-500 transition duration-150">
                Về Ananas
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: HELP & SUPPORT */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold tracking-wider text-base border-b-2 border-orange-500 pb-2 w-fit">
            HỖ TRỢ
          </h3>
          <ul className="flex flex-col gap-2.5 text-neutral-400">
            <li>
              <Link href="/faqs" className="hover:text-orange-500 transition duration-150 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-neutral-500" /> FAQs
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-orange-500 transition duration-150 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-neutral-500" /> Bảo mật thông tin
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-orange-500 transition duration-150 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-neutral-500" /> Chính sách chung
              </Link>
            </li>
            <li>
              <Link href="/orders/lookup" className="hover:text-orange-500 transition duration-150 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-neutral-500" /> Tra cứu đơn hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: SOCIAL CHANNELS */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold tracking-wider text-base border-b-2 border-orange-500 pb-2 w-fit">
            ANANAS SOCIAL
          </h3>
          <div className="flex flex-col gap-3">
            <a href="https://www.facebook.com/Ananas.vietnam/" target="_blank" rel="noopener noreferrer"
              className="hover:text-orange-500 transition duration-150 flex items-center gap-2 group">
              <span className="p-1.5 bg-neutral-800 rounded group-hover:bg-blue-600 transition duration-300">
                <FacebookIcon />
              </span>
              FACEBOOK
            </a>
            <a href="https://www.instagram.com/ananasvn/" target="_blank" rel="noopener noreferrer"
              className="hover:text-orange-500 transition duration-150 flex items-center gap-2 group">
              <span className="p-1.5 bg-neutral-800 rounded group-hover:bg-pink-600 transition duration-300">
                <InstagramIcon />
              </span>
              INSTAGRAM
            </a>
            <a href="https://www.youtube.com/discoveryou" target="_blank" rel="noopener noreferrer"
              className="hover:text-orange-500 transition duration-150 flex items-center gap-2 group">
              <span className="p-1.5 bg-neutral-800 rounded group-hover:bg-red-600 transition duration-300">
                <YoutubeIcon />
              </span>
              YOUTUBE
            </a>
          </div>
        </div>
      </section>

      {/* 3. Bottom Copy Bar */}
      <section className="border-t border-neutral-800/80 py-6 px-4 md:px-12 text-xs text-neutral-500 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 WebbangiayAnanas Clone. Built with Next.js, NestJS and PostgreSQL.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-orange-500 transition duration-150">Bảo mật</Link>
            <Link href="/terms" className="hover:text-orange-500 transition duration-150">Điều khoản</Link>
            <Link href="/sitemap" className="hover:text-orange-500 transition duration-150">Sitemap</Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
