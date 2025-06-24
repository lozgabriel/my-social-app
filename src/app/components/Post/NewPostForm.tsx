"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";

type Props = {
  onSuccess?: () => void; // callback para atualizar o feed após post
};

export default function NewPostForm({ onSuccess }: Props) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Preview da imagem local
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch("/api/post", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setContent("");
      setImage(null);
      setPreview(null);
      onSuccess?.(); // atualiza feed
    } else {
      alert("Erro ao postar. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 mb-6"
    >
      <textarea
        className="w-full border rounded-xl p-2 resize-none"
        placeholder="O que você está pensando?"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      {preview && (
        <div className="relative w-40 h-24">
          <Image
            src={preview}
            alt="Prévia"
            fill
            className="object-cover rounded-xl"
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => inputFileRef.current?.click()}
          disabled={loading}
        >
          Imagem
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
          disabled={loading}
        />
        <button
          type="submit"
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold"
          disabled={loading || (!content.trim() && !image)}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
