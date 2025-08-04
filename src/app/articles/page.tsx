"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "articles"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

        <div className="relative z-10 w-full max-w-5xl px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6">
            📖 Explore Articles & Cooking Tips
          </h1>

          {loading && <p className="text-gray-200 text-lg">⏳ Loading...</p>}

          {!loading && articles.length === 0 && (
            <p className="text-gray-200 text-lg">❌ No articles found!</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
              >
                <Link href={`/articles/${article.id}`}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 hover:underline">
                    {article.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
