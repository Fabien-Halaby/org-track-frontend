// 'use client';

// import { useAuthStore } from '@/lib/store/auth';
// import { User } from 'lucide-react';

// export function Navbar() {
//   const { user } = useAuthStore();

//   return (
//     <header className="bg-white border-b border-gray-200 px-8 py-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold text-gray-900">
//           {user?.firstName} {user?.lastName}
//         </h1>
        
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
//             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
//               <User className="w-4 h-4 text-white" />
//             </div>
//             <span className="text-sm font-medium text-gray-700 capitalize">
//               {user?.role}
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import { useAuthStore } from '@/lib/store/auth';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/projects': 'Projets',
  '/indicators': 'Indicateurs',
  '/members': 'Membres',
  '/invitations': 'Invitations',
  '/settings': 'Paramètres',
};

export function Navbar() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const title = Object.entries(pageTitles).find(([key]) =>
    pathname === key || pathname.startsWith(key + '/')
  )?.[1] ?? '';

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between shrink-0">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
          {user?.firstName} {user?.lastName}
        </span>
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
      </div>
    </header>
  );
}