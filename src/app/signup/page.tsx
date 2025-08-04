"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Signup successful!");
      router.push("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("❌ Signup failed!");
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
          📝 Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
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
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
          >
            {loading ? "⏳ Signing Up..." : "✅ Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
