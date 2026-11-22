// The top navigation bar shown on every page: logo, page/section links,
// theme toggle, and login/profile buttons. Collapses into a slide-down
// menu on small screens.
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";

import { ProfileAvatar } from "@/components/ProfileAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Roommates", to: "/#roommates" },
  { label: "Find Matches", to: "/matches" },
  { label: "FAQ", to: "/#faq" },
];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass-panel">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
            <Home className="size-5" />
          </span>
          Room<span className="-ml-2 text-gradient-brand">Mate</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2">
                <ProfileAvatar
                  path={profile?.avatar_url ?? null}
                  name={profile?.full_name ?? "Member"}
                  className="size-9 rounded-xl"
                />
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="size-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="animate-fade-up border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link to="/profile">
                    <User className="size-4" /> My profile
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="size-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" asChild onClick={() => setOpen(false)}>
                  <Link to="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
