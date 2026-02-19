import { useAuthStore } from '@/lib/store/auth';

export function useRole() {
  const { user } = useAuthStore();
  const role = user?.role;

  return {
    role,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isAgent: role === 'agent',
    isObserver: role === 'observer',
    canWrite: role === 'admin' || role === 'manager',
    canManage: role === 'admin' || role === 'manager',
    canOnlyRead: role === 'observer',
    canAddValues: role === 'admin' || role === 'manager' || role === 'agent',
  };
}
