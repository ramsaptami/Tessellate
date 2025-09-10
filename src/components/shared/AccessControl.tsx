'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle, Mail, Key } from 'lucide-react';

interface AccessControlProps {
  children: React.ReactNode;
}

export default function AccessControl({ children }: AccessControlProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate access control check
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'demo@tessellate.app' && accessCode === 'DEMO2024') {
      setIsAuthenticated(true);
    } else {
      setError('Access denied. Please use the demo credentials or request access.');
    }
    
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-blue-200">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 p-4 mb-4">
              <Lock className="h-8 w-8 text-sky-600" />
            </div>
            <CardTitle className="text-2xl">Access Control</CardTitle>
            <CardDescription>
              The Project Dashboard requires authentication to access sensitive project data and analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccessRequest} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium mb-2">
                  Access Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter access code"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Request Access'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Demo Access</h4>
              <p className="text-xs text-amber-700 mb-2">
                For demonstration purposes, use these credentials:
              </p>
              <div className="text-xs font-mono bg-amber-100 p-2 rounded border">
                <div>Email: demo@tessellate.app</div>
                <div>Code: DEMO2024</div>
              </div>
            </div>

            {/* Coming soon notice */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Coming Soon</h4>
              <p className="text-xs text-blue-700">
                Full authentication system with OAuth, role-based access control, and team management features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}