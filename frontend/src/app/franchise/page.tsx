'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, DollarSign, Calculator, Send, CheckCircle2, TrendingUp, Key, Layers, Building2 } from 'lucide-react';

export default function FranchisePage() {
  // Slider states
  const [capital, setCapital] = useState<number>(1200000000); // 1.2 billion VNĐ
  const [size, setSize] = useState<number>(90); // 90m2

  // Calculated ROI states
  const [setupCost, setSetupCost] = useState<number>(0);
  const [estMonthlyRevenue, setEstMonthlyRevenue] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(18); // 18% net margin
  const [paybackPeriod, setPaybackPeriod] = useState<number>(0);

  // Form states
  const [partnerName, setPartnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [desiredLocation, setDesiredLocation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ROI Calculator core logic simulator
  useEffect(() => {
    // 1. Setup cost depends heavily on store size (average 7 million VNĐ per m2 for fitout + franchise fee of 200 million VNĐ + initial inventory buffer of 400M)
    const fitoutCost = size * 6500000;
    const franchiseFee = 150000000;
    const inventoryBuffer = Math.min(Math.max(size * 4500000, 300000000), 800000000);
    const calculatedSetup = fitoutCost + franchiseFee + inventoryBuffer;
    setSetupCost(calculatedSetup);

    // 2. Monthly revenue simulation based on size (shoe store density sells avg 3.5M - 7M VNĐ/m2/month depending on capital buffer)
    const revenuePerM2 = 5000000 + (capital / 2000000000) * 1500000;
    const rawRevenue = size * revenuePerM2;
    setEstMonthlyRevenue(rawRevenue);

    // 3. Net profit margin rises with scale (between 15% and 22% due to operational efficiencies)
    const margin = 14 + Math.min(6, (size / 200) * 6) + (capital > 1500000000 ? 2 : 0);
    setProfitMargin(margin);

    // 4. Payback period in months = Setup cost / (monthly revenue * profit margin)
    const monthlyNetProfit = rawRevenue * (margin / 100);
    const months = calculatedSetup / monthlyNetProfit;
    setPaybackPeriod(Math.round(months * 10) / 10);
  }, [capital, size]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !email || !phone || !desiredLocation) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleResetForm = () => {
    setPartnerName('');
    setEmail('');
    setPhone('');
    setDesiredLocation('');
    setMessage('');
    setSuccess(false);
  };

  const formatVnd = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 font-sans flex-1">
      {/* 1. Slogan Banner */}
      <section className="py-24 relative overflow-hidden border-b border-neutral-900 bg-[radial-gradient(circle_at_center,rgba(255,95,0,0.1)_0%,transparent_65%)]">
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          <span className="text-orange-500 font-black uppercase text-[10px] tracking-widest block mb-4">
            Cơ hội Hợp tác Kinh doanh Bền vững
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6">
            LIÊN HỆ NHƯỢNG QUYỀN
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto font-light leading-relaxed">
            Ananas tự hào là một trong những thương hiệu Sneakers nội địa hàng đầu với tệp khách hàng trẻ trung, trung thành và chuỗi cung ứng được tối ưu hóa tối đa. Hãy đồng hành cùng chúng tôi mở rộng dấu ấn thời trang lưu hóa.
          </p>
        </div>
      </section>

      {/* 2. Core Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8">
            <TrendingUp className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-base font-bold uppercase text-white mb-3">Tốc độ Tăng trưởng Cao</h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Tệp khách hàng Gen Z và Millennials liên tục săn đón các bộ sưu tập mới. Tỉ lệ quay lại mua hàng vượt trội giúp duy trì doanh thu điểm bán ổn định.
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8">
            <Layers className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-base font-bold uppercase text-white mb-3">Hỗ trợ Vận hành Toàn diện</h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Chúng tôi đồng hành cùng đối tác từ khâu khảo sát mặt bằng, cung cấp bản vẽ thiết kế Visual Merchandising, đào tạo nhân sự cho tới hệ thống POS bán hàng.
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8">
            <Key className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-base font-bold uppercase text-white mb-3">Chuỗi Cung ứng Tối ưu</h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Quy trình sản xuất chủ động từ nhà máy cao su lưu hóa quy mô lớn đảm bảo nguồn cung dồi dào, biên lợi nhuận nhập hàng lý tưởng cho đại lý nhượng quyền.
            </p>
          </div>
        </div>

        {/* 3. Interactive ROI & Investment Payback Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Sliders Pane */}
          <div className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4">
              <Calculator className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-extrabold uppercase text-white tracking-wider">
                MÔ PHỎNG ĐẦU TƯ & ROI TƯƠNG TÁC
              </h3>
            </div>

            <p className="text-xs text-neutral-400 font-light mb-8">
              Kéo các thanh trượt bên dưới để cấu hình mức vốn dự kiến và diện tích cửa hàng mong muốn. Hệ thống sẽ tự động tính toán tổng quát các chỉ số tài chính sơ bộ.
            </p>

            {/* Capital Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold uppercase text-neutral-400">Vốn Đầu Tư Ước Tính:</span>
                <span className="text-lg font-black text-orange-500 font-mono">{formatVnd(capital)}</span>
              </div>
              <input
                type="range"
                min={800000000}
                max={3000000000}
                step={50000000}
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full accent-orange-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold mt-1">
                <span>800 TRIỆU</span>
                <span>1.5 TỶ</span>
                <span>3 TỶ VNĐ</span>
              </div>
            </div>

            {/* Sizing Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold uppercase text-neutral-400">Diện Tích Mặt Bằng (m²):</span>
                <span className="text-lg font-black text-orange-500 font-mono">{size} m²</span>
              </div>
              <input
                type="range"
                min={60}
                max={200}
                step={5}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-orange-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold mt-1">
                <span>60 m²</span>
                <span>120 m²</span>
                <span>200 m²</span>
              </div>
            </div>

            {/* Criteria Box */}
            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3.5 items-start">
              <Building2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold uppercase text-white mb-1">TIÊU CHUẨN MẶT BẰNG ANANAS</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 leading-normal font-light">
                  Mặt tiền tối thiểu 6m tại trục đường mua sắm sầm uất hoặc góc ngã tư khu đông dân cư. Không nằm liền kề các đối thủ cạnh tranh trực tiếp trong bán kính 500m.
                </p>
              </div>
            </div>
          </div>

          {/* Outputs Financial Dashboard */}
          <div className="lg:col-span-5 flex flex-col justify-center h-full">
            <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-orange-500/10 text-orange-500 px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-bl-2xl">
                DỰ TOÁN TÀI CHÍNH SƠ BỘ
              </div>

              <div className="space-y-6 mt-4">
                {/* Outflow fitout cost */}
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                    CHI PHÍ SETUP CỬA HÀNG (ƯỚC TÍNH)
                  </span>
                  <span className="text-xl font-black text-white font-mono">
                    {formatVnd(setupCost)}
                  </span>
                  <span className="text-[10px] text-neutral-500 block font-light mt-0.5">
                    (Đã gồm Phí nhượng quyền + Thiết kế thi công + Lô hàng đầu tiên)
                  </span>
                </div>

                {/* Simulated revenue */}
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                    DOANH THU THÁNG MÔ PHỎNG
                  </span>
                  <span className="text-xl font-black text-orange-500 font-mono">
                    {formatVnd(estMonthlyRevenue)}
                  </span>
                </div>

                {/* Net margin ratio */}
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                    BIÊN LỢI NHUẬN RÒNG DỰ KIẾN
                  </span>
                  <span className="text-lg font-black text-white font-mono">
                    {profitMargin.toFixed(1)}%
                  </span>
                </div>

                {/* Payback period */}
                <div className="pt-6 border-t border-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-0.5">
                      THỜI GIAN HOÀN VỐN DỰ KIẾN
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {paybackPeriod} <span className="text-sm font-light text-neutral-400">Tháng</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Franchise Partnership Inquiry Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-black uppercase text-center text-white tracking-wider mb-8">
              GỬI YÊU CẦU ĐĂNG KÝ HỢP TÁC
            </h3>

            {success ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-white uppercase mb-2">
                  Gửi yêu cầu nhượng quyền thành công!
                </h4>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto leading-relaxed mb-6">
                  Cảm ơn quý đối tác đã quan tâm tới việc phát triển chuỗi thương hiệu Ananas. Đội ngũ Phát triển Thị trường của chúng tôi đã nhận được thông tin khảo sát sơ bộ và sẽ liên hệ trực tiếp qua số điện thoại để trao đổi chuyên sâu trong vòng 2 ngày làm việc.
                </p>
                <button
                  onClick={handleResetForm}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition duration-300"
                >
                  GỬI YÊU CẦU MỚI
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Partner name field */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                    Họ và tên đối tác *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn B"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                      Email liên hệ *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="partner@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                      Số điện thoại di động *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                {/* Planning location */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                    Khu vực mong muốn hợp tác nhượng quyền *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Quận 1 TP.HCM, Quận Cầu Giấy Hà Nội, v.v."
                    value={desiredLocation}
                    onChange={(e) => setDesiredLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                {/* Additional context message */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                    Thông tin thêm về năng lực kinh doanh / mặt bằng có sẵn
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Mô tả tóm tắt kinh nghiệm kinh doanh, thông tin mặt bằng có sẵn của bạn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-800 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi thông tin liên hệ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>GỬI YÊU CẦU HỢP TÁC ĐẦU TƯ</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
