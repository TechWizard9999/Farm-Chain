"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { graphqlRequest } from "@/lib/apollo-client";
import {
  LOGIN_QUERY,
  SIGNUP_QUERY,
  ME_QUERY,
  BUSINESS_LOGIN_QUERY,
  BUSINESS_SIGNUP_QUERY,
} from "@/lib/graphql/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("farmchain_token");
      const storedUser = localStorage.getItem("farmchain_user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        try {
          const data = await graphqlRequest(ME_QUERY);
          if (data?.me) {
            setUser(data.me);
            localStorage.setItem("farmchain_user", JSON.stringify(data.me));
          }
        } catch (err) {
          console.error("Auth refresh failed:", err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (identifier, password, role) => {
    try {
      const data = await graphqlRequest(LOGIN_QUERY, { identifier, password, role });
      if (data?.login) {
        localStorage.setItem("farmchain_token", data.login.token);
        localStorage.setItem("farmchain_user", JSON.stringify(data.login.user));
        setUser(data.login.user);
        return { success: true, user: data.login.user };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, phone, password, role) => {
    try {
      const data = await graphqlRequest(SIGNUP_QUERY, {
        name,
        email,
        phone,
        password,
        role,
      });
      if (data?.signup) {
        localStorage.setItem("farmchain_token", data.signup.token);
        localStorage.setItem(
          "farmchain_user",
          JSON.stringify(data.signup.user),
        );
        setUser(data.signup.user);
        return { success: true, user: data.signup.user };
      }
      return { success: false, error: "Signup failed" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const businessLogin = async (identifier, password) => {
    try {
      const data = await graphqlRequest(BUSINESS_LOGIN_QUERY, {
        identifier,
        password,
      });
      if (data?.businessLogin) {
        localStorage.setItem("farmchain_token", data.businessLogin.token);
        localStorage.setItem(
          "farmchain_user",
          JSON.stringify({ ...data.businessLogin.business, role: "business" }),
        );
        setUser({ ...data.businessLogin.business, role: "business" });
        return { success: true, user: data.businessLogin.business };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const businessSignup = async (businessData) => {
    try {
      const data = await graphqlRequest(BUSINESS_SIGNUP_QUERY, businessData);
      if (data?.businessSignup) {
        localStorage.setItem("farmchain_token", data.businessSignup.token);
        localStorage.setItem(
          "farmchain_user",
          JSON.stringify({ ...data.businessSignup.business, role: "business" }),
        );
        setUser({ ...data.businessSignup.business, role: "business" });
        return { success: true, user: data.businessSignup.business };
      }
      return { success: false, error: "Signup failed" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("farmchain_token");
    localStorage.removeItem("farmchain_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isFarmer: user?.role === "farmer",
        isConsumer: user?.role === "consumer",
        isBusiness: user?.role === "business",
        login,
        signup,
        businessLogin,
        businessSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
