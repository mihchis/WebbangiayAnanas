'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useUserStore } from '@/store/useUserStore';
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useUserStore((s) => s.setAuth);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccess(true);
      // Auto login after register if tokens returned, otherwise redirect to login
      if (data && data.user && data.accessToken && data.refreshToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    },
    onError: (err: any) => {
      setApiError(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.');
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Nhập họ của bạn';
    if (!form.lastName.trim()) newErrors.lastName = 'Nhập tên của bạn';
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Email không hợp lệ';
    if (form.password.length < 8) newErrors.password = 'Mật khẩu ít nhất 8 ký tự';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    registerMutation.mutate();
  };

  return (
    <div className="flex-1 flex min-h-screen">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/Vintas-Temperate_desktop.jpg')" }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-orange-900/80 to-black/60 flex flex-col justify-end p-16 text-white">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-black text-orange-400 tracking-wider">ANANAS</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest backdrop-blur-xs">
                CLONE
              </span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-tight mb-4">
              THAM GIA CỘNG ĐỒNG ANANAS
            </h2>
            <p className="text-lg font-light text-orange-100/80 leading-relaxed">
              Trở thành thành viên để nhận ngay các ưu đãi đặc quyền, theo dõi đơn hàng dễ dàng và trải nghiệm những dòng sản phẩm mới nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-2">
                Đăng ký thành công!
              </h1>
              <p className="text-sm text-neutral-500 font-light mb-6">
                Tài khoản của bạn đã được khởi tạo. Hệ thống đang chuyển hướng...
              </p>
              <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-1">
                  TẠO TÀI KHOẢN
                </h1>
                <p className="text-sm text-neutral-400 font-light">
                  Đã có tài khoản?{' '}
                  <Link href="/login" className="text-orange-500 font-bold hover:text-orange-600 transition">
                    Đăng nhập
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Họ */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, firstName: e.target.value }));
                        if (errors.firstName) setErrors((err) => { const n = { ...err }; delete n.firstName; return n; });
                      }}
                      placeholder="Nguyễn"
                      required
                      className={`w-full border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
                        errors.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                          : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.firstName}</p>}
                  </div>

                  {/* Tên */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, lastName: e.target.value }));
                        if (errors.lastName) setErrors((err) => { const n = { ...err }; delete n.lastName; return n; });
                      }}
                      placeholder="Văn A"
                      required
                      className={`w-full border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
                        errors.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                          : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      if (errors.email) setErrors((err) => { const n = { ...err }; delete n.email; return n; });
                    }}
                    placeholder="email@example.com"
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                        : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.email}</p>}
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, password: e.target.value }));
                        if (errors.password) setErrors((err) => { const n = { ...err }; delete n.password; return n; });
                      }}
                      placeholder="Tối thiểu 8 ký tự"
                      required
                      className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                          : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.password}</p>}

                  {/* Password strength indicator */}
                  {form.password && (
                    <div className="mt-2 flex gap-1.5">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = Math.min(Math.floor(form.password.length / 2), 4);
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength
                                ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-orange-400' : strength <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                                : 'bg-neutral-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, confirmPassword: e.target.value }));
                      if (errors.confirmPassword) setErrors((err) => { const n = { ...err }; delete n.confirmPassword; return n; });
                    }}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                        : form.confirmPassword && form.password === form.confirmPassword
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                        : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.confirmPassword}</p>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-green-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Mật khẩu khớp!
                    </p>
                  )}
                </div>

                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl">
                    {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 text-white font-extrabold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm mt-2"
                >
                  {registerMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang đăng ký...</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Đăng ký</>
                  )}
                </button>

                <p className="text-center text-[10px] text-neutral-400 font-light leading-relaxed">
                  Bằng cách đăng ký, bạn đồng ý với{' '}
                  <a href="#" className="text-orange-500 hover:underline">Điều khoản dịch vụ</a>
                  {' '}và{' '}
                  <a href="#" className="text-orange-500 hover:underline">Chính sách bảo mật</a> của Ananas.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
