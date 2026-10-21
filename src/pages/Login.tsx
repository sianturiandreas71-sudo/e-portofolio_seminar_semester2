import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import PPGLogo from '@/components/PPGLogo';

export default function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'signup') {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError);
      } else {
        setSuccess('Akun berhasil dibuat. Silakan masuk dengan email dan kata sandi Anda.');
        setMode('signin');
      }
      setLoading(false);
    } else {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
        setLoading(false);
      } else {
        navigate('/kelola');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <PPGLogo className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Kelola Portofolio' : 'Buat Akun Admin'}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === 'signin'
              ? 'Masuk untuk mengelola refleksi, artefak, dan dokumentasi.'
              : 'Daftar untuk membuat akun admin pertama Anda.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex border border-gray-200 mb-6">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
              mode === 'signin'
                ? 'bg-ppg-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Masuk
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-ppg-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ppg-600 hover:bg-ppg-700 text-white py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading
              ? 'Memproses…'
              : mode === 'signin'
                ? 'Masuk'
                : 'Buat Akun'}
          </button>
        </form>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-ppg-600 transition-colors mt-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
