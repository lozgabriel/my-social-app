import React, { useState, useRef  } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";

type ProfileProps = {
  name: string;
  email: string;
  image?: string | null;
  bio?: string;
  onProfileUpdated?: (data: { name: string; bio?: string; image?: string }) => void;
};

const Profile: React.FC<ProfileProps> = ({ name, email, image, bio, onProfileUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name, bio: bio || "" });
  const [avatar, setAvatar] = useState<string | null>(image || null);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatar(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('bio', form.bio || '');
    if (newAvatar) {
      formData.append('avatar', newAvatar);
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao atualizar perfil');
      const data = await res.json();
      setEditing(false);
      setNewAvatar(null);
      // Atualiza localmente o avatar para o retornado do backend, se necessário
      if (data.image) setAvatar(data.image);
      // Atualiza os campos do formulário, se necessário
      setForm({ name: data.name, bio: data.bio || "" });
      onProfileUpdated?.(data); // Notifica componente pai, se necessário
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setForm({ name, bio: bio || "" }); // Reseta para o original
    setAvatar(image || null);
    setNewAvatar(null);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <Image
          src={avatar || "/default-avatar.png"}
          alt={form.name}
          width={96}
          height={96}
          className="rounded-full object-cover cursor-pointer"
          priority
          onClick={editing ? triggerFileInput : undefined}
        />
        {editing && (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full"
            onClick={triggerFileInput}
            tabIndex={-1}
          >
            <span className="text-white text-xs"><Pencil className="w-6 h-6" /></span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>
      {editing ? (
        <>
          <input
            className="text-lg font-bold border border-gray-300 rounded px-2 py-1 w-full text-center"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <textarea
            className="text-center text-gray-700 mt-2 border border-gray-300 rounded px-2 py-1 w-full"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={2}
            maxLength={120}
            placeholder="Sua bio"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-1 rounded bg-blue-600 text-white"
              onClick={handleSave}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              className="px-4 py-1 rounded bg-gray-300 text-gray-700"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-lg font-bold">{form.name}</div>
          <div className="text-gray-500 text-sm">{email}</div>
          {form.bio && (
            <div className="text-center text-gray-700 mb-2">{form.bio}</div>
          )}
          <button
            className="mt-2 px-4 py-1 rounded bg-blue-600 text-white"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
