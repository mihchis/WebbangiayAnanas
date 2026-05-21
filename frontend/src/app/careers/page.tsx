'use client';

import React, { useState } from 'react';
import { Briefcase, Send, ShieldAlert, FileText, CheckCircle2, ChevronDown, Award, Users, Smile } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  desc: string;
  requirements: string[];
  responsibilities: string[];
}

const openJobs: Job[] = [
  {
    id: 'designer',
    title: 'Product Designer (Thiết kế giày Vulcanized)',
    department: 'Phòng Phát triển Sản phẩm',
    location: 'TP. Hồ Chí Minh (Q. Phú Nhuận)',
    salary: 'Thỏa thuận (Cạnh tranh)',
    type: 'Full-time',
    desc: 'Chịu trách nhiệm nghiên cứu xu hướng thời trang, phác thảo và phát triển các mẫu phom dáng giày lưu hóa mới, mang đậm bản sắc bụi bặm đường phố đặc trưng của Ananas.',
    responsibilities: [
      'Nghiên cứu thị trường giày streetwear, thời trang đường phố trong và ngoài nước.',
      'Phát triển ý tưởng thiết kế, chất liệu mới (Canvas, Velvet, Corduroy, Suede) và các bản phối màu độc đáo.',
      'Làm việc cùng xưởng mẫu để tinh chỉnh phom dáng (last), thiết kế mặt đế và quy trình dán cao su.',
    ],
    requirements: [
      'Tốt nghiệp chuyên ngành Thiết kế Thời trang, Mỹ thuật công nghiệp hoặc tương đương.',
      'Có ít nhất 2 năm kinh nghiệm thiết kế giày dép hoặc phụ kiện thời trang.',
      'Sử dụng thành thạo Photoshop, Illustrator và các phần mềm vẽ phác thảo 2D/3D.',
      'Đam mê và am hiểu về văn hóa Sneakers, Streetwear.',
    ],
  },
  {
    id: 'developer',
    title: 'Full Stack Web Developer (Next.js / NestJS)',
    department: 'Phòng Công nghệ Thông tin',
    location: 'TP. Hồ Chí Minh (Q. Phú Nhuận)',
    salary: '25,000,000 - 40,000,000 VNĐ',
    type: 'Full-time',
    desc: 'Phát triển và tối ưu hóa hệ thống e-commerce bán hàng đa kênh (Omnichannel) của Ananas, từ giao diện người dùng Next.js mượt mà cho đến hệ thống backend NestJS chuyên sâu.',
    responsibilities: [
      'Xây dựng các module thanh toán, quản lý đơn hàng, bộ lọc tìm kiếm sản phẩm tốc độ cao trên PostgreSQL.',
      'Tối ưu hóa hiệu năng tải trang, SEO kỹ thuật và các kết nối API đồng bộ với kho bãi.',
      'Xây dựng hệ thống khuyến mãi linh hoạt, tích hợp ví điện tử, đơn vị vận chuyển hàng đầu.',
    ],
    requirements: [
      'Có từ 2 năm kinh nghiệm làm việc với React/Next.js và Node.js (NestJS hoặc Express).',
      'Thành thạo cơ sở dữ liệu quan hệ (PostgreSQL / MySQL) và quản lý session qua Redis.',
      'Hiểu biết sâu sắc về RESTful API, tối ưu hóa database queries, CI/CD và Docker.',
      'Tư duy logic tốt, chủ động học hỏi công nghệ mới.',
    ],
  },
  {
    id: 'retail',
    title: 'Retail Store Manager (Cửa hàng trưởng)',
    department: 'Khối Bán lẻ (Retail Operations)',
    location: 'TP. Hồ Chí Minh & Hà Nội',
    salary: '15,000,000 - 20,000,000 VNĐ + Thưởng doanh số',
    type: 'Full-time',
    desc: 'Quản lý toàn diện hoạt động vận hành cửa hàng Ananas, dẫn dắt đội ngũ nhân viên mang đến trải nghiệm mua sắm tuyệt vời và đạt các chỉ tiêu doanh số ấn tượng.',
    responsibilities: [
      'Giám sát hoạt động bán hàng, quản lý hàng hóa xuất nhập tồn, trưng bày sản phẩm (Visual Merchandising) đúng chuẩn thương hiệu.',
      'Đào tạo kỹ năng tư vấn sản phẩm giày lưu hóa, chăm sóc khách hàng và kỹ năng giải quyết khiếu nại cho nhân viên cửa hàng.',
      'Lên kế hoạch và triển khai các chương trình khuyến mãi bán lẻ tại điểm bán.',
    ],
    requirements: [
      'Tốt nghiệp Cao đẳng trở lên, ưu tiên chuyên ngành Quản trị kinh doanh hoặc liên quan.',
      'Có tối thiểu 1 năm kinh nghiệm quản lý cửa hàng thời trang, giày dép hoặc chuỗi bán lẻ.',
      'Kỹ năng giao tiếp tốt, khả năng quản trị nhân sự và xử lý tình huống linh hoạt.',
      'Yêu thích thời trang và văn hóa phục vụ.',
    ],
  },
  {
    id: 'content',
    title: 'Content Creator / Copywriter',
    department: 'Phòng Marketing',
    location: 'TP. Hồ Chí Minh (Q. Phú Nhuận)',
    salary: '12,000,000 - 18,000,000 VNĐ',
    type: 'Full-time',
    desc: 'Sáng tạo nội dung, kịch bản video ngắn và các bài viết truyền thông xã hội sắc sảo truyền tải trọn vẹn thông điệp và tinh thần cá tính tự do của Ananas.',
    responsibilities: [
      'Lên ý tưởng, viết bài truyền thông trên Facebook, Instagram, TikTok và blog Ananas.',
      'Viết mô tả sản phẩm tinh tế, giàu cảm xúc cho các bộ sưu tập giày mới ra mắt.',
      'Lên kịch bản quay dựng video ngắn bắt xu hướng về phối đồ thời trang, giới thiệu sản phẩm.',
    ],
    requirements: [
      'Có từ 1-2 năm kinh nghiệm làm Content Creator, Copywriter hoặc các vai trò tương tự trong lĩnh vực F&B hoặc thời trang.',
      'Văn phong đa dạng, sáng tạo, sắc sảo và hợp gu người trẻ.',
      'Có khả năng bắt trend nhanh nhạy, am hiểu thuật toán mạng xã hội.',
      'Biết chỉnh sửa ảnh cơ bản hoặc quay dựng video ngắn qua điện thoại là lợi thế lớn.',
    ],
  },
];

export default function CareersPage() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobId, setJobId] = useState('');
  const [cvLink, setCvLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !jobId) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }

    setLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setJobId('');
    setCvLink('');
    setCoverLetter('');
    setSuccess(false);
  };

  return (
    <div className="w-full bg-neutral-50 text-neutral-800 font-sans flex-1">
      {/* 1. Header Banner */}
      <section className="bg-neutral-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,95,0,0.12)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-orange-500 font-black uppercase text-[10px] tracking-widest block mb-3">
            Gia nhập Đội ngũ Ananas
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6">
            DỨA TUYỂN DỤNG
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-light leading-relaxed">
            Chúng tôi luôn tìm kiếm những mảnh ghép cá tính, sáng tạo và sẵn sàng tạo nên sự khác biệt. Hãy cùng Ananas vẽ nên câu chuyện thời trang streetwear Việt Nam.
          </p>
        </div>
      </section>

      {/* 2. Core Values & Benefits */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase text-neutral-900 mb-2">Đồng đội cá tính</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Môi trường trẻ trung, cởi mở, nơi mọi tiếng nói đều được tôn trọng và tinh thần tự do được thúc đẩy tối đa.
            </p>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase text-neutral-900 mb-2">Đãi ngộ xứng đáng</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Mức lương thưởng cạnh tranh vượt bậc, lộ trình thăng tiến rõ ràng kèm ưu đãi chiết khấu nhân viên đặc biệt.
            </p>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase text-neutral-900 mb-2">Sáng tạo không biên giới</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Không gò bó trong quy tắc rập khuôn. Mỗi cá nhân tại Ananas được tự do thử nghiệm ý tưởng mới táo bạo.
            </p>
          </div>
        </div>

        {/* 3. Job Vacancies Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Vacancies board */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-black uppercase text-neutral-900 tracking-wider mb-8">
              VỊ TRÍ ĐANG TUYỂN DỤNG ({openJobs.length})
            </h2>

            <div className="space-y-4">
              {openJobs.map((job) => {
                const isOpen = activeJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:border-orange-200"
                  >
                    {/* Header bar trigger */}
                    <button
                      onClick={() => setActiveJobId(isOpen ? null : job.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-1">
                          {job.department}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-neutral-900">
                          {job.title}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Collapsible panel body */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[1000px] border-t border-neutral-100' : 'max-h-0'
                      } overflow-hidden`}
                    >
                      <div className="p-6 bg-neutral-50/50">
                        {/* Meta tags */}
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            Địa điểm: {job.location}
                          </span>
                          <span className="bg-neutral-200 text-neutral-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            Hình thức: {job.type}
                          </span>
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            Mức lương: {job.salary}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6 font-light">
                          {job.desc}
                        </p>

                        {/* Responsibilities */}
                        <div className="mb-6">
                          <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-3">
                            MÔ TẢ CÔNG VIỆC:
                          </h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start text-xs text-neutral-500 font-light">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div className="mb-6">
                          <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-3">
                            YÊU CẦU ỨNG VIÊN:
                          </h4>
                          <ul className="space-y-2">
                            {job.requirements.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start text-xs text-neutral-500 font-light">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Apply CTA helper */}
                        <button
                          onClick={() => {
                            setJobId(job.id);
                            // Scroll cleanly to the application form
                            const formElement = document.getElementById('apply-form');
                            if (formElement) {
                              formElement.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-orange-500 transition duration-300"
                        >
                          Ứng tuyển ngay vị trí này
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job application form pane */}
          <div className="lg:col-span-5" id="apply-form">
            <div className="bg-white border border-neutral-200/60 rounded-3xl p-8 shadow-md">
              <h3 className="text-lg font-black uppercase text-neutral-900 tracking-wider mb-6">
                NỘP HỒ SƠ ỨNG TUYỂN
              </h3>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold text-neutral-900 uppercase mb-2">
                    Nộp hồ sơ thành công!
                  </h4>
                  <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto leading-relaxed mb-6">
                    Hệ thống đã ghi nhận hồ sơ ứng tuyển của bạn. Bộ phận nhân sự của Ananas sẽ liên hệ qua email hoặc số điện thoại trong vòng 3-5 ngày làm việc nếu hồ sơ phù hợp.
                  </p>
                  <button
                    onClick={handleResetForm}
                    className="bg-neutral-900 text-white text-xs font-extrabold px-6 py-2.5 rounded-full hover:bg-orange-500 transition duration-300"
                  >
                    ỨNG TUYỂN VỊ TRÍ KHÁC
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  {/* Position selector */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">
                      Vị trí ứng tuyển *
                    </label>
                    <select
                      required
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 cursor-pointer"
                    >
                      <option value="">-- Chọn vị trí ứng tuyển --</option>
                      {openJobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CV Portfolio link */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">
                      Link CV / Portfolio (Google Drive, Behance, v.v.)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={cvLink}
                      onChange={(e) => setCvLink(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* Drag-and-drop styled simulated uploader */}
                  <div className="border border-dashed border-neutral-200 rounded-xl p-4 bg-neutral-50/50 flex flex-col items-center justify-center text-center">
                    <FileText className="w-8 h-8 text-neutral-300 mb-2" />
                    <span className="text-[10px] font-bold text-neutral-600 block">Đính kèm CV cục bộ</span>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Nhấp để duyệt hoặc kéo thả (PDF, DOCX tối đa 5MB)</span>
                    <input type="file" className="hidden" id="local-file-picker" />
                    <label htmlFor="local-file-picker" className="mt-2.5 px-3 py-1 bg-white border border-neutral-200 rounded-lg text-[9px] font-bold hover:bg-neutral-100 cursor-pointer">
                      Chọn file
                    </label>
                  </div>

                  {/* Cover letter field */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">
                      Thư giới thiệu bản thân (Cover letter)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Giới thiệu ngắn gọn lý do vì sao bạn là mảnh ghép hoàn hảo cho vị trí này tại Ananas..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 resize-none"
                    />
                  </div>

                  {/* Warning message */}
                  <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-[9px] text-amber-700 leading-normal font-light">
                      Chúng tôi cam kết bảo mật tuyệt đối hồ sơ cá nhân và cam kết chỉ sử dụng cho hoạt động tuyển dụng nội bộ tại Công ty Ananas.
                    </span>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang xử lý hồ sơ...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>GỬI HỒ SƠ ỨNG TUYỂN</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
