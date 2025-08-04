"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert("❌ Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex justify-center items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          🔑 Login to YumVault
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-lg text-black placeholder-gray-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-lg text-black placeholder-gray-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 w-full"
          >
            {loading ? "⏳ Logging In..." : "🔓 Login"}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
