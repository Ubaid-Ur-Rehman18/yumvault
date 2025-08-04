"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main
        className="min-h-screen flex flex-col items-center text-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 w-full max-w-4xl px-6 py-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            🍴 Welcome to <span className="text-yellow-300">YumVault</span>
          </h1>
          <p className="text-base md:text-xl text-gray-100 mt-4 drop-shadow-md">
            Your Personal Vault of Tasty Recipes & Articles
          </p>
          <p className="text-base md:text-xl text-gray-100 mt-2 drop-shadow-md">
            Save, Share, and Explore Delicious Ideas!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recipes/add"
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
            >
              ➕ Add Recipe
            </Link>
            <Link
              href="/articles"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
            >
              📖 View Articles
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white text-center py-4">
        <p className="text-sm">© 2025 YumVault. All rights reserved.</p>
      </footer>
    </>
  );
}
