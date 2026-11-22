// Wraps any page that should only be visible to signed-in members
// (Onboarding, Profile). While the session is loading we show a loader
// instead of flashing content; if there's no user, we redirect to /login.
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { PageLoader } from "@/components/ui/loader";
import { useAuth } from "@/lib/auth";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) return <PageLoader />;
  return children;
}
