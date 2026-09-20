import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";

// Type for Auth0 error with additional properties
interface Auth0Error extends Error {
  error?: string;
  error_description?: string;
}

export const AuthCallback = () => {
  const { isLoading, isAuthenticated, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User successfully authenticated, redirect to home
        navigate("/", { replace: true });
      } else if (error) {
        // Handle error - redirect back to login
        console.error("Auth error:", error);
        const auth0Error = error as Auth0Error;
        let errorMessage = error.message || "Authentication failed";
        
        // Map specific Auth0 error types to user-friendly messages
        if (auth0Error.error === 'access_denied') {
          errorMessage = "Access denied. Please check your Auth0 application settings and ensure the connection is properly configured.";
        } else if (auth0Error.error === 'invalid_request' ||
            error.message?.includes('connection') ||
            error.message?.includes('not enabled') ||
            auth0Error.error_description?.includes('connection')) {
          errorMessage = `Authentication connection error: ${auth0Error.error_description || error.message}. Please verify your Auth0 Dashboard connection settings.`;
        } else if (error.message?.includes('email') || 
                   auth0Error.error_description?.includes('email')) {
          errorMessage = `Email configuration error: ${auth0Error.error_description || error.message}`;
        }
        
        navigate("/login", { 
          replace: true,
          state: { error: errorMessage }
        });
      }
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
        <p className="text-slate-600 dark:text-slate-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

