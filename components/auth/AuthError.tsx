"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  if (!error) return null;

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth_required':
        return 'Please sign in to access this page.';
      case 'auth_failed':
        return 'Authentication failed. Please try again.';
      case 'no_code':
        return 'Authentication was cancelled.';
      case 'no_profile':
        return 'Unable to retrieve user profile. Please try again.';
      case 'logout_failed':
        return 'Logout failed. Please try again.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="mb-4 p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      <span>
        {getErrorMessage(error)}
      </span>
    </div>
  );
} 