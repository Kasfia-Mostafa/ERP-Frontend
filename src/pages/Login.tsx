import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Boxes } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      if (email.toLowerCase().startsWith('admin') || email.toLowerCase().startsWith('manager')) {
        navigate('/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bgLight p-4">
      <div className="w-full max-w-md vintage-card overflow-hidden shadow-xl border border-[#bba377]">
        <div className="bg-[#26231F] p-8 text-center border-b-4 border-double border-[#bba377] text-[#FAF6ED]">
          <div className="mx-auto h-12 w-12 rounded-sm bg-orange-vibrant flex items-center justify-center border border-dark mb-3 text-dark">
            <Boxes className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider text-orange-vibrant vintage-font-title">ERP SYSTEM</h2>
          <p className="text-gray-400 text-xs mt-1.5 uppercase font-bold tracking-widest font-serif">Inventory & Sales Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded text-xs font-semibold text-red-700 flex items-center gap-2 font-serif">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 vintage-font-title">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@erp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 vintage-input text-sm bg-white"
                />
                <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-[#bba377]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 vintage-font-title">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 vintage-input text-sm bg-white"
                />
                <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-[#bba377]" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-orange-vibrant hover:opacity-90 text-dark font-extrabold text-sm rounded border border-dark transition-all flex items-center justify-center gap-2 font-serif"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark border-t-transparent"></div>
            ) : null}
            Access Account
          </button>
        </form>


      </div>
    </div>
  );
};
