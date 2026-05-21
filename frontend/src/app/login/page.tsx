'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useUserStore } from '@/store/useUserStore';
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useUserStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [show2FA, setShow2FA] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [tempTokens, setTempTokens] = useState<{accessToken: string; refreshToken: string} | null>(null);
  const [tempUser, setTempUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/login', form);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.requiresTwoFactor) {
        // Store temp data and show 2FA prompt
        setTempUser(data.user);
        setTempTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        setShow2FA(true);
      } else {
        setAuth(data.user, data.accessToken, data.refreshToken);
        window.location.href = '/';
      }
    },
    onError: (err: any) => {
      setApiError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/2fa/verify', {
        token: twoFaCode,
        accessToken: tempTokens?.accessToken,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (tempUser && tempTokens) {
        setAuth(data.user || tempUser, data.accessToken || tempTokens.accessToken, data.refreshToken || tempTokens.refreshToken);
        window.location.href = '/';
      }
    },
    onError: (err: any) => {
      setApiError(err.response?.data?.message || 'Mã xác thực không chính xác');
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    loginMutation.mutate();
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    verify2FAMutation.mutate();
  };

  return (
    <div className="flex-1 flex min-h-screen">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/loginbackground.jpg')" }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-orange-900/80 to-black/60 flex flex-col justify-end p-16 text-white">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-black text-orange-400 tracking-wider">ANANAS</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest backdrop-blur-xs">
                STORE
              </span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-tight mb-4">
              Discover You
            </h2>
            <p className="text-lg font-light text-orange-100/80 leading-relaxed">
              Chào mừng trở lại! Đăng nhập để tiếp tục mua sắm giày chính hãng Ananas với hàng ngàn mẫu mã thời thượng.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {!show2FA ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-1">
                  Đăng nhập
                </h1>
                <p className="text-sm text-neutral-400 font-light">
                  Chưa có tài khoản?{' '}
                  <Link href="/register" className="text-orange-500 font-bold hover:text-orange-600 transition">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    required
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-extrabold uppercase tracking-widest text-neutral-600">
                      Mật khẩu
                    </label>
                    <Link href="/forgot-password" className="text-[11px] text-orange-500 font-semibold hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 pr-12 text-sm font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl">
                    {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 text-white font-extrabold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                >
                  {loginMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang đăng nhập...</>
                  ) : (
                    <><LogIn className="w-4 h-4" /> Đăng nhập</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* 2FA Screen */
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-orange-500" />
                </div>
                <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight mb-1">
                  Xác thực 2 lớp
                </h1>
                <p className="text-sm text-neutral-400 font-light max-w-xs mx-auto">
                  Mở ứng dụng Google Authenticator và nhập mã 6 chữ số
                </p>
              </div>

              <form onSubmit={handle2FA} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-600 mb-2">
                    Mã xác thực TOTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    required
                    className="w-full border border-neutral-200 rounded-xl px-4 py-4 text-2xl font-black text-center tracking-[0.5em] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                </div>

                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl text-center">
                    {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verify2FAMutation.isPending || twoFaCode.length !== 6}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 text-white font-extrabold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                >
                  {verify2FAMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Xác thực</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setShow2FA(false); setApiError(''); setTwoFaCode(''); }}
                  className="text-center text-xs text-neutral-400 hover:text-neutral-600 font-semibold transition"
                >
                  ← Quay lại đăng nhập
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
