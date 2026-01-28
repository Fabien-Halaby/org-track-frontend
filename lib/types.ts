//! USER
export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "teacher" | "student" | "parent";
  status: "pending" | "approved" | "rejected";
  phone?: string;
  created_at: string;
  class_name?: string;
}

export interface UsersResponse {
  users: AdminUser[];
  total: number;
}


//! CLASS
export interface Class {
  id: number;
  name: string;
  level: string;
  section: string;
  capacity: number;
  academic_year: string;
  school_id: number;
  student_count?: number;
}

export interface CreateClassData {
  name: string;
  level: string;
  section: string;
  capacity: number;
  academic_year: string;
}

export type UpdateClassData = CreateClassData


//! SUBJECT
export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  school_id: number;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
}

export type UpdateSubjectData = CreateSubjectData;

//! DASHBOARD
export interface DashboardStats {
  total_users: number;
  total_teachers: number;
  total_students: number;
  total_admins: number;
  pending_users: number;
  approved_users: number;
  rejected_users: number;
  total_subjects: number;
  total_classes: number;
}

export interface DashboardData {
  stats: DashboardStats;
  pending_users: AdminUser[];
}
