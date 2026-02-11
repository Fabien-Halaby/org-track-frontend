'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from './store/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInit>{children}</AuthInit>
    </QueryClientProvider>
  );
}

// Initialise l'état auth depuis le localStorage
function AuthInit({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(false);
    setMounted(true);
  }, [setLoading]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return children;
}