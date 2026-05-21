'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Truck, RotateCcw, ShieldAlert, Landmark, Mail, PackageOpen } from 'lucide-react';

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    id: 'general-usage',
    title: '1. Điều khoản sử dụng website',
    content: (
      <>
        <p className="mb-4">
          Chào mừng bạn đến với website chính thức của Ananas. Khi truy cập và sử dụng dịch vụ trên trang web của chúng tôi, bạn được mặc định đồng ý tuân thủ các điều khoản, điều kiện và quy định sử dụng được nêu tại đây.
        </p>
        <p className="mb-4">
          Mọi nội dung bao gồm hình ảnh thiết kế giày Basas, Vintas, Urbas, Track 6, logo thương hiệu Ananas, mã nguồn phần mềm, cơ sở dữ liệu và tài liệu kỹ thuật đều thuộc quyền sở hữu trí tuệ duy nhất của Ananas Việt Nam. Nghiêm cấm mọi hành vi sao chép, phân phối hoặc tái xuất bản khi chưa có sự chấp thuận bằng văn bản.
        </p>
        <p className="mb-4 font-light">
          Người dùng phải tự chịu trách nhiệm bảo mật thông tin đăng nhập cá nhân, đồng thời cam kết không thực hiện bất kỳ hành vi nào gây gián đoạn hệ thống hoặc can thiệp trái phép vào cơ sở dữ liệu Postgres bảo mật của website.
        </p>
      </>
    ),
  },
  {
    id: 'ordering-process',
    title: '2. Quy trình đặt hàng & Xác nhận',
    content: (
      <>
        <p className="mb-4">
          Khi bạn hoàn tất quy trình điền thông tin và nhấn nút gửi đơn đặt hàng trên website của chúng tôi:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Xác nhận đơn hàng tự động:</strong> Hệ thống sẽ ngay lập tức gửi một email tự động thông báo ghi nhận thông tin đơn hàng cùng mã số tra cứu chi tiết.</li>
          <li><strong>Kiểm duyệt thủ công:</strong> Bộ phận vận hành của Ananas sẽ liên hệ qua số điện thoại để xác nhận lại size giày, số lượng và thông tin địa chỉ trước khi bàn giao cho đơn vị vận chuyển nhằm giảm thiểu tỷ lệ sai sót.</li>
          <li><strong>Tính sẵn có của sản phẩm:</strong> Trong trường hợp sản phẩm hoặc size giày bạn chọn hết hàng đột ngột ngoài kho thực tế, chúng tôi sẽ đề xuất đổi sang phối màu khác hoặc hoàn tiền 100% không thu phụ phí.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'shipping-delivery',
    title: '3. Giao nhận & Chi phí vận chuyển',
    content: (
      <>
        <p className="mb-4">
          Chúng tôi hợp tác với các đơn vị vận chuyển hàng đầu tại Việt Nam để đảm bảo đôi giày của bạn được trao gửi nhanh chóng và toàn vẹn:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <h5 className="text-xs font-bold text-orange-500 uppercase mb-2">KHU VỰC NỘI THÀNH TP.HCM</h5>
            <p className="text-xs text-neutral-300 font-light leading-normal">
              Thời gian giao hàng từ 1 - 2 ngày làm việc.<br />
              Đồng giá phí vận chuyển: 25.000 VNĐ. Miễn phí vận chuyển đối với mọi đơn hàng trị giá từ 800.000 VNĐ trở lên.
            </p>
          </div>
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <h5 className="text-xs font-bold text-orange-500 uppercase mb-2">CÁC TỈNH THÀNH KHÁC</h5>
            <p className="text-xs text-neutral-300 font-light leading-normal">
              Thời gian nhận hàng từ 3 - 5 ngày làm việc.<br />
              Đồng giá phí vận chuyển: 35.000 VNĐ. Hỗ trợ giao tận tay, cho phép thanh toán khi nhận hàng (COD).
            </p>
          </div>
        </div>
        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3.5 items-start mt-4">
          <Truck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-400 font-light leading-normal">
            <strong>Chính sách đồng kiểm đặc quyền:</strong> Khách hàng hoàn toàn được quyền mở hộp kiểm tra ngoại quan sản phẩm (đúng phối màu, đúng mẫu mã, đúng size) trước khi thực hiện thanh toán tiền COD cho shipper. Không hỗ trợ thử giày trực tiếp khi kiểm hàng.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'return-policy',
    title: '4. Chính sách Đổi trả hàng 1-1',
    content: (
      <>
        <p className="mb-4 font-bold text-white flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-orange-500" /> TRẢ HÀNG & ĐỔI SIZE TRONG VÒNG 7 NGÀY
        </p>
        <p className="mb-4">
          Ananas hỗ trợ chính sách đổi trả hàng linh hoạt đối với tất cả các dòng sản phẩm giày nguyên giá mua trực tuyến:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Thời gian áp dụng:</strong> Trong vòng tối đa 7 ngày kể từ thời điểm hệ thống vận chuyển xác nhận bạn đã nhận hàng thành công.</li>
          <li><strong>Điều kiện đổi trả:</strong> Giày hoàn toàn chưa qua sử dụng (đế giày không bị trầy xước, dơ bẩn), còn nguyên tem mác, hóa đơn mua hàng và hộp giày nguyên vẹn đi kèm.</li>
          <li><strong>Các trường hợp được áp dụng:</strong> Đổi size do không mang vừa, đổi phối màu do thay đổi ý thích cá nhân, hoặc đổi mới 1-1 do sản phẩm phát sinh lỗi kỹ thuật từ phía nhà sản xuất (hở keo, đứt chỉ khâu, lỗi form dáng).</li>
          <li><strong>Chi phí đổi size:</strong> Khách hàng vui lòng thanh toán phí chuyển phát 2 chiều nếu đổi do nhu cầu cá nhân. Ananas sẽ chi trả 100% cước phí nếu phát sinh lỗi đóng sai size hoặc lỗi chất lượng sản phẩm.</li>
        </ul>
        <p className="text-xs text-neutral-400 font-light mt-4 italic">
          * Lưu ý: Không áp dụng đổi trả đối với các sản phẩm thuộc chương trình khuyến mại lớn (Sale-off từ 30% trở lên) hoặc phụ kiện kèm theo như lót giày, dây giày và tất dệt.
        </p>
      </>
    ),
  },
  {
    id: 'warranty-policy',
    title: '5. Chính sách Bảo hành keo chỉ 6 tháng',
    content: (
      <>
        <p className="mb-4 font-bold text-white flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-orange-500" /> BẢO HÀNH CHẤT LƯỢNG TRONG 180 NGÀY
        </p>
        <p className="mb-4">
          Mỗi đôi giày Sneaker được làm ra từ tâm huyết của Ananas đều đi kèm chế độ bảo hành chất lượng vượt trội:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Phạm vi bảo hành:</strong> Khắc phục miễn phí các sự cố liên quan đến kỹ thuật sản xuất như: bung keo viền cao su vulcanized, đứt chỉ may viền đế, sứt mắt cáo xỏ dây.</li>
          <li><strong>Thời gian bảo hành:</strong> Áp dụng suốt 6 tháng (180 ngày) kể từ ngày mua sắm ghi nhận trên hóa đơn.</li>
          <li><strong>Quy trình bảo hành:</strong> Mang giày cùng hóa đơn tới cửa hàng gần nhất hoặc gửi bưu điện về trung tâm bảo hành của chúng tôi. Thời gian xử lý kỹ thuật dao động từ 5 - 7 ngày làm việc.</li>
        </ul>
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex gap-3.5 items-start mt-6">
          <PackageOpen className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white mb-1">TRƯỜNG HỢP TỪ CHỐI BẢO HÀNH</h5>
            <p className="text-xs text-neutral-400 font-light leading-normal">
              Giày bị hao mòn tự nhiên do tần suất sử dụng cao, bị rách hoặc xước da do cọ xát với vật sắc nhọn, ngập nước quá lâu gây bong tróc cao su, hoặc sử dụng chất tẩy rửa cực mạnh (như thuốc tẩy) làm phai ố màu vải canvas.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'company-contact',
    title: '6. Hỗ trợ xử lý & Liên hệ',
    content: (
      <>
        <p className="mb-6">
          Mọi thắc mắc liên quan tới quy trình đổi trả hàng, chính sách vận chuyển hoặc yêu cầu bảo hành chất lượng sản phẩm, vui lòng liên hệ trực tiếp với chúng tôi:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex gap-3.5">
            <Landmark className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-extrabold text-white uppercase mb-1">CÔNG TY CỔ PHẦN ANANAS VIỆT NAM</h5>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                Địa chỉ văn phòng: 123 Nguyễn Trọng Tuyển, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex gap-3.5">
            <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-extrabold text-white uppercase mb-1">BỘ PHẬN CHĂM SÓC KHÁCH HÀNG</h5>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                Hotline hỗ trợ: 1900 1234 (Từ 8:30 - 17:30, Thứ Hai tới Thứ Sáu)<br />
                Hộp thư tiếp nhận: support@ananas.vn
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  const [activeSectionId, setActiveSectionId] = useState<string>(policySections[0].id);

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
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">
                Chính Sách & Hướng Dẫn
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                CHÍNH SÁCH CHUNG
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
