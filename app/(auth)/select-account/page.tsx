// 'use client';

// import { useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/lib/store/auth';
// import { useSelectAccount } from '@/lib/hooks/useAuth';
// import { Building2 } from 'lucide-react';

// const roleLabels: Record<string, string> = {
//   admin: 'Administrateur',
//   manager: 'Manager',
//   agent: 'Agent',
//   observer: 'Observateur',
// };

// const roleColors: Record<string, string> = {
//   admin: 'bg-purple-100 text-purple-700',
//   manager: 'bg-blue-100 text-blue-700',
//   agent: 'bg-green-100 text-green-700',
//   observer: 'bg-gray-100 text-gray-600',
// };

// export default function SelectAccountPage() {
//   const router = useRouter();
//   const { pendingAccounts } = useAuthStore();
//   const selectAccount = useSelectAccount();
//   const isSelectingRef = useRef(false); // ← flag pour bloquer le redirect intempestif

//   useEffect(() => {
//     // Ne rediriger vers /login que si on n'est pas en train de sélectionner
//     if (pendingAccounts.length === 0 && !isSelectingRef.current) {
//       router.replace('/login');
//     }
//   }, [pendingAccounts, router]);

//   const handleSelect = (userId: string) => {
//     isSelectingRef.current = true; // ← on bloque le useEffect
//     selectAccount.mutate(userId);
//   };

//   // eslint-disable-next-line react-hooks/refs
//   if (pendingAccounts.length === 0 && !isSelectingRef.current) return null;

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
//       <div className="text-center mb-8">
//         <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
//           <Building2 className="w-8 h-8 text-white" />
//         </div>
//         <h1 className="text-2xl font-bold text-gray-900">
//           Choisir une organisation
//         </h1>
//         <p className="text-gray-500 mt-2 text-sm">
//           Vous avez plusieurs comptes. Avec quelle organisation souhaitez-vous
//           vous connecter ?
//         </p>
//       </div>

//       <div className="space-y-3">
//         {pendingAccounts.map((account) => (
//           <button
//             key={account.userId}
//             onClick={() => handleSelect(account.userId)}
//             disabled={selectAccount.isPending}
//             className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group disabled:opacity-50 text-left"
//           >
//             <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
//               <Building2 className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-900 truncate">
//                 {account.organizationName}
//               </p>
//               <span
//                 className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
//                   roleColors[account.role] || roleColors.observer
//                 }`}
//               >
//                 {roleLabels[account.role] || account.role}
//               </span>
//             </div>
//             <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">
//               →
//             </span>
//           </button>
//         ))}
//       </div>

//       {selectAccount.isError && (
//         <p className="mt-4 text-center text-sm text-red-600">
//           Une erreur est survenue. Veuillez réessayer.
//         </p>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useSelectAccount } from '@/lib/hooks/useAuth';
import { Building2, ChevronRight } from 'lucide-react';

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

export default function SelectAccountPage() {
  const router = useRouter();
  const { pendingAccounts } = useAuthStore();
  const selectAccount = useSelectAccount();
  const isSelectingRef = useRef(false);

  useEffect(() => {
    if (pendingAccounts.length === 0 && !isSelectingRef.current) {
      router.replace('/login');
    }
  }, [pendingAccounts, router]);

  const handleSelect = (userId: string) => {
    isSelectingRef.current = true;
    selectAccount.mutate(userId);
  };

  // eslint-disable-next-line react-hooks/refs
  if (pendingAccounts.length === 0 && !isSelectingRef.current) return null;

  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choisir une organisation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Vous avez plusieurs comptes associés à cet email
        </p>
      </div>

      <div className="space-y-3">
        {pendingAccounts.map((account) => (
          <button
            key={account.userId}
            onClick={() => handleSelect(account.userId)}
            disabled={selectAccount.isPending}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all group disabled:opacity-50 text-left"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
              <Building2 className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {account.organizationName}
              </p>
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${roleColors[account.role] ?? roleColors.observer}`}>
                {roleLabels[account.role] ?? account.role}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
          </button>
        ))}
      </div>

      {selectAccount.isError && (
        <div className="mt-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm text-center">
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}
    </div>
  );
}