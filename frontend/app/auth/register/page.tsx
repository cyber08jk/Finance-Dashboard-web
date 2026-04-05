'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@/types';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleApiError } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserType['role'];
  }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await register(formData.username, formData.email, formData.password, formData.role);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm md:max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-7">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              Join Finance Dashboard today
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                At least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="label">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                disabled={loading}
              >
                <option value="viewer">Viewer (Read-only)</option>
                <option value="analyst">Analyst (Create & View)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
