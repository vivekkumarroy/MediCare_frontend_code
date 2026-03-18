import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

type Role = User['role'];


export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  function validate() {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // Try all roles, use whichever matches
    const rolesToTry: Role[] = ['patient', 'admin', 'doctor'];
    let success = false;
    for (const r of rolesToTry) {
      try {
        await login(email, password, r);
        navigate(r === 'admin' ? '/admin' : r === 'doctor' ? '/doctor' : '/dashboard', { replace: true });
        success = true;
        break;
      } catch { /* try next */ }
    }
    if (!success) setErrors({ form: 'Invalid email or password' });
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#e8eef5' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl text-navy dark:text-white">
            Medi<span className="text-primary-500">Care+</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-8">
          <h1 className="text-xl font-bold text-navy dark:text-white mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input label="Email address" type="email" name="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-colors"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
            </div>


            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
            </div>

            {errors.form && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errors.form}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center">
              Sign In
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline font-medium">Create one</Link>
          </p>


        </div>
      </div>
    </div>
  );
}


