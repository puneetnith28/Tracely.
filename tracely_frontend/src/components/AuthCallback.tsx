import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";

interface Auth0Error extends Error {
  error?: string;
  error_description?: string;
}


export const AuthCallback = () => {
  const { isLoading, isAuthenticated, error, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (isLoading || handled.current) return;

    if (error) {
      handled.current = true;
      const auth0Error = error as Auth0Error;
      let msg = error.message || "Authentication failed";
      if (auth0Error.error === "access_denied") {
        msg = "Access denied. Please check your Auth0 application settings.";
      } else if (
        auth0Error.error === "invalid_request" ||
        error.message?.includes("connection")
      ) {
        msg = `Auth connection error: ${auth0Error.error_description || error.message}`;
      }
      navigate("/login", { replace: true, state: { error: msg } });
      return;
    }

    if (isAuthenticated && user?.sub) {
      handled.current = true;

      getAccessTokenSilently()
        .then(async (token) => {
          // Check MongoDB — is this a returning user or a new one?
          const res = await fetch(`/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const userData = res.ok ? await res.json() : null;
          const userExists = res.status !== 404 && userData;
          const hasRole = userExists && userData.role && userData.role !== 'null';

          if (!hasRole) {
            // ── New or uninitialized user: check for a pending role choice ──
            const pendingRole = localStorage.getItem("tracely_pending_role");
            
            if (pendingRole) {
              // We have a choice! Save it.
              await fetch(`/api/user/profile`, {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  email:   user.email || "",
                  name:    user.name || user.email || "",
                  picture: user.picture || "",
                  role:    pendingRole,
                }),
              });
              localStorage.removeItem("tracely_pending_role");
              navigate("/", { replace: true });
            } else {
              // No choice made (e.g. clicked "Log In" with Google instead of "Sign Up")
              // Send them back to picked a role on the Signup tab.
              navigate("/login", { 
                replace: true, 
                state: { 
                  tab: "signup",
                  error: "Please select an account role to complete your registration." 
                } 
              });
            }
          } else {
            // ── Returning user with established role ──
            localStorage.removeItem("tracely_pending_role"); 
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.warn("Could not reach user profile API:", err);
          navigate("/", { replace: true });
        });
    }
  }, [isLoading, isAuthenticated, error, user, navigate, getAccessTokenSilently]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
        <p className="text-slate-400">Completing authentication...</p>
      </div>
    </div>
  );
};
