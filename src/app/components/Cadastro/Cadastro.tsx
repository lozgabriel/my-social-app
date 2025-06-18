import React, { useState } from "react";

export interface CadastroFormValues {
  name: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface CadastroProps {
  onRegister?: (user: { name: string; email: string }) => void;
}

const Cadastro: React.FC<CadastroProps> = ({ onRegister }) => {
  const [form, setForm] = useState<CadastroFormValues>({
    name: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    // Validação básica
    if (!form.name || !form.email || !form.senha || !form.confirmarSenha) {
      setErro("Preencha todos os campos");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErro("Email inválido");
      setLoading(false);
      return;
    }
    if (form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          senha: form.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao cadastrar usuário");
        setSucesso(null);
      } else {
        if (onRegister) {
          onRegister({ name: form.name, email: form.email });
        }
        setSucesso("Cadastro realizado com sucesso!");
        setForm({
          name: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        });
      }
    } catch {
      setErro("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {sucesso && (
        <div className="text-green-600 mb-4 text-sm text-center" role="status">
          {sucesso}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg min-w-[320px] flex flex-col"
        aria-label="Formulário de cadastro"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Cadastro
        </h2>

        <label htmlFor="name" className="sr-only">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nome"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <label htmlFor="email" className="sr-only">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <label htmlFor="senha" className="sr-only">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          placeholder="Senha"
          autoComplete="new-password"
          value={form.senha}
          onChange={handleChange}
          className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <label htmlFor="confirmarSenha" className="sr-only">
          Confirmar senha
        </label>
        <input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          placeholder="Confirmar senha"
          autoComplete="new-password"
          value={form.confirmarSenha}
          onChange={handleChange}
          className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        {erro && (
          <div
            className="text-red-500 mb-4 text-sm text-center"
            role="alert"
            aria-live="polite"
          >
            {erro}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default Cadastro;
