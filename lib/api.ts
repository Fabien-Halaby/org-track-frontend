/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance } from "axios";

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
  school_id?: string;
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

export interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: LoginResponse;
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

    // Intercepteur pour ajouter le token
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les réponses
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Si 401 et qu'on a un refresh token, essayer de rafraîchir
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
          
          if (refreshToken) {
            try {
              // TODO: Implémenter le refresh token endpoint
              // const response = await this.client.post("/auth/refresh", { refresh_token: refreshToken });
              // localStorage.setItem("access_token", response.data.access_token);
              // return this.client(originalRequest);
            } catch (refreshError: any) {
              // Si le refresh échoue, déconnecter
              console.error("Refresh token failed:", refreshError);
              if (typeof window !== "undefined") {
                localStorage.clear();
                window.location.href = "/login";
              }
            }
          } else {
            // Pas de refresh token, déconnecter
            if (typeof window !== "undefined") {
              localStorage.clear();
              window.location.href = "/login";
            }
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
      const response = await this.client.post<SchoolRegistrationResponse>(
        "/schools/register",
        data
      );

      return {
        success: true,
        data: response.data,
        message: response.data.message || "École créée avec succès",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Une erreur est survenue";

        return {
          success: false,
          error: message,
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
      const response = await this.client.post<BackendLoginResponse>("/auth/login", credentials);

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
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Email ou mot de passe incorrect";

        return {
          success: false,
          error: message,
        };
      }

      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    }
  }
}

export const api = new ApiClient(API_BASE_URL);
