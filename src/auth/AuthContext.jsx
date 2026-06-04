"use client"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
// // import toast from "react-hot-toast";
import { getProfile, handleLogout, signAPI } from "../lib/auth";

import { isAdmin } from "../env/auth";
import LogOutCover from "../components/ui/LogOutCover/LogOutCover";

// =========================
// CONTEXT
// =========================
const AuthContext = createContext(null);

// =========================
// PROVIDER
// =========================
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  
  const navigate = useNavigate();
 // const queryClient = useQueryClient();

  /**
   * Destroy current session
   */
  const destroySession = useCallback(async (path = "/") => {
    try {
      setIsLoggingOut(true);

      setSession(null);

     // queryClient.clear();

      if (path) {
        navigate(path, { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  /**
   * Update session manually
   */
  const updateSession = useCallback((data) => {
    setSession(data);
  }, []);

  /**
   * Logout user
   */
  const logOut = useCallback(async () => {
    const channel = new BroadcastChannel("auth_channel");

    try {
      setIsLoggingOut(true);

      await handleLogout();

      channel.postMessage({
        message: "logout",
        path: "/",
      });
    } catch (error) {
      channel.postMessage({
        message: "logout",
        path: "/login",
      });
    }
  }, []);

  /**
   * Sign in
   */
  const signIn = useCallback(async ({ data = {}, mode = "signin" }) => {
    try {
      const {
        profile = {},
        message = "Logged in successfully!",
      } = await signAPI(data, mode);
      
      setSession(profile);

      //  queryClient.clear();

      if (!isAdmin(profile)) {
        // toast.success(message);
      }
      return profile
    } catch (error) {
        console.log("🚀 ~ AuthProvider ~ error:", error)
      if (error?.logout) {
        await logOut();
      } else {
        throw error;
      }
    }
  }, []);

  /**
   * Verify current session
   */
  const verifySession = useCallback(async () => {
    try {
      setIsLoading(true);

      const { profile = null } = await getProfile();

      setSession(profile);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Listen for logout across tabs
   */
  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");

    channel.onmessage = (event) => {
      if (event?.data?.message === "logout") {
        destroySession(event?.data?.path);
      }
    };

    verifySession();

    return () => {
      channel.close();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user:session,
        isLoading,
        loading:isLoading,
        isLoggingOut,
        reVerify: verifySession,
        signIn,
        logOut,
        updateSession,
        destroySession,
      }}
    >
      {isLoggingOut ? (
        <LogOutCover onFinish={() => setIsLoggingOut(false)} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// =========================
// HOOK
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};