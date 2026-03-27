import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LogOut, Moon, Sun, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>Sniplink</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {isAuthenticated && (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user?.name}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
