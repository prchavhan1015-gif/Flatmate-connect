// Shared two-column layout for the Login and Signup pages: a brand/photo
// panel on the left (hidden on small screens), and the actual form on the
// right, wrapped in a card.
import { Link } from "react-router-dom";
import { Home, Quote } from "lucide-react";

import heroImage from "@/assets/hero-roommates.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImage}
          alt="Roommates sharing a sunlit living room"
          width={1200}
          height={1408}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand opacity-25" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 rounded-xl glass-panel px-3 py-2 font-display font-bold"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
              <Home className="size-4" />
            </span>
            RoomMate
          </Link>
          <div className="glass-panel max-w-sm rounded-2xl p-6">
            <Quote className="size-6 text-primary" />
            <p className="mt-3 text-sm leading-relaxed">
              “I found someone with the same budget, the same sleep schedule and a shared love for
              bad movies. Best flat year of my life.”
            </p>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">
              Neha S. · Software Engineer, Pune
            </p>
          </div>
        </div>
      </aside>

      {/* Right: form */}
      <main className="flex flex-col bg-hero-glow">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="flex items-center gap-2 font-display font-bold lg:invisible">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
              <Home className="size-4" />
            </span>
            RoomMate
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md animate-fade-up rounded-3xl border border-border bg-card p-8 shadow-lifted">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-7">{children}</div>
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
