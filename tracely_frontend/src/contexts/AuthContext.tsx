import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0, User as Auth0User } from '@auth0/auth0-react';
import type { UserRole } from '@/types';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-tij06cqg4bb0xmn5.us.auth0.com';
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || 'r8p2MkfpgFPJxVXBWzTW90jbUDpgcbzL';
const AUTH0_AUDIENCE =
  import.meta.env.VITE_AUTH0_AUDIENCE?.trim() || undefined;
const AUTH0_NAMESPACE =
  import.meta.env.VITE_AUTH0_NAMESPACE || 'https://tracely.app';

export const AUTH0_CONFIG = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: AUTH0_AUDIENCE,
};

export interface User {
  id: string;
  email: string;
  role: UserRole | null;
  name: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profileLoading: boolean;
  user: User | null;
  loginWithRedirect: (options?: any) => Promise<void>;
  logout: (options?: any) => void;
  getAccessTokenSilently: () => Promise<string>;
  loginWithPassword:    (email: string, isSignup?: boolean) => Promise<void>;
  loginWithSocial:      (connection: string, isSignup?: boolean) => Promise<void>;
  loginWithPasswordless:(email: string, isSignup?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated,
    isLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [appUser, setAppUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Whenever the Auth0 user changes, fetch their profile from MongoDB
  useEffect(() => {
    if (!isAuthenticated || !auth0User?.sub) {
      setAppUser(null);
      return;
    }

    setProfileLoading(true);

    getAccessTokenSilently()
      .then(token => {
        return fetch(`/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      })
      .then(async (res) => {
        if (res.ok) {
          const profile = await res.json();
          setAppUser({
            id:      profile.sub,
            email:   profile.email || auth0User.email || '',
            name:    profile.name  || auth0User.name  || '',
            picture: profile.picture || auth0User.picture || '',
            role:    (profile.role as UserRole) || fallbackRole(auth0User),
          });
        } else {
          // Profile not in DB yet — use token claim as temporary fallback
          setAppUser(buildFromAuth0User(auth0User));
        }
      })
      .catch(() => {
        // Network error — use token claim as fallback
        setAppUser(buildFromAuth0User(auth0User));
      })
      .finally(() => setProfileLoading(false));
  }, [isAuthenticated, auth0User?.sub]);

  // ─── Auth0 helpers ──────────────────────────────────────────────────────────

  const loginWithSocial = async (connection: string, isSignup = false) => {
    await loginWithRedirect({
      authorizationParams: {
        connection,
        ...(AUTH0_AUDIENCE && { audience: AUTH0_AUDIENCE }),
        scope: 'openid profile email offline_access',
        ...(isSignup && { screen_hint: 'signup' }),
      },
      appState: { returnTo: '/callback' },
    });
  };

  const loginWithPassword = async (email: string, isSignup = false) => {
    await loginWithRedirect({
      authorizationParams: {
        connection: 'Username-Password-Authentication',
        login_hint: email,
        ...(AUTH0_AUDIENCE && { audience: AUTH0_AUDIENCE }),
        scope: 'openid profile email offline_access',
        ...(isSignup && { screen_hint: 'signup' }),
      },
      appState: { returnTo: '/callback' },
    });
  };

  // Passwordless kept for backward compatibility
  const loginWithPasswordless = async (email: string, _isSignup = false) => {
    await loginWithRedirect({
      authorizationParams: {
        connection: 'email',
        login_hint: email,
        scope: 'openid profile email',
      },
      appState: { returnTo: '/callback' },
    });
  };

  const logout = (options?: any) => {
    setAppUser(null);
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
        ...(options?.logoutParams || {}),
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: isLoading || profileLoading,
        profileLoading,
        user: appUser,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        loginWithPassword,
        loginWithSocial,
        loginWithPasswordless,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fallbackRole(auth0User: Auth0User): UserRole | null {
  const payload = auth0User as any;
  const role = payload[`${AUTH0_NAMESPACE}/role`] || payload.role;
  return (role && role !== 'null' ? role : null) as UserRole | null;
}

function buildFromAuth0User(auth0User: Auth0User): User {
  return {
    id:      auth0User.sub || '',
    email:   auth0User.email || '',
    name:    auth0User.name || auth0User.nickname || '',
    picture: auth0User.picture || '',
    role:    fallbackRole(auth0User),
  };
}
