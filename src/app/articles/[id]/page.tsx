"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Link from "next/link";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        ⏳ Loading...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        ❌ Article not found
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {article.title}
            </h1>
            {article.category && (
              <p className="text-sm text-gray-600 mb-4">
                📂 {article.category}
              </p>
            )}

            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
              {article.content}
            </p>

            <Link
              href="/articles"
              className="mt-6 inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
