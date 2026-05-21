'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import {
  ArrowLeft, Truck, CreditCard, Smartphone, CheckCircle2,
  Package, ShieldCheck, ChevronRight, Loader2, ChevronDown
} from 'lucide-react';

const PROVINCES = [
  'An Giang','Bà Rịa – Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh',
  'Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cần Thơ',
  'Cao Bằng','Đà Nẵng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp',
  'Gia Lai','Hà Giang','Hà Nam','Hà Nội','Hà Tĩnh','Hải Dương','Hải Phòng',
  'Hậu Giang','Hồ Chí Minh','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang',
  'Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định',
  'Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên','Quảng Bình','Quảng Nam',
  'Quảng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình',
  'Thái Nguyên','Thanh Hóa','Thừa Thiên – Huế','Tiền Giang','Trà Vinh','Tuyên Quang',
  'Vĩnh Long','Vĩnh Phúc','Yên Bái'
];

type PaymentMethod = 'cod' | 'card' | 'momo';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();

  const [form, setForm] = useState({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    phone: '',
    email: user?.email || '',
    address: '',
    province: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim() || !/^0\d{9}$/.test(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Email không hợp lệ';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!form.province) newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    return newErrors;
  };

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderItems = items.map((item) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const response = await api.post('/orders', {
        fullName: form.fullName,
        phone: form.phone,
        address: `${form.address}, ${form.province}`,
        note: form.note,
        items: orderItems,
      });
      return response.data;
    },
    onSuccess: (data) => {
      clearCart();
      setOrderSuccess(data.id || 'ORD-' + Date.now());
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    createOrderMutation.mutate();
  };

  // Order success screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 w-full flex flex-col items-center justify-center gap-6 flex-1">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-neutral-900 uppercase mb-2">Đặt hàng thành công! 🎉</h1>
          <p className="text-sm text-neutral-500 font-light mb-1">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
          <p className="text-xs text-neutral-400 font-semibold bg-neutral-50 inline-block px-4 py-2 rounded-full mt-1">
            Mã đơn hàng: <span className="text-orange-500 font-black">{orderSuccess.substring(0, 8).toUpperCase()}</span>
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center w-full">
          <Package className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-neutral-800">
            Ananas sẽ liên hệ xác nhận trong vòng <strong>30 phút</strong>.
          </p>
          <p className="text-xs text-neutral-500 mt-1 font-light">Thời gian giao hàng: 2–5 ngày làm việc</p>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row w-full">
          <Link
            href="/"
            className="flex-1 text-center border border-neutral-200 hover:border-neutral-400 text-neutral-700 font-bold py-3 rounded-xl text-sm transition"
          >
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-xl text-sm transition shadow-md"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 w-full text-center flex-1">
        <h1 className="text-xl font-black text-neutral-800 mb-4">Giỏ hàng trống!</h1>
        <Link href="/products" className="text-orange-500 font-bold hover:underline text-sm">
          Quay lại mua sắm →
        </Link>
      </div>
    );
  }

  const InputField = ({
    label, name, type = 'text', placeholder, required = false
  }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[name as keyof typeof form]}
        onChange={(e) => {
          setForm((f) => ({ ...f, [name]: e.target.value }));
          if (errors[name]) setErrors((err) => { const n = { ...err }; delete n[name]; return n; });
        }}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
          errors[name]
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
            : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-[11px] font-semibold mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-100 pb-5">
        <Link href="/cart" className="text-neutral-400 hover:text-neutral-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black uppercase text-neutral-900 tracking-tight">Thanh toán</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 text-xs font-bold">
        {['Giỏ hàng', 'Thông tin giao hàng', 'Xác nhận'].map((step, idx) => (
          <React.Fragment key={step}>
            <span className={`px-3 py-1 rounded-full ${idx === 1 ? 'bg-orange-500 text-white' : 'text-neutral-400'}`}>
              {step}
            </span>
            {idx < 2 && <ChevronRight className="w-3 h-3 text-neutral-300" />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left: Shipping form */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Shipping Info */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-neutral-800 mb-5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Họ và tên" name="fullName" placeholder="Nguyễn Văn A" required />
                </div>
                <InputField label="Số điện thoại" name="phone" type="tel" placeholder="0901234567" required />
                <InputField label="Email" name="email" type="email" placeholder="email@example.com" required />
                <div className="sm:col-span-2">
                  <InputField label="Địa chỉ cụ thể" name="address" placeholder="Số nhà, tên đường, phường/xã..." required />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-1.5">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.province}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, province: e.target.value }));
                        if (errors.province) setErrors((err) => { const n = { ...err }; delete n.province; return n; });
                      }}
                      className={`w-full appearance-none border rounded-xl px-4 py-3 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
                        errors.province
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                          : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
                      }`}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                  {errors.province && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.province}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-1.5">
                    Ghi chú (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-neutral-800 mb-5 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                Phương thức vận chuyển
              </h2>
              <label className="flex items-center gap-4 border border-orange-200 bg-orange-50 rounded-xl p-4 cursor-pointer">
                <input type="radio" defaultChecked className="accent-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">Giao hàng tiêu chuẩn</p>
                  <p className="text-xs text-neutral-500 font-light">2–5 ngày làm việc • Miễn phí</p>
                </div>
                <span className="text-xs font-black text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                  MIỄN PHÍ
                </span>
              </label>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-neutral-800 mb-5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                Phương thức thanh toán
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: 'cod' as PaymentMethod,
                    label: 'Thanh toán khi nhận hàng (COD)',
                    sub: 'Trả tiền mặt trực tiếp cho shipper',
                    icon: <Truck className="w-5 h-5 text-neutral-500" />,
                  },
                  {
                    id: 'card' as PaymentMethod,
                    label: 'Thẻ quốc tế & nội địa (ATM)',
                    sub: 'Visa, Mastercard, JCB, ATM nội địa',
                    icon: <CreditCard className="w-5 h-5 text-blue-500" />,
                  },
                  {
                    id: 'momo' as PaymentMethod,
                    label: 'Ví MoMo',
                    sub: 'Thanh toán nhanh qua ứng dụng MoMo',
                    icon: <Smartphone className="w-5 h-5 text-pink-500" />,
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      paymentMethod === method.id
                        ? 'border-orange-300 bg-orange-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-orange-500"
                    />
                    {method.icon}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-neutral-900">{method.label}</p>
                      <p className="text-xs text-neutral-500 font-light">{method.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-neutral-800 mb-5 pb-4 border-b border-neutral-100">
                Đơn hàng của bạn
              </h2>

              <div className="flex flex-col gap-3 max-h-72 overflow-y-auto mb-5 pr-1">
                {items.map((item) => (
                  <div key={item.productVariantId} className="flex gap-3 items-start">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt={item.product.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-neutral-800 line-clamp-2">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 font-semibold">
                        {item.color.name} • Size {item.size.value}
                      </p>
                    </div>
                    <span className="text-xs font-black text-orange-500 flex-shrink-0">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-neutral-200 pt-4 mb-5 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span className="font-semibold">Tạm tính</span>
                  <span className="font-bold">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="font-semibold">Phí vận chuyển</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-neutral-900">Tổng thanh toán</span>
                  <span className="text-xl font-black text-orange-500">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 text-white font-extrabold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
              >
                {createOrderMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Xác nhận đặt hàng</>
                )}
              </button>

              {createOrderMutation.isError && (
                <p className="text-center text-red-500 text-xs font-semibold mt-3">
                  Đặt hàng thất bại. Vui lòng thử lại!
                </p>
              )}

              <p className="text-center text-[10px] text-neutral-400 font-light mt-3">
                Bằng cách đặt hàng, bạn đồng ý với{' '}
                <a href="#" className="text-orange-500 hover:underline">Chính sách chung</a> của Ananas.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
