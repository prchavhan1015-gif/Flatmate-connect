// The /signup page: creates an account (db.auth.signUp) and the matching
// profile row (db.from("profiles").insert), then sends the new member to
// onboarding.
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z.string().min(8, "Use at least 8 characters").max(72),
    confirmPassword: z.string(),
    userType: z.enum(["student", "professional"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const USER_TYPES = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "professional", label: "Working professional", icon: Briefcase },
];

export default function SignupPage() {
  usePageTitle("Create your RoomMate account");

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/profile", { replace: true });
  }, [authLoading, user, navigate]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const parsed = signupSchema.safeParse(form);
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
    const { data, error } = await db.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { full_name: parsed.data.fullName } },
    });

    if (error) {
      setSubmitting(false);
      toast.error(
        error.message.includes("already registered")
          ? "That email already has an account. Try logging in."
          : error.message,
      );
      return;
    }

    // Create the matching profile row for the new user.
    if (data.user) {
      const { error: profileError } = await db.from("profiles").insert({
        id: data.user.id,
        full_name: parsed.data.fullName,
        email: parsed.data.email,
        user_type: parsed.data.userType,
      });
      if (profileError) console.error(profileError);
    }

    setSubmitting(false);
    toast.success("Welcome to RoomMate! Let's complete your profile.");
    navigate("/onboarding");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the community and find your ideal roommate."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Purvesh Rathi"
            className="mt-1.5 h-11"
            maxLength={80}
          />
          {errors["fullName"] ? (
            <p className="mt-1 text-xs text-destructive">{errors["fullName"]}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@college.edu"
            className="mt-1.5 h-11"
            maxLength={255}
          />
          {errors["email"] ? (
            <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 8 characters"
              className="mt-1.5 h-11"
            />
            {errors["password"] ? (
              <p className="mt-1 text-xs text-destructive">{errors["password"]}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Repeat password"
              className="mt-1.5 h-11"
            />
            {errors["confirmPassword"] ? (
              <p className="mt-1 text-xs text-destructive">{errors["confirmPassword"]}</p>
            ) : null}
          </div>
        </div>

        <div>
          <Label>I am a</Label>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            {USER_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => update("userType", type.value)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  form.userType === type.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/40",
                )}
              >
                <type.icon className="size-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>
    </AuthLayout>
  );
}
