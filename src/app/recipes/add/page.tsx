"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { onAuthStateChanged } from "firebase/auth";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  // ✅ Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("⚠ Please login to add a recipe!");
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
      alert("⚠ Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Upload Image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("📸 Cloudinary Response:", data); // Debug ke liye

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary Upload Failed!");
      }

      // ✅ Save Recipe in Firestore
      await addDoc(collection(db, "recipes"), {
        title,
        category,
        description,
        image: data.secure_url,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });

      alert("✅ Recipe Added Successfully!");
      router.push("/recipes");
    } catch (error) {
      console.error("❌ Error adding recipe:", error);
      alert("❌ Image upload failed! Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main
        className="min-h-screen flex justify-center items-center p-6 relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-xl w-full bg-white/95 p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
            ➕ Add New Recipe
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded text-black"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 w-full rounded text-black"
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
              className="border p-3 w-full rounded text-black"
              rows={4}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="border p-3 w-full rounded text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              {loading ? "⏳ Saving..." : "✅ Add Recipe"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
