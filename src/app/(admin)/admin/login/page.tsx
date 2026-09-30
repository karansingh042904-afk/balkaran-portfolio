'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const notice = searchParams.get('notice');
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsConfigured(false);
    } else {
      setIsConfigured(true);
      // If already authenticated, redirect to /admin dashboard
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          window.location.href = '/admin';
        }
      });
    }

    if (errorParam === 'forbidden') {
      setErrorMsg('Access denied: Your account does not have administrator privileges.');
    } else if (notice === 'setup_required' || !supabase) {
      setErrorMsg(
        'Supabase configuration required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured in .env.local to access the admin portal.'
      );
    }
  }, [notice, errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg(
        'Cannot sign in: Supabase configuration is missing in .env.local. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        // Full page navigation to ensure auth cookies are transmitted to Server Components and Middleware
        window.location.href = '/admin';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during authentication.';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portfolio</span>
        </Link>

        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-indigo-600/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Admin CMS Portal</h1>
        <p className="text-xs text-slate-400 mt-1">
          Secure authentication for portfolio management
        </p>
      </div>

      <Card className="p-6 border-slate-800 bg-slate-900/90 backdrop-blur-sm shadow-2xl space-y-4">
        {/* Missing Supabase configuration warning */}
        {!isConfigured && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Supabase Configuration Required</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              To authenticate with Supabase Auth, provide your credentials in <code className="px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono text-[10px]">.env.local</code>:
            </p>
            <div className="bg-slate-950 p-2.5 rounded font-mono text-[10px] text-slate-300 space-y-1 overflow-x-auto border border-slate-800">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && isConfigured && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                autoComplete="email"
                disabled={!isConfigured || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                autoComplete="current-password"
                disabled={!isConfigured || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isConfigured || loading}
            variant="primary"
            className="w-full mt-2"
            size="md"
          >
            {loading ? 'Authenticating with Supabase...' : 'Sign In with Supabase'}
          </Button>
        </form>

        {/* Security badge and setup guide link */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Auth & RLS Protected</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <HelpCircle className="w-3 h-3" />
            <span>Admin-only CMS</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400 text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
