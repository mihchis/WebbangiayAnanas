'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Lock, Globe, Mail, Landmark } from 'lucide-react';

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    id: 'collect-info',
    title: '1. Thu thập thông tin cá nhân',
    content: (
      <>
        <p className="mb-4">
          Khi bạn mua sắm tại Ananas hoặc đăng ký tài khoản trên website của chúng tôi, chúng tôi thu thập các thông tin cần thiết để phục vụ đơn hàng bao gồm: Họ tên, địa chỉ nhận hàng, số điện thoại liên hệ, email cá nhân và danh sách sản phẩm trong giỏ hàng.
        </p>
        <p className="mb-4">
          Hệ thống cũng tự động thu thập các dữ liệu phi cá nhân thông qua Cookies để tối ưu hóa trải nghiệm lướt web của bạn như: Địa chỉ IP, loại trình duyệt, thời gian truy cập các sản phẩm giày Basas, Vintas, Urbas, Track 6.
        </p>
        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3.5 items-start mt-6">
          <Globe className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-400 font-light leading-normal">
            Chúng tôi cam kết tuyệt đối không lưu trữ thông tin nhạy cảm của khách hàng như tài khoản ngân hàng, mật mã thẻ tín dụng. Các giao dịch được chuyển xử lý qua cổng thanh toán bảo mật liên kết.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'purpose-use',
    title: '2. Phạm vi và mục đích sử dụng',
    content: (
      <>
        <p className="mb-4">
          Mọi thông tin cá nhân thu thập từ khách hàng được Ananas sử dụng cho các mục đích chính đáng sau đây:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Xử lý & Giao nhận đơn hàng:</strong> Xác thực thông tin người mua, chuẩn bị đóng gói sản phẩm và cung cấp dữ liệu định tuyến cho các đối tác giao hàng nhanh.</li>
          <li><strong>Hỗ trợ khách hàng:</strong> Giải quyết các khiếu nại, hỗ trợ chính sách đổi trả hàng 1-1 trong vòng 7 ngày và chính sách bảo hành keo chỉ 6 tháng.</li>
          <li><strong>Cá nhân hóa trải nghiệm:</strong> Đề xuất các sản phẩm giày phù hợp với giới tính, phong cách và thói quen tìm kiếm của bạn.</li>
          <li><strong>Khuyến mãi & Tiếp thị:</strong> Gửi thông tin về các bộ sưu tập giày Sneaker mới, ưu đãi sale-off đặc quyền (nếu được khách hàng chấp thuận đăng ký).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'security-payment',
    title: '3. Bảo mật giao dịch trực tuyến',
    content: (
      <>
        <p className="mb-4">
          Website Ananas được trang bị các tiêu chuẩn bảo mật dữ liệu công nghiệp bao gồm chứng chỉ số SSL mã hóa luồng truyền dữ liệu từ trình duyệt tới máy chủ.
        </p>
        <p className="mb-4">
          Hệ thống xác thực đăng nhập sử dụng công nghệ mã hóa password bằng thuật toán **bcrypt** băm một chiều ở tầng cơ sở dữ liệu PostgreSQL. Các phiên làm việc được quản lý và thu hồi phiên động qua Redis cache tốc độ cao, ngăn chặn nguy cơ tấn công chiếm quyền điều khiển phiên (session hijacking).
        </p>
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex gap-3.5 items-start mt-6">
          <Lock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white mb-1">MÃ HÓA KẾT NỐI (SSL/TLS)</h5>
            <p className="text-xs text-neutral-400 font-light leading-normal">
              Toàn bộ đường truyền API mua sắm, thanh toán, điền thông tin đơn hàng đều được mã hóa tự động để đảm bảo dữ liệu không bị nghe lén bởi bên thứ ba.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'rights-obligations',
    title: '4. Quyền lợi và trách nhiệm',
    content: (
      <>
        <p className="mb-4">
          Khách hàng có quyền truy cập vào thông tin cá nhân của mình bất kỳ lúc nào để tự điều chỉnh hoặc cập nhật địa chỉ giao hàng và thông tin liên lạc trong trang cá nhân.
        </p>
        <p className="mb-4">
          Bạn cũng có quyền yêu cầu Ananas ngừng sử dụng thông tin tiếp thị hoặc tiến hành xóa bỏ vĩnh viễn tài khoản mua sắm của mình bằng cách liên hệ bộ phận hỗ trợ khách hàng.
        </p>
        <p className="mb-4 font-light">
          Trách nhiệm của khách hàng là bảo mật tài khoản đăng nhập của mình, tuyệt đối không tiết lộ mật khẩu hoặc mã OTP 2FA cho người khác để tránh tổn hại đơn hàng.
        </p>
      </>
    ),
  },
  {
    id: 'contact-info',
    title: '5. Thông tin đơn vị vận hành & Liên hệ',
    content: (
      <>
        <p className="mb-6">
          Mọi thắc mắc, yêu cầu chỉnh sửa hoặc khiếu nại liên quan tới chính sách bảo mật thông tin cá nhân vui lòng gửi trực tiếp tới văn phòng đại diện của Ananas:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex gap-3.5">
            <Landmark className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-extrabold text-white uppercase mb-1">CÔNG TY CỔ PHẦN ANANAS VIỆT NAM</h5>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                Địa chỉ: 123 Nguyễn Trọng Tuyển, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex gap-3.5">
            <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-extrabold text-white uppercase mb-1">BỘ PHẬN CHĂM SÓC KHÁCH HÀNG</h5>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                Email: cskh@ananas.vn<br />
                Hotline: 1900 1234 (8:00 - 17:00 từ Thứ 2 tới Thứ 6)
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  const [activeSectionId, setActiveSectionId] = useState<string>(policySections[0].id);

  // Auto-spy scroll event to update active TOC bullet
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;

      for (const section of policySections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTocClick = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.offsetTop - 120;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 font-sans flex-1">
      {/* 1. Header Banner */}
      <section className="bg-neutral-900 border-b border-neutral-900 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,95,0,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">
                Pháp Lý & Bảo Mật
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                BẢO MẬT THÔNG TIN
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-bold uppercase mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Cập nhật lần cuối: 21 tháng 05, 2026
            </span>
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <section className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Table of Contents */}
          <aside className="lg:col-span-4 bg-neutral-900 border border-neutral-850 rounded-3xl p-6 sticky top-28 shadow-xl hidden lg:block">
            <h3 className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider mb-4 border-b border-neutral-800 pb-3">
              MỤC LỤC CHI TIẾT
            </h3>
            <nav className="flex flex-col gap-2">
              {policySections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleTocClick(sec.id)}
                  className={`text-left text-xs py-2 px-4 rounded-xl transition duration-200 cursor-pointer font-bold ${
                    activeSectionId === sec.id
                      ? 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500 pl-3'
                      : 'text-neutral-400 hover:bg-neutral-850 hover:text-white pl-4'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-12">
            {policySections.map((sec) => (
              <article
                id={sec.id}
                key={sec.id}
                className="bg-neutral-900/30 border border-neutral-900 rounded-3xl p-8 hover:border-neutral-850 transition duration-300 shadow-xs"
              >
                <h3 className="text-lg sm:text-xl font-extrabold uppercase text-white mb-6 border-b border-neutral-800 pb-3">
                  {sec.title}
                </h3>
                <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {sec.content}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
