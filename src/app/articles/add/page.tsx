"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function AddArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill all fields");

    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const imgRef = ref(storage, `articles/${uuidv4()}`);
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      }

      await addDoc(collection(db, "articles"), {
        title,
        category,
        content,
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("✅ Article Added!");
      router.push("/articles");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-200 via-yellow-100 to-orange-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 w-full max-w-lg space-y-4"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          ✍ Write a New Article
        </h1>

        <input
          type="text"
          placeholder="Article Title"
          className="border p-3 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category (e.g. Tips, Health)"
          className="border p-3 rounded w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Write your article here..."
          className="border p-3 rounded w-full h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          className="w-full"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition"
        >
          {loading ? "⏳ Posting..." : "✅ Publish Article"}
        </button>
      </form>
    </main>
  );
}
