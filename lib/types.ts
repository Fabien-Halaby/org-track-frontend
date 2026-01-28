//! Admin User Data
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
