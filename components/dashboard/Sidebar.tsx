'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  UserPlus,
  Users,
} from 'lucide-react';
import { useLogout } from '@/lib/hooks/useAuth';

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/projects', label: 'Projets', icon: FolderKanban },
  { href: '/indicators', label: 'Indicateurs', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, organization } = useAuthStore();
  const logout = useLogout();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">IT</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">ImpactTrack</h2>
            <p className="text-xs text-gray-500 truncate max-w-35">
              {organization?.name}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Membres : admin uniquement */}
        {user?.role === 'admin' && (
          <Link
            href="/members"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/members')
                ? 'bg-blue-50 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Membres
          </Link>
        )}

        {/* Invitations : admin et manager */}
        {user?.role !== 'agent' && user?.role !== 'observer' && (
          <Link
            href="/invitations"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/invitations')
                ? 'bg-blue-50 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Invitations
          </Link>
        )}

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-blue-50 text-primary font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-5 h-5" />
          Paramètres
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
