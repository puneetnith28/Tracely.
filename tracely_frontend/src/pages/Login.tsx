import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: "MANUFACTURER",   label: "Manufacturer",   icon: "🏭", desc: "Create batches & set baseline" },
  { value: "DISTRIBUTOR",    label: "Distributor",    icon: "🚛", desc: "Transport & handoff inventory" },
  { value: "WAREHOUSE",      label: "Warehouse",      icon: "🏢", desc: "Receive, store & dispatch" },
  { value: "DELIVERY_PERSON",label: "Delivery Person",icon: "📦", desc: "Last-mile delivery agent" },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithSocial, loginWithPassword, isAuthenticated, isLoading, user } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail]           = useState("");
  const [pendingRole, setPendingRole] = useState<UserRole>("WAREHOUSE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pick up error from AuthCallback redirect
  useEffect(() => {
    if (location.state?.error) {
      setErrorMessage(location.state.error);
      navigate(location.pathname, { replace: true, state: null });
    }
    if (location.state?.tab === "signup" || location.state?.tab === "login") {
      setActiveTab(location.state.tab);
    }
  }, [location.state, navigate, location.pathname]);

  // Already logged in → go home (only if role is selected)
  useEffect(() => {
    if (isAuthenticated && !isLoading && user?.role) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, user?.role, navigate]);

  if (isAuthenticated && !isLoading && user?.role) return null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const savePendingRole = () => {
    if (activeTab === "signup") {
      localStorage.setItem("tracely_pending_role", pendingRole);
    }
  };

  const handleSocialLogin = async (connection: "google-oauth2" | "apple") => {
    savePendingRole();
    setIsSubmitting(true);
    try {
      await loginWithSocial(connection, activeTab === "signup");
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Login failed. Please try again.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErrorMessage("Please enter your email address."); return; }
    savePendingRole();
    setIsSubmitting(true);
    try {
      await loginWithPassword(email, activeTab === "signup");
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Login failed. Please try again.");
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Tracely
          </CardTitle>
          <CardDescription className="text-center text-slate-500 dark:text-slate-400">
            Secure Supply Chain Verification
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start justify-between gap-2">
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-600 flex-shrink-0 font-bold text-lg leading-none"
              >×</button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login"  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500">Sign Up</TabsTrigger>
            </TabsList>

            {/* ── LOG IN tab ── */}
            <TabsContent value="login" className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-sm"
                onClick={() => handleSocialLogin("google-oauth2")}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">or</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" placeholder="yours@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                    <button
                      type="button"
                      className="text-xs text-orange-500 hover:underline"
                      onClick={() => window.open(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/change_password`, "_blank")}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="password" type="password" placeholder="your password"
                      className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" required />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all active:scale-[0.98]" disabled={!email || isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : <>LOG IN <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>

            {/* ── SIGN UP tab ── */}
            <TabsContent value="signup" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <Label className="text-sm font-semibold block mb-1">Account Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setPendingRole(r.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        pendingRole === r.value
                          ? "border-orange-500 bg-orange-500/5 ring-1 ring-orange-500 shadow-sm"
                          : "border-slate-200 dark:border-slate-700 bg-transparent hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="text-xl mb-1">{r.icon}</div>
                      <div className={`font-bold text-xs ${pendingRole === r.value ? "text-orange-500" : "text-slate-700 dark:text-slate-200"}`}>{r.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-sm"
                onClick={() => handleSocialLogin("google-oauth2")}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">or</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="signup-email" type="email" placeholder="yours@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all active:scale-[0.98]" disabled={!email || isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Redirecting...</> : <>SIGN UP <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
