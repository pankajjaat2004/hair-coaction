import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../../firebase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100">
      <div className="w-full max-w-lg bg-white/80 rounded-3xl shadow-2xl p-10 border border-pink-200 flex flex-col items-center animate-fadeIn">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 text-center">
          Create Your Account
        </h2>
        <p className="text-gray-600 text-center text-lg max-w-xs mb-8">
          Join our hair care community and start your journey!
        </p>
        <form onSubmit={handleRegister} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold text-pink-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 bg-white/90"
              required
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-pink-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 bg-white/90"
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 w-full flex flex-col gap-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-4 bg-white text-pink-600 border-2 border-pink-200 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C36.62 2.7 30.7 0 24 0 14.64 0 6.27 5.48 1.98 13.44l8.06 6.27C12.36 13.36 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.44-4.75H24v9.02h12.44c-.54 2.92-2.18 5.39-4.64 7.06l7.18 5.59C43.73 37.7 46.1 31.7 46.1 24.5z"/><path fill="#FBBC05" d="M10.04 28.71c-1.01-2.98-1.01-6.23 0-9.21l-8.06-6.27C.36 16.7 0 20.28 0 24c0 3.72.36 7.3 1.98 10.77l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.7 0 12.32-2.21 16.44-6.02l-7.18-5.59c-2.01 1.35-4.59 2.16-7.26 2.16-6.26 0-11.64-3.86-13.96-9.21l-8.06 6.27C6.27 42.52 14.64 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Continue with Google
          </button>
          <div className="w-full text-center mt-2">
            <span className="text-gray-600">Already have an account?</span>
            <a href="/login" className="text-pink-600 font-bold ml-2 hover:underline">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
