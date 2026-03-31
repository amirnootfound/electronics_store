"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      if (email === "admin@techstore.kg" && password === "admin123") {
        localStorage.setItem("adminAuth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Неверный email или пароль");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⌘</div>
          <h1 className="text-2xl font-black text-[#1d1d1f]">TechStore KG</h1>
          <p className="text-[#6e6e73] text-sm mt-1">Панель администратора</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-7 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@techstore.kg" required
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
            </div>
            {error && <p className="text-xs text-[#ff3b30] bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0064cc] transition-colors disabled:opacity-60 text-sm">
              {loading ? "Проверка..." : "Войти"}
            </button>
          </form>
          <div className="mt-5 p-3.5 bg-[#f5f5f7] rounded-xl">
            <p className="text-[10px] text-[#6e6e73] font-semibold mb-1">Тестовые данные:</p>
            <p className="text-xs font-mono text-[#1d1d1f]">admin@techstore.kg / admin123</p>
          </div>
        </div>
        <p className="text-center mt-5 text-xs">
          <a href="/" className="text-[#0071e3] hover:underline">← В магазин</a>
        </p>
      </div>
    </div>
  );
}
