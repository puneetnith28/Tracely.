import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        logout({ logoutParams: { returnTo: window.location.origin } });
      } else {
        let errorMsg = 'Failed to delete account';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        alert(`Error: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Deletion failed:", err);
      alert(`Connection failed: ${err.message || 'Server unreachable'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/admin', label: 'Admin' },
    { path: '/log-event', label: 'Log Event' },
    { path: '/verify', label: 'Verify' },
    { path: '/integrity-check', label: 'Integrity Check' }
  ];

  return (
    <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size="md" className="text-white" />
            <span className="text-2xl font-bold text-white tracking-tight">
              Tracely
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-white group",
                  location.pathname === link.path ? "text-white" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-white/10">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        Role: {user.role?.replace('_', ' ') || 'None'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleDeleteAccount} 
                    disabled={isDeleting}
                    className="text-red-400 focus:bg-red-400/10 focus:text-red-400"
                  >
                    <X className="mr-2 h-4 w-4" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="text-white focus:bg-white/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" state={{ tab: "login" }} className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/login" state={{ tab: "signup" }}>
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 h-9 text-sm font-medium shadow-[0_0_15px_rgba(138,92,246,0.3)]">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-2 overflow-hidden border-t border-white/5"
            >
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path 
                      ? "bg-white/10 text-white" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                  <Link
                    to="/login"
                    state={{ tab: "login" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    state={{ tab: "signup" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
