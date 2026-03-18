import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

type Role = User['role'];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState<Role>('patient');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string; email?: string; password?: string; confirmPassword?: string;
  }>({});

  function validate() {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Minimum 8 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    try {
      await login(email, password, role);
      toast.success('Account created successfully!');
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch {
      toast.success('Account created! Please sign in.');
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#e8eef5' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl text-navy dark:text-white">
            Medi<span className="text-primary-500">Care+</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-8">
          <h1 className="text-xl font-bold text-navy dark:text-white mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-6">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input label="Full Name" type="text" name="name" placeholder="Jane Doe"
              value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
            <Input label="Email address" type="email" name="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
            <Input label="Password" type="password" name="password" placeholder="Min. 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
            <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="Repeat your password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} required />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
