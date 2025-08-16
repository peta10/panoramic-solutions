'use client';

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/ppm-tool/shared/lib/supabase';

export const AdminLogin: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass: string) => {
    return pass.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isSupabaseConfigured() || !supabase) {
      setError('Authentication service is not configured. Please contact your administrator.');
      setIsLoading(false);
      return;
    }

    try {
      if (showSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError('Check your email for a verification link before signing in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panoramic Solutions
          </h1>
          <p className="text-lg font-medium text-blue-600 mb-1">Admin Dashboard</p>
          <p className="text-gray-600">
            Tool Management Portal
          </p>
        </div>

        {/* Configuration Status */}
        {!isSupabaseConfigured() && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Configuration Required</p>
                <p className="text-xs text-yellow-600">Supabase environment variables need to be set up.</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {showSignUp ? 'Create Admin Account' : 'Admin Sign In'}
            </h2>
            <button
              onClick={() => setShowSignUp(!showSignUp)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              {showSignUp ? (
                <>
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Sign Up
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  autoComplete={showSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
              </div>
              {showSignUp && !validatePassword(password) && password.length > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || (showSignUp && !validatePassword(password))}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Please wait...
                </div>
              ) : (
                showSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {!showSignUp && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Only authorized administrators can access this dashboard.
                <br />
                Contact your system administrator for access.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = 'https://panoramic-solutions.com'}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Panoramic Solutions
          </button>
        </div>
      </div>
    </div>
  );
};
