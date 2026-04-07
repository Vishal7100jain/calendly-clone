// hooks/useAuth.ts
import { authActions } from "@/actions/auth.action";
import { LoginCredentials, RegisterData } from "@/types";
import { useAuthStore } from "@/zustand/user.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAuth = () => {
  const router = useRouter();
  const { user, token, isAuthenticated, setUser, setToken, clearAuth } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = authActions.getCurrentUser();
    const currentToken = localStorage.getItem("auth_token");
    if (currentUser && currentToken) {
      setUser(currentUser);
      setToken(currentToken);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const response = await authActions.login(credentials);
    if (response?.status == "success" && response?.data?.token) {
      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setToken(token);

      toast.success(response?.message || "Login successful!");
      router.push("/admin");
      return true;
    } else {
      toast.error(response?.message);
    }
    setIsLoading(false);
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    const response = await authActions.register(data);
    if (response?.status == "success" && response?.data?.token) {
      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Store in Zustand and localStorage
      setUser(user);
      setToken(token);

      toast.success(response?.message || "Registration successful!");
      router.push("/admin");
      return true;
    } else {
      toast.error(response?.message);
    }
    setIsLoading(false);
  };

  const logout = () => {
    authActions.logout();
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
