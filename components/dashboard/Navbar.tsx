'use client';

import { useAuthStore } from '@/lib/store/auth';
import { User } from 'lucide-react';

export function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {user?.firstName} {user?.lastName}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}