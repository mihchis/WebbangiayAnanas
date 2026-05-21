'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShoppingBag, 
  Truck, 
  RefreshCw, 
  ShieldAlert, 
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: 'orders' | 'shipping' | 'returns' | 'warranty';
}

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'orders', label: 'Đơn hàng & Thanh toán', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'shipping', label: 'Giao hàng & Vận chuyển', icon: <Truck className="w-4 h-4" /> },
    { id: 'returns', label: 'Đổi trả hàng', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'warranty', label: 'Bảo hành sản phẩm', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const faqData: FAQItem[] = [
    {
      category: 'orders',
      question: 'Làm thế nào để tra cứu trạng thái đơn hàng của tôi?',
      answer: (
        <span>
          Bạn có thể dễ dàng kiểm tra trạng thái đơn hàng của mình bất kỳ lúc nào bằng cách truy cập trang{' '}
          <Link href="/orders/lookup" className="text-orange-500 font-extrabold hover:underline">
            Tra cứu đơn hàng
          </Link>{' '}
          và nhập mã đơn hàng (Order ID) dạng UUID được gửi kèm trong email xác nhận mua hàng. Hệ thống sẽ hiển thị chi tiết lịch trình, sản phẩm đã đặt và trạng thái giao hàng hiện tại.
        </span>
      ),
    },
    {
      category: 'orders',
      question: 'Ananas hỗ trợ các phương thức thanh toán nào?',
      answer: 'Chúng tôi hỗ trợ 2 hình thức thanh toán chính: Thanh toán COD (giao hàng thu tiền mặt tận nơi) và chuyển khoản ngân hàng trực tiếp qua cổng thanh toán bảo mật khi tiến hành đặt hàng trực tuyến trên website.',
    },
    {
      category: 'orders',
      question: 'Tôi có thể thay đổi địa chỉ hoặc hủy đơn hàng đã đặt không?',
      answer: 'Bạn có thể thay đổi thông tin nhận hàng hoặc yêu cầu hủy đơn hàng trong vòng 30 phút kể từ khi đặt hàng bằng cách gọi trực tiếp đến Hotline chăm sóc khách hàng (1900 xxxx). Lưu ý: Sau khi đơn hàng đã chuyển sang trạng thái "Đang vận chuyển", chúng tôi rất tiếc không thể hỗ trợ can thiệp.',
    },
    {
      category: 'shipping',
      question: 'Thời gian giao hàng mất bao lâu và chi phí là bao nhiêu?',
      answer: 'Đối với khu vực TP. Hồ Chí Minh, thời gian giao hàng dự kiến từ 1-2 ngày làm việc. Các tỉnh thành khác dao động từ 3-5 ngày làm việc. Chi phí vận chuyển sẽ được tính tự động dựa trên khoảng cách địa lý và hiển thị rõ ràng tại trang Checkout trước khi bạn thanh toán.',
    },
    {
      category: 'shipping',
      question: 'Tôi có được kiểm tra giày trước khi thanh toán không?',
      answer: 'Hoàn toàn ĐƯỢC. Ananas áp dụng chính sách đồng kiểm toàn diện. Bạn được quyền mở hộp và thử giày tại chỗ trước khi ký nhận và trả tiền cho shipper. Nếu phát hiện giày không vừa hoặc có lỗi sản xuất, bạn có thể từ chối nhận hàng mà không tốn bất kỳ chi phí nào.',
    },
    {
      category: 'returns',
      question: 'Chính sách đổi hàng của Ananas quy định như thế nào?',
      answer: 'Chúng tôi hỗ trợ đổi sản phẩm (đổi size, đổi màu hoặc đổi sang dòng sản phẩm khác bằng hoặc cao giá hơn) trong vòng 7 ngày kể từ ngày bạn nhận được hàng. Điều kiện đổi: Sản phẩm phải còn nguyên nhãn mác, tem niêm yết, hộp giày đi kèm, chưa có dấu hiệu sử dụng hay giặt tẩy.',
    },
    {
      category: 'returns',
      question: 'Chi phí đổi trả hàng sẽ do ai chi trả?',
      answer: 'Nếu việc đổi trả xuất phát từ nhu cầu cá nhân (muốn đổi size, đổi mẫu do không thích), quý khách vui lòng thanh toán phí vận chuyển 2 chiều. Trong trường hợp sản phẩm bị lỗi sản xuất hoặc sai SKU do sơ suất của Ananas, chúng tôi sẽ chịu 100% chi phí chuyển phát nhanh thu hồi và gửi bù hàng mới cho quý khách.',
    },
    {
      category: 'warranty',
      question: 'Giày Ananas mua tại website có được bảo hành keo chỉ không?',
      answer: 'Tất cả sản phẩm giày chính hãng của Ananas đều được hưởng chính sách bảo hành keo dán và chỉ khâu miễn phí trong vòng 6 tháng kể từ ngày mua. Bạn chỉ cần mang giày kèm hóa đơn điện tử hoặc cung cấp số điện thoại đặt hàng đến bất kỳ cửa hàng nào trong hệ thống hoặc gửi bưu điện về trung tâm bảo hành.',
    },
    {
      category: 'warranty',
      question: 'Trường hợp nào nằm ngoài phạm vi bảo hành miễn phí?',
      answer: 'Chúng tôi từ chối bảo hành các lỗi do hao mòn tự nhiên trong quá trình sử dụng lâu ngày, giày bị rách do va quệt vật sắc nhọn, trầy xước bề mặt da, hư hỏng do ngâm nước hoặc sấy ở nhiệt độ cao dẫn đến biến dạng chất liệu vải/cao su.',
    },
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filter FAQs based on search input and active category tabs
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 w-full flex-1 flex flex-col justify-start">
      {/* Back navigation & Page Header */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-neutral-400 hover:text-orange-500 tracking-wider transition-colors duration-200 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Trang Chủ</span>
        </Link>
        <h1 className="text-3xl font-black uppercase text-neutral-900 tracking-tight">
          Câu hỏi thường gặp (FAQs)
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-light">
          Giải đáp nhanh chóng các thắc mắc về quá trình đặt hàng, giao nhận, chính sách đổi trả và chế độ bảo hành giày Ananas.
        </p>
      </div>

      {/* Dynamic Search Box */}
      <section className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-xs mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bạn cần hỗ trợ gì? Nhập từ khóa tìm kiếm nhanh..."
            className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all duration-300"
          />
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex flex-wrap gap-2 mb-8 border-b border-neutral-100 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setExpandedIndex(null); // Reset expansions on filter switch
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </section>

      {/* FAQ Accordion List */}
      <section className="space-y-4 mb-12">
        {filteredFAQs.length === 0 ? (
          <div className="bg-neutral-50 rounded-2xl py-16 px-6 text-center border border-neutral-100 flex flex-col items-center gap-3">
            <HelpCircle className="w-10 h-10 text-neutral-400 animate-pulse" />
            <h3 className="text-sm font-bold text-neutral-800 uppercase">Không tìm thấy câu trả lời phù hợp!</h3>
            <p className="text-xs text-neutral-400 max-w-sm font-light">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Xóa tất cả" để hiển thị lại đầy đủ danh sách hỗ trợ.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 bg-neutral-950 text-white font-extrabold text-[10px] px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-orange-500 transition duration-300"
              >
                Xóa từ khóa
              </button>
            )}
          </div>
        ) : (
          filteredFAQs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'border-orange-500 shadow-md ring-2 ring-orange-500/5' : 'border-neutral-100 hover:border-neutral-300'
                }`}
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className={`text-xs font-bold transition-colors duration-200 ${isExpanded ? 'text-orange-500 text-sm' : 'text-neutral-800'}`}>
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-orange-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 pt-1 text-xs text-neutral-500 font-light leading-relaxed border-t border-neutral-50 bg-neutral-50/30 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Support Box Footer */}
      <section className="bg-neutral-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-orange-400 tracking-widest block">
              Bạn vẫn còn câu hỏi khác?
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight leading-snug">
              Liên Hệ Trực Tiếp Với Đội Ngũ Ananas Support
            </h3>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed max-w-sm">
              Chúng tôi luôn ở đây để giúp giải đáp các thắc mắc về size giày, chế độ bảo hành và các dịch vụ khác 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all duration-300 hover:bg-neutral-800/80">
              <Phone className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Hotline đặt hàng</span>
                <span className="text-xs font-bold text-white font-mono">0963 78 89 90</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all duration-300 hover:bg-neutral-800/80">
              <Mail className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Gửi email hỗ trợ</span>
                <span className="text-xs font-bold text-white font-mono">support@ananas-shoes.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle orange glow background decoration */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none"></div>
      </section>
    </div>
  );
}
