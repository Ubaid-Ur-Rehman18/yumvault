"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const matchSearch = r.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || r.category === category;
    return matchSearch && matchCategory;
  });

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            🍲 Explore Delicious Recipes
          </h1>

          {/* 🔹 Search & Category Filter */}
          <div className="bg-white/90 p-6 rounded-2xl shadow-lg mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-400 p-3 rounded w-full md:w-2/3 text-gray-900"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-400 p-3 rounded w-full md:w-1/3 text-gray-900"
              >
                <option value="All">All Categories</option>
                <option value="Breakfast">🍳 Breakfast</option>
                <option value="Lunch">🥗 Lunch</option>
                <option value="Dinner">🍛 Dinner</option>
                <option value="Dessert">🍰 Dessert</option>
              </select>
            </div>
          </div>

          {/* 🔹 Loader */}
          {loading && <p className="text-white text-lg">⏳ Loading...</p>}

          {/* 🔹 No Recipes Found */}
          {!loading && filteredRecipes.length === 0 && (
            <p className="text-gray-200 text-lg">❌ No recipes found. Try another search!</p>
          )}

          {/* 🔹 Recipes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
              >
                <Link href={`/recipes/${recipe.id}`}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900">{recipe.title}</h2>
                  {recipe.category && (
                    <p className="text-sm text-gray-700">📂 {recipe.category}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
