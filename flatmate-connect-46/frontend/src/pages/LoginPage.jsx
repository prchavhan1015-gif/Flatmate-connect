// The /login page: an email + password form that signs the user in via
// db.auth.signInWithPassword, then sends them to their profile (or
// onboarding, if they never finished it).
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { usePageTitle } from "@/lib/use-page-title";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(1, "Enter your password").max(72),
});

export default function LoginPage() {
  usePageTitle("Log in to RoomMate");

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/profile", { replace: true });
  }, [authLoading, user, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { data, error } = await db.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);

    if (error) {
      toast.error(
        error.message.includes("Invalid login credentials")
          ? "Wrong email or password. Please try again."
          : error.message,
      );
      return;
    }

    // Send new members to profile completion, everyone else to their profile.
    const { data: profile } = await db
      .from("profiles")
      .select("profile_completed")
      .eq("id", data.user.id)
      .maybeSingle();

    toast.success("Welcome back!");
    navigate(profile?.profile_completed ? "/profile" : "/onboarding");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to RoomMate?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((p) => ({ ...p, email: e.target.value }));
              setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="you@college.edu"
            className="mt-1.5 h-11"
            maxLength={255}
          />
          {errors["email"] ? (
            <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm((p) => ({ ...p, password: e.target.value }));
              setErrors((p) => ({ ...p, password: "" }));
            }}
            placeholder="Your password"
            className="mt-1.5 h-11"
          />
          {errors["password"] ? (
            <p className="mt-1 text-xs text-destructive">{errors["password"]}</p>
          ) : null}
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
