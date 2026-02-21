// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuthStore } from '@/lib/store/auth';
// import {
//   LayoutDashboard,
//   FolderKanban,
//   BarChart3,
//   Settings,
//   LogOut,
//   UserPlus,
//   Users,
// } from 'lucide-react';
// import { useLogout } from '@/lib/hooks/useAuth';

// const menuItems = [
//   { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
//   { href: '/projects', label: 'Projets', icon: FolderKanban },
//   { href: '/indicators', label: 'Indicateurs', icon: BarChart3 },
// ];

// export function Sidebar() {
//   const pathname = usePathname();
//   const { user, organization } = useAuthStore();
//   const logout = useLogout();

//   const isActive = (href: string) =>
//     pathname === href || pathname.startsWith(`${href}/`);

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
//             <span className="text-white font-bold">IT</span>
//           </div>
//           <div>
//             <h2 className="font-bold text-gray-900">ImpactTrack</h2>
//             <p className="text-xs text-gray-500 truncate max-w-35">
//               {organization?.name}
//             </p>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                 isActive(item.href)
//                   ? 'bg-blue-50 text-primary font-medium'
//                   : 'text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               {item.label}
//             </Link>
//           );
//         })}

//         {/* Membres : admin uniquement */}
//         {user?.role === 'admin' && (
//           <Link
//             href="/members"
//             className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//               isActive('/members')
//                 ? 'bg-blue-50 text-primary font-medium'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Users className="w-5 h-5" />
//             Membres
//           </Link>
//         )}

//         {/* Invitations : admin et manager */}
//         {user?.role !== 'agent' && user?.role !== 'observer' && (
//           <Link
//             href="/invitations"
//             className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//               isActive('/invitations')
//                 ? 'bg-blue-50 text-primary font-medium'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <UserPlus className="w-5 h-5" />
//             Invitations
//           </Link>
//         )}

//         <Link
//           href="/settings"
//           className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//             isActive('/settings')
//               ? 'bg-blue-50 text-primary font-medium'
//               : 'text-gray-600 hover:bg-gray-50'
//           }`}
//         >
//           <Settings className="w-5 h-5" />
//           Paramètres
//         </Link>
//       </nav>

//       <div className="p-4 border-t border-gray-200">
//         <div className="flex items-center gap-3 px-4 py-2 mb-2">
//           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
//             {user?.firstName?.[0]}{user?.lastName?.[0]}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate">
//               {user?.firstName} {user?.lastName}
//             </p>
//             <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button
//           onClick={() => logout.mutate()}
//           className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//         >
//           <LogOut className="w-5 h-5" />
//           Déconnexion
//         </button>
//       </div>
//     </aside>
//   );
// }



'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import {
  LayoutDashboard, FolderKanban, BarChart3,
  Settings, LogOut, UserPlus, Users,
} from 'lucide-react';
import { useLogout } from '@/lib/hooks/useAuth';

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/projects', label: 'Projets', icon: FolderKanban },
  { href: '/indicators', label: 'Indicateurs', icon: BarChart3 },
];

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  manager: 'Manager',
  agent: 'Agent',
  observer: 'Observateur',
};

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  manager: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  agent: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  observer: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, organization } = useAuthStore();
  const logout = useLogout();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900 shrink-0">
            <span className="text-white font-bold text-sm">IT</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">ImpactTrack</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {organization?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2 mt-1">
          Navigation
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-500' : ''}`} />
              {item.label}
            </Link>
          );
        })}

        {user?.role === 'admin' && (
          <>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2 mt-3">
              Administration
            </p>
            <Link
              href="/members"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive('/members')
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Users className={`w-4 h-4 shrink-0 ${isActive('/members') ? 'text-indigo-500' : ''}`} />
              Membres
            </Link>
          </>
        )}

        {user?.role !== 'agent' && user?.role !== 'observer' && (
          <Link
            href="/invitations"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              isActive('/invitations')
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <UserPlus className={`w-4 h-4 shrink-0 ${isActive('/invitations') ? 'text-indigo-500' : ''}`} />
            Invitations
          </Link>
        )}

        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2 mt-3">
          Compte
        </p>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            isActive('/settings')
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${isActive('/settings') ? 'text-indigo-500' : ''}`} />
          Paramètres
        </Link>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-medium ${roleColors[user?.role ?? 'observer']}`}>
              {roleLabels[user?.role ?? 'observer']}
            </span>
          </div>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-sm transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}