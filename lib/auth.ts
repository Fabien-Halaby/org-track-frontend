import { User } from "./api";

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }
};
