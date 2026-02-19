'use client';

import { useState } from 'react';
import {
  useMembers,
  useAssignProject,
  useRevokeProject,
  useUpdateRole,
  useRevokeMember,
  Member,
  MemberProject,
} from '@/lib/hooks/useMembers';
import { useProjects } from '@/lib/hooks/useProjects';
import { useRole } from '@/lib/hooks/useRole';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FolderKanban,
  X,
  Shield,
  UserX,
} from 'lucide-react';

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
  manager: { label: 'Manager', color: 'bg-blue-100 text-blue-700' },
  agent: { label: 'Agent', color: 'bg-green-100 text-green-700' },
  observer: { label: 'Observer', color: 'bg-gray-100 text-gray-700' },
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const { isAdmin } = useRole();
  const router = useRouter();

  // Rediriger si pas admin
  if (!isAdmin) {
    router.replace('/dashboard');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membres</h1>
          <p className="text-gray-500 mt-1">
            {members?.length || 0} membre{members?.length !== 1 ? 's' : ''} dans votre organisation
          </p>
        </div>
      </div>

      {members?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun membre pour l'instant</p>
          <p className="text-sm text-gray-400 mt-1">
            Invitez des membres depuis la page Invitations
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {members?.map((member) => (
            <MemberCard key={member.userId} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const [expanded, setExpanded] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const revokeProject = useRevokeProject();
  const revokeMember = useRevokeMember();

  const role = roleConfig[member.role] ?? roleConfig.agent;
  const initials = `${member.user.firstName[0]}${member.user.lastName[0]}`.toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header membre */}
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">
                {member.user.firstName} {member.user.lastName}
              </p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                {role.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">{member.user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Changer rôle */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
            Rôle
          </button>

          {/* Assigner projet */}
          {member.role !== 'observer' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Projet
            </button>
          )}

          {/* Révoquer membre */}
          <button
            onClick={() => setShowRevokeConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <UserX className="w-4 h-4" />
          </button>

          {/* Toggle projets */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Projets assignés */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              Projets assignés ({member.projects.length})
            </p>
          </div>

          {member.projects.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm bg-white rounded-lg border border-dashed border-gray-300">
              {member.role === 'observer'
                ? 'Les observers voient automatiquement tous les projets'
                : 'Aucun projet assigné — cliquez sur "+ Projet" pour en ajouter'}
            </div>
          ) : (
            <div className="space-y-2">
              {member.projects.map((project) => (
                <div
                  key={project.accessId}
                  className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 text-sm">{project.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {project.status}
                    </span>
                  </div>
                  <button
                    onClick={() => revokeProject.mutate({ accessId: project.accessId })}
                    disabled={revokeProject.isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Retirer ce projet"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal assigner projet */}
      {showAssignModal && (
        <AssignProjectModal
          member={member}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {/* Modal changer rôle */}
      {showRoleModal && (
        <ChangeRoleModal
          member={member}
          onClose={() => setShowRoleModal(false)}
        />
      )}

      {/* Modal révoquer membre */}
      {showRevokeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Révoquer ce membre ?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              <strong>{member.user.firstName} {member.user.lastName}</strong> perdra
              accès à l'organisation et à tous ses projets. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => revokeMember.mutate({ userId: member.userId })}
                disabled={revokeMember.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {revokeMember.isPending ? 'Révocation...' : 'Révoquer'}
              </button>
              <button
                onClick={() => setShowRevokeConfirm(false)}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignProjectModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const { data: projects } = useProjects();
  const assignProject = useAssignProject();
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Projets pas encore assignés à ce membre
  const assignedIds = member.projects.map((p) => p.id);
  const availableProjects = projects?.filter(
    (p) => !assignedIds.includes(p.id) && p.status !== 'cancelled',
  ) ?? [];

  const handleAssign = () => {
    if (!selectedProjectId) return;
    assignProject.mutate(
      { userId: member.userId, projectId: selectedProjectId },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Assigner un projet</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Choisissez un projet à assigner à{' '}
          <strong>{member.user.firstName} {member.user.lastName}</strong>
        </p>

        {availableProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Tous les projets sont déjà assignés à ce membre
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            {availableProjects.map((project) => (
              <label
                key={project.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedProjectId === project.id
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="project"
                  value={project.id}
                  checked={selectedProjectId === project.id}
                  onChange={() => setSelectedProjectId(project.id)}
                  className="sr-only"
                />
                <FolderKanban className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] ?? ''}`}>
                  {project.status}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAssign}
            disabled={!selectedProjectId || assignProject.isPending}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {assignProject.isPending ? 'Assignation...' : 'Assigner'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangeRoleModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const updateRole = useUpdateRole();
  const [selectedRole, setSelectedRole] = useState(member.role);

  const roles = [
    { value: 'manager', label: 'Manager', description: 'Peut créer et gérer ses projets assignés' },
    { value: 'agent', label: 'Agent', description: 'Peut saisir des valeurs sur ses projets' },
    { value: 'observer', label: 'Observer', description: 'Lecture seule sur tous les projets' },
  ];

  const handleUpdate = () => {
    updateRole.mutate(
      { userId: member.userId, role: selectedRole },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Modifier le rôle</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Rôle actuel de{' '}
          <strong>{member.user.firstName} {member.user.lastName}</strong> :{' '}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig[member.role]?.color}`}>
            {roleConfig[member.role]?.label}
          </span>
        </p>

        <div className="space-y-2 mb-4">
          {roles.map((role) => (
            <label
              key={role.value}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === role.value
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={() => setSelectedRole(role.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{role.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
              </div>
            </label>
          ))}
        </div>

        {selectedRole !== member.role && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-amber-700">
              ⚠️ Changer le rôle mettra à jour les permissions sur tous les projets assignés.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            disabled={selectedRole === member.role || updateRole.isPending}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {updateRole.isPending ? 'Mise à jour...' : 'Confirmer'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
