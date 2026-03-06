"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdminSession } from "@/lib/api/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean; // New prop to check for admin authentication
}

export default function ProtectedRoute({ 
  children, 
  redirectTo, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Determine default redirect based on admin requirement
      const defaultRedirect = requireAdmin ? "/admin/login" : "/auth";
      const redirect = redirectTo || defaultRedirect;
      
      if (requireAdmin) {
        // For admin routes, check admin authentication
        const hasAdminAuth = isAuthenticated(true);
        const isAdmin = isAdminSession();
        
        if (!hasAdminAuth || !isAdmin) {
          // Store current path for redirect after login
          const currentPath = window.location.pathname;
          router.push(`${redirect}?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
      } else {
        // For regular routes, check user authentication
        if (!isAuthenticated(false)) {
          // Store current path for redirect after login
          const currentPath = window.location.pathname;
          router.push(`${redirect}?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [router, redirectTo, requireAdmin]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-400 font-semibold">
            {requireAdmin ? "Verifying admin access..." : "Verifying access..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
