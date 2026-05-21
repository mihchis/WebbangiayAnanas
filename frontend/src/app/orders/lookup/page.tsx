'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { 
  Search, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  productVariant: {
    stock: number;
    product: {
      id: string;
      name: string;
      sku: string;
      price: number;
    };
    color: {
      name: string;
      hexCode: string;
    };
    size: {
      value: string;
    };
  };
}

interface Order {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  note: string | null;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderLookup() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [queryId, setQueryId] = useState<string | null>(null);

  // TanStack Query to fetch order details
  const { data: order, isLoading, error, refetch, isFetching } = useQuery<Order>({
    queryKey: ['order-lookup', queryId],
    queryFn: async () => {
      if (!queryId) return null;
      // The API accepts /orders/:id and handles guest lookup
      const response = await api.get(`/orders/${queryId.trim()}`);
      return response.data;
    },
    enabled: !!queryId,
    retry: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setQueryId(orderIdInput.trim());
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    const configs = {
      pending: {
        bg: 'bg-amber-50 text-amber-600 border-amber-200',
        text: 'Chờ thanh toán',
        icon: <CreditCard className="w-3.5 h-3.5" />,
      },
      paid: {
        bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        text: 'Đã thanh toán',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      shipped: {
        bg: 'bg-blue-50 text-blue-600 border-blue-200',
        text: 'Đang vận chuyển',
        icon: <Truck className="w-3.5 h-3.5" />,
      },
      delivered: {
        bg: 'bg-purple-50 text-purple-600 border-purple-200',
        text: 'Đã giao hàng',
        icon: <Package className="w-3.5 h-3.5" />,
      },
      cancelled: {
        bg: 'bg-rose-50 text-rose-600 border-rose-200',
        text: 'Đã hủy đơn',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
      },
    };

    const config = configs[status] || configs.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border tracking-wider ${config.bg}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 w-full flex-1 flex flex-col justify-start">
      {/* Back button and title */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-neutral-400 hover:text-orange-500 tracking-wider transition-colors duration-200 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Trang Chủ</span>
        </Link>
        <h1 className="text-3xl font-black uppercase text-neutral-900 tracking-tight">
          Tra Cứu Đơn Hàng
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-light">
          Nhập mã đơn hàng (Order ID) để kiểm tra trạng thái thanh toán và thông tin vận chuyển chi tiết.
        </p>
      </div>

      {/* Lookup Form */}
      <section className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Ví dụ: 0fcaa3ea-0977-4314-9b3e-e5b3f6aa5669"
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all duration-300"
            />
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={isLoading || isFetching}
            className="bg-neutral-900 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition duration-300 shadow-md hover:shadow-orange-500/20 disabled:bg-neutral-300 flex items-center justify-center gap-2 cursor-pointer min-w-[160px]"
          >
            {(isLoading || isFetching) ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang tìm...</span>
              </>
            ) : (
              <span>Tra Cứu</span>
            )}
          </button>
        </form>
      </section>

      {/* Loading state indicator */}
      {(isLoading || isFetching) && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-xs font-semibold text-neutral-400">Đang truy xuất thông tin đơn hàng...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && !isFetching && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center flex flex-col items-center gap-3 mb-8 animate-fade-in">
          <AlertCircle className="w-10 h-10 text-red-500 animate-bounce" />
          <h3 className="text-sm font-black uppercase text-red-800">Không Tìm Thấy Đơn Hàng!</h3>
          <p className="text-xs text-red-600 max-w-md font-light">
            Mã đơn hàng bạn vừa nhập không tồn tại hoặc không chính xác. Vui lòng kiểm tra kỹ ký tự hoặc mã UUID đơn hàng của bạn.
          </p>
        </div>
      )}

      {/* Order Details Display */}
      {order && !isLoading && !isFetching && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Info Card */}
          <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-400 tracking-widest block mb-1">
                  Thông tin đơn hàng
                </span>
                <h2 className="text-sm font-black uppercase tracking-wider font-mono select-all">
                  ID: {order.id}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2 font-light">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đặt ngày: {formatDate(order.createdAt)}</span>
                </div>
              </div>
              <div>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="p-6 border-b border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50/50">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
                  Thông Tin Người Nhận
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-neutral-700">
                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="font-bold">{order.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-700">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="font-medium">{order.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-neutral-700">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{order.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
                  Ghi chú đơn hàng
                </h3>
                <div className="flex items-start gap-3 text-xs text-neutral-600 bg-white border border-neutral-100 rounded-xl p-4 min-h-[80px]">
                  <FileText className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <p className="font-light italic leading-relaxed">
                    {order.note || 'Không có ghi chú nào dành cho đơn hàng này.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
                Chi Tiết Sản Phẩm
              </h3>
              
              <div className="divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      {/* Avatar shoe placeholder or custom styling */}
                      <div className="w-16 h-16 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center overflow-hidden relative shrink-0">
                        <ShoppingBag className="w-6 h-6 text-neutral-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 hover:text-orange-500 transition line-clamp-1">
                          {item.productVariant.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 items-center mt-1">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                            SKU: {item.productVariant.product.sku}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-200"></span>
                          <span className="text-[10px] font-bold text-neutral-600 flex items-center gap-1">
                            Màu: 
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-neutral-200 inline-block" 
                              style={{ backgroundColor: item.productVariant.color.hexCode }}
                            />
                            {item.productVariant.color.name}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-200"></span>
                          <span className="text-[10px] font-bold text-neutral-600">
                            Size: {item.productVariant.size.value}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block mt-1 font-light">
                          Số lượng: <strong className="text-neutral-950 font-bold">{item.quantity}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-neutral-900 block">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-light block">
                        Đơn giá: {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculation */}
              <div className="border-t border-neutral-100 pt-6 flex justify-between items-center bg-neutral-50 -mx-6 -mb-6 p-6">
                <span className="text-xs font-black uppercase text-neutral-800 tracking-wider">
                  Tổng Cộng Thanh Toán
                </span>
                <span className="text-xl font-black text-orange-500">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
