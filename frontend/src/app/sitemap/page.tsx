'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  ShoppingBag, 
  User, 
  HelpCircle, 
  Info, 
  ArrowRight, 
  Map, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  Shield,
  Briefcase
} from 'lucide-react';

interface SitemapNode {
  title: string;
  path: string;
  desc: string;
}

interface SitemapCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  nodes: SitemapNode[];
}

export default function SitemapPage() {
  const categories: SitemapCategory[] = [
    {
      title: 'MUA SẮM & CATALOG',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'from-orange-500 to-amber-500',
      nodes: [
        { title: 'Giày Nam', path: '/products?gender=men', desc: 'Sneakers Basas, Vintas, Urbas, Track 6 phối màu nam tính.' },
        { title: 'Giày Nữ', path: '/products?gender=women', desc: 'Các thiết kế streetwear tôn dáng, thanh lịch dành cho nữ.' },
        { title: 'Thời trang & Phụ kiện', path: '/products', desc: 'Áo thun Graphic, tất dệt, balo dứa và dây giày bền bỉ.' },
        { title: 'Chương trình Sale-off', path: '/products?isSale=true', desc: 'Các đợt xả hàng và ưu đãi đặc quyền với mức giá giảm sâu.' },
      ]
    },
    {
      title: 'HỖ TRỢ KHÁCH HÀNG',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500',
      nodes: [
        { title: 'Câu hỏi thường gặp (FAQs)', path: '/faqs', desc: 'Giải đáp nhanh về size giày, đổi trả, bảo hành và giao nhận hàng.' },
        { title: 'Tra cứu đơn hàng', path: '/orders/lookup', desc: 'Theo dõi hành trình vận đơn trực tiếp qua mã đơn mua hàng.' },
        { title: 'Bảo mật thông tin', path: '/privacy', desc: 'Chính sách thu thập dữ liệu cá nhân và bảo mật giao dịch trực tuyến.' },
        { title: 'Chính sách chung', path: '/terms', desc: 'Quy trình đổi trả hàng 1-1 và bảo hành keo chỉ 6 tháng.' },
      ]
    },
    {
      title: 'THƯƠNG HIỆU ANANAS',
      icon: <Info className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      nodes: [
        { title: 'Về Ananas', path: '/about', desc: 'Tìm hiểu về triết lý chế tác và sơ đồ giải phẫu giày tương tác cao cấp.' },
        { title: 'Dứa tuyển dụng', path: '/careers', desc: 'Khám phá văn hóa làm việc và nộp hồ sơ CV ứng tuyển lập tức.' },
        { title: 'Liên hệ nhượng quyền', path: '/franchise', desc: 'Bảng tính ROI tài chính & tiêu chí đồng hành nhượng quyền đại lý.' },
      ]
    },
    {
      title: 'TÀI KHOẢN & KHÔNG GIAN RIÊNG',
      icon: <User className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      nodes: [
        { title: 'Đăng nhập hệ thống', path: '/login', desc: 'Đăng nhập tài khoản mua sắm và xác thực bảo mật 2 lớp 2FA.' },
        { title: 'Đăng ký thành viên', path: '/register', desc: 'Tham gia cộng đồng Ananas để nhận ưu đãi đặc quyền.' },
        { title: 'Giỏ hàng của tôi', path: '/cart', desc: 'Xem danh sách sản phẩm chờ mua và chỉnh sửa nhanh số lượng.' },
        { title: 'Tiến hành thanh toán', path: '/checkout', desc: 'Điền thông tin và thanh toán COD nhanh chóng bảo mật.' },
      ]
    }
  ];

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 font-sans flex-1">
      {/* 1. Dynamic Hero Banner */}
      <section className="bg-neutral-900 border-b border-neutral-900 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,95,0,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
              <Compass className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">
                Sơ Đồ Trang Web
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                SITEMAP CỦA ANANAS
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-light leading-relaxed">
            Duyệt nhanh qua sơ đồ cấu trúc của toàn bộ trang web để tìm kiếm sản phẩm, bài viết giới thiệu thương hiệu và các công cụ tra cứu hỗ trợ khách hàng nhanh chóng.
          </p>
        </div>
      </section>

      {/* 2. Visual Sitemap Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 hover:border-neutral-850 transition-all duration-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-black tracking-wider uppercase text-white">
                    {cat.title}
                  </h3>
                </div>

                {/* Nodes List */}
                <div className="space-y-4">
                  {cat.nodes.map((node, nodeIdx) => (
                    <Link 
                      key={nodeIdx} 
                      href={node.path}
                      className="group flex gap-4 p-4 rounded-2xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-200 text-left items-start"
                    >
                      <div className="w-6 h-6 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition duration-200 flex-shrink-0 mt-0.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-200 group-hover:text-orange-500 transition duration-200">
                          {node.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-light mt-1 leading-relaxed">
                          {node.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pre-footer Interactive Help */}
      <section className="max-w-7xl mx-auto pb-16 px-4 md:px-8">
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-8 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[9px] font-extrabold uppercase text-orange-500 tracking-widest block">
              Hệ thống bán hàng trực tuyến
            </span>
            <h3 className="text-xl font-black uppercase text-white tracking-tight">
              Bạn Cần Hỗ Trợ Đặt Giày Ngay Lập Tức?
            </h3>
            <p className="text-xs text-neutral-400 font-light max-w-lg leading-relaxed">
              Nếu bạn không tìm thấy phối màu mong muốn hoặc gặp sự cố khi lựa chọn size giày, bộ phận CSKH của chúng tôi sẵn sàng đồng hành cùng bạn qua đường dây nóng.
            </p>
          </div>
          <a 
            href="tel:19001234"
            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-8 py-3.5 rounded-xl uppercase tracking-widest text-xs transition duration-300 shadow-md hover:shadow-lg flex-shrink-0"
          >
            Liên Hệ 1900 1234
          </a>
        </div>
      </section>
    </div>
  );
}
