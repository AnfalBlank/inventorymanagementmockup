"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Box, Eye, EyeOff, Lock, Mail, Shield, Zap, Activity } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@manggala.co.id");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Panel - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-[#003c33] flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="MIMS" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#212121] tracking-tight">MIMS</h1>
              <p className="text-[10px] text-[#93939f] uppercase tracking-wider">Warehouse System</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-4xl font-semibold text-[#212121] tracking-tight leading-tight">
              Selamat datang kembali
            </h2>
            <p className="text-sm text-[#616161] mt-3">
              Masuk ke dashboard MIMS untuk mengelola operasional gudang.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@manggala.co.id"
              icon={<Mail size={16} />}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#212121]">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-[#d9d9dd] rounded-lg bg-white text-[#212121] placeholder:text-[#93939f] focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#93939f] hover:text-[#616161]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d9d9dd] text-[#003c33] focus:ring-[#9b60aa]"
                />
                <span className="text-sm text-[#616161]">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-[#1863dc] hover:underline">
                Lupa password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading} size="lg">
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Operational Links */}
          <div className="mt-12 pt-8 border-t border-[#e5e7eb]">
            <p className="text-xs text-[#93939f] uppercase tracking-wider font-semibold mb-4">
              Akses Operasional (Tanpa Login)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Link
                href="/picker"
                className="p-3 rounded-lg border border-[#e5e7eb] hover:border-[#003c33] hover:bg-[#f8f8f8] transition-all text-center"
              >
                <Activity size={18} className="mx-auto text-[#003c33] mb-1.5" />
                <p className="text-xs font-medium">Picker</p>
              </Link>
              <Link
                href="/packing-queue"
                className="p-3 rounded-lg border border-[#e5e7eb] hover:border-[#003c33] hover:bg-[#f8f8f8] transition-all text-center"
              >
                <Zap size={18} className="mx-auto text-[#003c33] mb-1.5" />
                <p className="text-xs font-medium">Queue</p>
              </Link>
              <Link
                href="/packing-process"
                className="p-3 rounded-lg border border-[#e5e7eb] hover:border-[#003c33] hover:bg-[#f8f8f8] transition-all text-center"
              >
                <Shield size={18} className="mx-auto text-[#003c33] mb-1.5" />
                <p className="text-xs font-medium">Packer</p>
              </Link>
            </div>
          </div>

          <p className="mt-8 text-xs text-[#93939f] text-center">
            Demo credentials sudah terisi. Klik Masuk untuk lanjut.
          </p>
        </div>
      </div>

      {/* Right Panel - Brand */}
      <div className="hidden lg:flex bg-[#003c33] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-white" />
          <div className="absolute bottom-32 left-12 w-96 h-96 rounded-full border border-white" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full border border-white" />
        </div>

        <div className="relative">
          <img src="/logo.png" alt="MIMS" className="w-12 h-12 object-contain mb-2" />
          <p className="text-xs text-white/60 uppercase tracking-widest font-medium">
            PT. Manggala Utama Indonesia
          </p>
        </div>

        <div className="relative">
          <h3 className="text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            Warehouse automation,
            <br />
            <span className="text-white/60">realtime control.</span>
          </h3>
          <p className="text-base text-white/70 mt-6 max-w-md leading-relaxed">
            Monitoring stok realtime, automasi picking dan packing, akurasi inventory tinggi
            dalam satu sistem terpadu.
          </p>

          {/* Feature stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-semibold text-white">98%</p>
              <p className="text-[11px] text-white/60 mt-1">Akurasi Stok</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-semibold text-white">99%</p>
              <p className="text-[11px] text-white/60 mt-1">Picking Accuracy</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-semibold text-white">+45%</p>
              <p className="text-[11px] text-white/60 mt-1">Packing Speed</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-white/40 text-xs">
          <Shield size={14} />
          <span>Secured with JWT, RBAC, HTTPS</span>
        </div>
      </div>
    </div>
  );
}
