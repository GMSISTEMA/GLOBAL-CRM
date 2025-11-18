import React, { useState } from 'react';
import { BriefcaseIcon } from './icons';

interface LoginPageProps {
  onLogin: (email, password) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email === 'admin@crm.com' && password === 'password123') {
      onLogin(email, password);
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-darkest flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-dark shadow-2xl rounded-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <BriefcaseIcon className="h-12 w-12 text-brand-primary" />
            <h1 className="text-2xl font-bold text-neutral-darkest dark:text-neutral-light mt-3">
              CRM Funil de Vendas
            </h1>
            <p className="text-neutral-dark dark:text-neutral-light mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="admin@crm.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="password123"
                />
              </div>
            </div>

            {error && (
              <p className="text-center text-sm text-status-lost">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-all"
              >
                Entrar
              </button>
            </div>
          </form>
           <div className="text-center mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use <code className="bg-gray-200 dark:bg-neutral-darkest p-1 rounded">admin@crm.com</code> e <code className="bg-gray-200 dark:bg-neutral-darkest p-1 rounded">password123</code> para testar.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
