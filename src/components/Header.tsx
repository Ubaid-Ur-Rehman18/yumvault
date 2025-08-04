"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("✅ Logged out!");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-pink-600">
          🍴 YumVault
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-gray-700 font-medium hover:text-pink-500">Home</Link>
          <Link href="/articles" className="text-gray-700 font-medium hover:text-pink-500">Articles</Link>
          <Link href="/recipes" className="text-gray-700 font-medium hover:text-pink-500">Recipes</Link>

          {user ? (
            <>
              <span className="text-gray-700">👋 {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Signup
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-pink-600 text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-gray-100 px-6 py-3 space-y-2">
          <Link href="/" className="block text-gray-700 font-medium hover:text-pink-500">Home</Link>
          <Link href="/articles" className="block text-gray-700 font-medium hover:text-pink-500">Articles</Link>
          <Link href="/recipes" className="block text-gray-700 font-medium hover:text-pink-500">Recipes</Link>

          {user ? (
            <>
              <span className="block text-gray-700">👋 {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Login
              </Link>
              <Link href="/signup" className="block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
