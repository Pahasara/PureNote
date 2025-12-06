import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    authService.logout(); // Clear localStorage
    clearAuth(); // Clear Zustand state
    navigate("/login");
  };

  return (
    <nav className="glass border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-neon-blue" />
            <span className="text-xl font-bold">
              Pure<span className="text-neon-blue">Note</span>
            </span>
          </Link>

          {/* User section */}
          <div className="flex items-center gap-4">
            {/* User info */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>

            {/* Logout button */}
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="px-4! py-2!"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
