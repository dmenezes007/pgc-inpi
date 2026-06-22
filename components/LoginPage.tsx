import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="landing-root flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <div className="mb-6 text-center">
          <img src="/logo-inovacao.png" alt="Logo da inovação" className="mx-auto mb-4 h-12 w-auto" />
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-accent">Portal da Gestão do Conhecimento</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Acesso Restrito</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              placeholder="Informe a senha"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          >
            Acessar
          </button>
        </form>
        <footer className="mt-8 flex justify-center">
          <img
            src="https://barra.sistema.gov.br/v1/assets/govbr.webp"
            alt="Logo gov.br"
            className="h-7 w-auto"
          />
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;