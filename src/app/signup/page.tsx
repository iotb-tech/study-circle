'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(`Success! User created: ${data.user?.id}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-lg shadow-sm space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-neutral-900">Sign Up (Test)</h1>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border-neutral-200 border px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border-neutral-200 border px-3 py-2"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Sign Up
        </button>
        
        {message && (
          <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded">{message}</p>
        )}
      </form>
    </div>
  );
}