import { LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { developer, navigationItems } from "../data/navigation.js";
import { cx } from "../utils/formatters.js";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = navigationItems.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <div className="min-h-screen bg-ink bg-app-radial text-white">
      <div className="fixed inset-0 premium-grid opacity-40" />
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#071016]/90 p-5 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-lg font-black text-ink">H</span>
            <span>
              <span className="block text-lg font-bold">HireSense AI</span>
              <span className="text-xs text-white/40">by {developer.name}</span>
            </span>
          </button>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive ? "bg-mint text-ink shadow-glow" : "text-white/60 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-coral/10 text-coral">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.full_name || developer.name}</p>
              <p className="text-xs text-white/40">{user?.role || "student"}</p>
            </div>
          </div>
          <Button variant="secondary" icon={LogOut} className="mt-4 w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071016]/75 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center justify-between gap-4">
            <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2.5 text-white/40 md:flex">
              <Search className="h-4 w-4" />
              <span className="text-sm">Search analyses, skills, and interview sets</span>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-semibold">{user?.full_name}</p>
              <p className="text-xs text-white/40">{user?.email}</p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
