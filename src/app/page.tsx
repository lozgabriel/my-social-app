'use client'
import React, { useState } from "react";

import Login from "@/app/login/page";
import Cadastro from "@/app/cadastro/page";

export default function Home() {
  const [showCadastro, setShowCadastro] = useState(false);

  const handleRegister = (user: { name: string; email: string }) => {
    alert(`Usuário cadastrado: ${user.name} (${user.email})`);
    setShowCadastro(false);
  };
  const handleLogin = (user: { email: string }) => {
    alert(`Usuário logado: ${user.email}`);
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100">
      <section className="w-full max-w-md">
        {showCadastro ? (
          <>
            <Cadastro onRegister={handleRegister} />
            <p className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <button
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setShowCadastro(false)}
              >
                Faça login
              </button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <p className="mt-4 text-center text-sm">
              Ainda não tem conta?{" "}
              <button
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setShowCadastro(true)}
              >
                Cadastre-se
              </button>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
