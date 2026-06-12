import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function AuthPage({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onLogin(form.email, form.password);
      } else {
        await onRegister(form.username, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Sparkles className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GemBot
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">

          {/* Tab Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                isLogin
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Username</label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="yourname"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all cursor-pointer"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          GemBot · Powered by Gemini
        </p>
      </div>
    </div>
  );
}
