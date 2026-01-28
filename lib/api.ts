/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AdminUser, UsersResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SchoolRegistrationData {
  school_name: string;
  admin_email: string;
  admin_password: string;
  admin_name: string;
  phone: string;
  address: string;
}

export interface SchoolRegistrationResponse {
  id?: string;
  school_id?: number;
  message?: string;
  token?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status: string;
  school_id: number;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async registerSchool(
    data: SchoolRegistrationData
  ): Promise<ApiResponse<SchoolRegistrationResponse>> {
    try {
      const response = await this.client.post<any>("/schools/register", data);

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: true,
        data: response.data,
        message: response.data.message || "École créée avec succès",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || error.response?.data?.message || "Erreur lors de l'inscription",
        };
      }
      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    }
  }

  async login(credentials: LoginData): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.client.post<BackendResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: "Réponse invalide du serveur",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || error.response?.data?.message || "Email ou mot de passe incorrect",
        };
      }
      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get<BackendResponse<User>>("/me");
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: "Impossible de récupérer les informations utilisateur",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || "Erreur serveur",
        };
      }
      return {
        success: false,
        error: "Erreur de connexion",
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      //! await this.client.post("/auth/logout");
      return {
        success: true,
        message: "Déconnexion réussie",
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: true,
        message: "Déconnexion locale",
      };
    }
  }



  //! Admin related methods
  async getPendingUsers(): Promise<ApiResponse<UsersResponse>> {
    try {
      const response = await this.client.get<BackendResponse<UsersResponse>>("/admin/users/pending");
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || "Erreur",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }
      return {
        success: false,
        error: "Erreur de connexion",
      };
    }
  }

  async approveUser(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.post<BackendResponse<void>>(
        `/admin/users/${userId}/approve`
      );
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || "Erreur",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }
      return {
        success: false,
        error: "Erreur de connexion",
      };
    }
  }

  async rejectUser(userId: number, reason?: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.post<BackendResponse<void>>(
        `/admin/users/${userId}/reject`,
        reason ? { rejection_reason: reason } : {}
      );
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || "Erreur",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }
      return {
        success: false,
        error: "Erreur de connexion",
      };
    }
  }

  async getAllUsers(filters?: {
    role?: string;
    status?: string;
  }): Promise<ApiResponse<UsersResponse>> {
    try {
      const params = new URLSearchParams();
      if (filters?.role) params.append("role", filters.role);
      if (filters?.status) params.append("status", filters.status);

      const url = `/admin/users${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.client.get<BackendResponse<UsersResponse>>(url);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || "Erreur",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }
      return {
        success: false,
        error: "Erreur de connexion",
      };
    }
  }
}

export const api = new ApiClient(API_BASE_URL);
