"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/components/Header";
import Link from "next/link";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "recipes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
          <p className="text-xl">⏳ Loading...</p>
        </div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
          <p className="text-xl">❌ Recipe not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main
        className="min-h-screen flex items-center justify-center relative p-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 bg-white/95 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {recipe.title}
            </h1>

            {recipe.category && (
              <p className="text-sm text-gray-700 mb-4">
                📂 <span className="font-medium">{recipe.category}</span>
              </p>
            )}

            {recipe.description && (
              <p className="text-gray-800 text-lg leading-relaxed">
                {recipe.description}
              </p>
            )}

            {/* Buttons - Show only if user is owner */}
            {currentUser?.uid === recipe.userId && (
              <div className="flex gap-3 mt-6">
                <Link
                  href={`/edit/${recipe.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  ✏ Edit
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
