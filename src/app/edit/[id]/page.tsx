"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from "@/components/Header";

export default function EditRecipe() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [description, setDescription] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "recipes", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCategory(data.category);
          setDescription(data.description);
          setExistingImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "recipes", id as string);
      await updateDoc(docRef, {
        title,
        category,
        description,
      });

      alert("✅ Recipe Updated Successfully!");
      router.push(`/recipes/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("❌ Failed to update recipe!");
    } finally {
      setLoading(false);
    }
  };

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

        <div className="relative z-10 max-w-xl w-full bg-white/95 rounded-2xl shadow-2xl p-6">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
            ✏ Edit Recipe
          </h1>

          {existingImage && (
            <img
              src={existingImage}
              alt="Recipe"
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
            />
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded-lg text-gray-900 font-medium"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 w-full rounded-lg text-gray-900"
            >
              <option value="Breakfast">🍳 Breakfast</option>
              <option value="Lunch">🥗 Lunch</option>
              <option value="Dinner">🍛 Dinner</option>
              <option value="Dessert">🍰 Dessert</option>
            </select>

            <textarea
              placeholder="Recipe Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border p-3 w-full rounded-lg text-gray-900"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white w-full py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition"
            >
              {loading ? "⏳ Updating..." : "✅ Update Recipe"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
