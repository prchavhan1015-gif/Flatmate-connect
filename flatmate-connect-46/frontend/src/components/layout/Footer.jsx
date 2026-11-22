// The site footer shown at the bottom of every page: logo/blurb, link
// columns, and copyright line.
import { Link } from "react-router-dom";
import { Home, Instagram, Linkedin, Twitter } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Home", to: "/" },
      { label: "Create account", to: "/signup" },
      { label: "Login", to: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Home className="size-5" />
            </span>
            Room<span className="-ml-2 text-gradient-brand">Mate</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            RoomMate helps students and working professionals find people they will actually enjoy
            living with — matched on budget, city, lifestyle and interests.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <span
                key={i}
                className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold">Coming next</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Compatibility scores</li>
            <li>Property listings</li>
            <li>Saved profiles</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} RoomMate. Built as a student project.
      </div>
    </footer>
  );
}
