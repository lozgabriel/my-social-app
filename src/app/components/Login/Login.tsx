import React, { useState } from "react";

export interface LoginFormValues {
  email: string;
  senha: string;
}

export interface LoginProps {
  onLogin?: (user: { email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [form, setForm] = useState<LoginFormValues>({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Atualiza o estado do formulário de forma genérica
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
    if (!form.email || !form.senha) {
      setErro("Preencha todos os campos");
      setLoading(false);
      return;
    }
    // Validação de e-mail simples
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErro("Email inválido");
      setLoading(false);
      return;
    }

    try {
      // Simulação de autenticação
      if (form.email === "admin@email.com" && form.senha === "123456") {
        if (onLogin) {
          onLogin({ email: form.email });
        }
      } else {
        setErro("Usuário ou senha inválidos");
      }
    } catch {
      setErro("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg min-w-[320px] flex flex-col"
        aria-label="Formulário de login"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>
        <label htmlFor="email" className="sr-only">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="username"
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
          autoComplete="current-password"
          value={form.senha}
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
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
