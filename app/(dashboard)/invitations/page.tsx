'use client';

import { useState } from 'react';
import { useInvitations, useCreateInvitation, useRevokeInvitation } from '@/lib/hooks/useInvitations';
import { useAuthStore } from '@/lib/store/auth';
import { Copy, Trash2, UserPlus, Check, Link as LinkIcon, X } from 'lucide-react';

interface Invitation {
  id: string;
  role: string;
  email: string | null;
  used: boolean;
  expiresAt: string;
  createdAt: string;
  invitedBy: {
    firstName: string;
    lastName: string;
  };
}

export default function InvitationsPage() {
  const { user } = useAuthStore();
  const { data: invitations, isLoading } = useInvitations();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitations</h1>
          <p className="text-gray-500 mt-1">Gérez les accès à votre organisation</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Inviter un membre
        </button>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invité par</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expire le</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invitations?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Aucune invitation envoyée
                </td>
              </tr>
            ) : (
              invitations?.map((inv: Invitation) => (
                <InvitationRow key={inv.id} invitation={inv} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvitationRow({ invitation }: { invitation: Invitation }) {
  const revokeMutation = useRevokeInvitation();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    // On doit reconstruire le lien car on a pas le token en clair dans la liste
    // Alternative: stocker le token ou faire un endpoint dédié
    const link = `${window.location.origin}/join?token=${invitation.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatus = () => {
    if (invitation.used) return { label: 'Utilisée', class: 'bg-green-100 text-green-800' };
    if (new Date(invitation.expiresAt) < new Date()) return { label: 'Expirée', class: 'bg-red-100 text-red-800' };
    return { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' };
  };

  const status = getStatus();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
          {invitation.role}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{invitation.email || '-'}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {invitation.invitedBy.firstName} {invitation.invitedBy.lastName}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(invitation.expiresAt).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {!invitation.used && new Date(invitation.expiresAt) > new Date() && (
            <>
              <button
                onClick={copyLink}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Copier le lien d'invitation"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <LinkIcon size={18} />}
              </button>
              <button
                onClick={() => revokeMutation.mutate(invitation.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Révoquer l'invitation"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore();
  const createMutation = useCreateInvitation();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate(
      {
        role: formData.get('role') as any,
        email: (formData.get('email') as string) || undefined,
        expiresInDays: parseInt(formData.get('expiresInDays') as string) || 7,
      },
      {
        onSuccess: (data) => {
          setGeneratedLink(data.link);
          setStep('success');
        },
      }
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Invitation créée !</h2>
            <p className="text-gray-500 mt-1">Partagez ce lien unique</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <button
                onClick={copyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Important :</strong> Ce lien est unique et ne sera plus affiché. Copiez-le maintenant.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep('form');
                setGeneratedLink('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Créer une autre
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Inviter un membre</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              name="role"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              defaultValue="agent"
            >
              <option value="agent">Agent (saisie des indicateurs)</option>
              {user?.role === 'admin' && (
                <>
                  <option value="manager">Manager (gestion de projets)</option>
                  <option value="observer">Observateur (lecture seule)</option>
                  <option value="admin">Admin (tous les droits)</option>
                </>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {user?.role === 'manager' && "Vous ne pouvez inviter que des agents"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="collegue@organisation.org"
            />
            <p className="text-xs text-gray-500 mt-1">Pré-remplit l'email sur la page d'inscription</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
            <select
              name="expiresInDays"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              defaultValue="7"
            >
              <option value="1">1 jour</option>
              <option value="3">3 jours</option>
              <option value="7">7 jours</option>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Création...' : 'Générer le lien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}