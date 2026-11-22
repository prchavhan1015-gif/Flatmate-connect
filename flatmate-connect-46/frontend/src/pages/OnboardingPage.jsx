// The /onboarding page: a 3-step form (about you -> living plans ->
// lifestyle/interests) that saves into the signed-in user's profile row.
// Also used for "Edit profile", since it prefills from the existing data.
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Camera, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { InterestChips } from "@/components/InterestChips";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { RequireAuth } from "@/components/RequireAuth";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { usePageTitle } from "@/lib/use-page-title";
import { CITIES, INTEREST_OPTIONS, LIFESTYLE_OPTIONS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

const detailsSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(80),
  age: z.coerce.number().int().min(17, "You must be at least 17").max(90),
  gender: z.string().min(1, "Select an option"),
  occupation: z.string().trim().min(2, "Tell us what you do").max(80),
  organization: z.string().trim().min(2, "College or company name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number"),
});

const livingSchema = z.object({
  city: z.string().min(1, "Select your city"),
  budget: z.coerce.number().int().min(1000, "Minimum ₹1,000").max(200000, "Maximum ₹2,00,000"),
  move_in_date: z.string().min(1, "Pick a move-in date"),
  bio: z.string().trim().min(20, "Write at least 20 characters").max(500),
});

const EMPTY = {
  full_name: "",
  age: "",
  gender: "",
  occupation: "",
  organization: "",
  phone: "",
  city: "",
  budget: "",
  move_in_date: "",
  bio: "",
  food_preference: "",
  smoking: "",
  drinking: "",
  pets: "",
  sleep_schedule: "",
  cleanliness: "",
};

const STEP_LABELS = ["About you", "Living plans", "Lifestyle & interests"];

export default function OnboardingPage() {
  return (
    <RequireAuth>
      <OnboardingForm />
    </RequireAuth>
  );
}

function OnboardingForm() {
  usePageTitle("Complete your RoomMate profile");

  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const fileInput = useRef(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [interests, setInterests] = useState([]);
  const [avatarPath, setAvatarPath] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Prefill from the saved profile (also powers "Edit profile").
  useEffect(() => {
    if (!profile || hydrated) return;
    setForm({
      full_name: profile.full_name ?? "",
      age: profile.age ? String(profile.age) : "",
      gender: profile.gender ?? "",
      occupation: profile.occupation ?? "",
      organization: profile.organization ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      budget: profile.budget ? String(profile.budget) : "",
      move_in_date: profile.move_in_date ?? "",
      bio: profile.bio ?? "",
      food_preference: profile.food_preference ?? "",
      smoking: profile.smoking ?? "",
      drinking: profile.drinking ?? "",
      pets: profile.pets ?? "",
      sleep_schedule: profile.sleep_schedule ?? "",
      cleanliness: profile.cleanliness ?? "",
    });
    setInterests(profile.interests ?? []);
    setAvatarPath(profile.avatar_url);
    setHydrated(true);
  }, [profile, hydrated]);

  const progress = useMemo(() => ((step + 1) / STEP_LABELS.length) * 100, [step]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(schema, values) {
    const parsed = schema.safeParse(values);
    if (parsed.success) return true;
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleAvatar(event) {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please choose an image under 5 MB.");
      return;
    }

    setUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${extension}`;
    const { error } = await db.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    setUploading(false);

    if (error) {
      toast.error("We couldn't upload that photo. Please try again.");
      return;
    }
    setAvatarPath(path);
    toast.success("Photo uploaded");
  }

  function goNext() {
    if (step === 0) {
      if (
        !validate(detailsSchema, {
          full_name: form.full_name,
          age: form.age,
          gender: form.gender,
          occupation: form.occupation,
          organization: form.organization,
          phone: form.phone,
        })
      )
        return;
    }
    if (step === 1) {
      if (
        !validate(livingSchema, {
          city: form.city,
          budget: form.budget,
          move_in_date: form.move_in_date,
          bio: form.bio,
        })
      )
        return;
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  async function handleSave() {
    const missing = Object.entries(LIFESTYLE_OPTIONS).find(([key]) => !form[key]);
    if (missing) {
      toast.error("Please answer every lifestyle question.");
      return;
    }
    if (interests.length < 3) {
      toast.error("Pick at least 3 interests.");
      return;
    }
    if (!user) return;

    setSaving(true);
    const { error } = await db
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        age: Number(form.age),
        gender: form.gender,
        occupation: form.occupation.trim(),
        organization: form.organization.trim(),
        phone: form.phone.trim(),
        city: form.city,
        budget: Number(form.budget),
        move_in_date: form.move_in_date,
        bio: form.bio.trim(),
        food_preference: form.food_preference,
        smoking: form.smoking,
        drinking: form.drinking,
        pets: form.pets,
        sleep_schedule: form.sleep_schedule,
        cleanliness: form.cleanliness,
        interests,
        avatar_url: avatarPath,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast.error("We couldn't save your profile. Please try again.");
      return;
    }
    await refreshProfile();
    toast.success("Profile saved!");
    navigate("/profile");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold">
          {profile?.profile_completed ? "Edit your profile" : "Complete your profile"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          The more you share, the better your matches. It takes about two minutes.
        </p>

        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>
              Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>

        <div className="mt-8 animate-fade-up rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {step === 0 ? (
            <div className="space-y-5">
              <div className="flex items-center gap-5">
                <ProfileAvatar
                  path={avatarPath}
                  name={form.full_name || "RoomMate"}
                  className="size-20 rounded-3xl text-lg"
                />
                <div>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatar}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInput.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Camera className="size-4" />
                    )}
                    {uploading ? "Uploading…" : "Upload photo"}
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">JPG or PNG, up to 5 MB.</p>
                </div>
              </div>

              <Field label="Full name" error={errors["full_name"]}>
                <Input
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  placeholder="Purvesh Rathi"
                  maxLength={80}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Age" error={errors["age"]}>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    placeholder="22"
                  />
                </Field>
                <Field label="Gender" error={errors["gender"]}>
                  <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Occupation" error={errors["occupation"]}>
                  <Input
                    value={form.occupation}
                    onChange={(e) => update("occupation", e.target.value)}
                    placeholder="Software Engineer"
                    maxLength={80}
                  />
                </Field>
                <Field label="College / Company" error={errors["organization"]}>
                  <Input
                    value={form.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    placeholder="VIT Pune"
                    maxLength={120}
                  />
                </Field>
              </div>

              <Field
                label="Phone number"
                hint="Only shared with people you match with."
                error={errors["phone"]}
              >
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  maxLength={15}
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Preferred city" error={errors["city"]}>
                  <Select value={form.city} onValueChange={(v) => update("city", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Monthly budget (₹)" error={errors["budget"]}>
                  <Input
                    type="number"
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    placeholder="12000"
                  />
                </Field>
              </div>

              <Field label="Preferred move-in date" error={errors["move_in_date"]}>
                <Input
                  type="date"
                  value={form.move_in_date}
                  onChange={(e) => update("move_in_date", e.target.value)}
                />
              </Field>

              <Field
                label="About you"
                hint="A short intro helps people decide to reach out."
                error={errors["bio"]}
              >
                <Textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="I'm a final-year student who loves quiet mornings, home-cooked food and weekend football."
                  rows={5}
                  maxLength={500}
                />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-7">
              {Object.entries(LIFESTYLE_OPTIONS).map(([key, options]) => (
                <div key={key}>
                  <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {options.map((option) => {
                      const active = form[key] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => update(key, option)}
                          className={cn(
                            "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5",
                            active
                              ? "border-transparent bg-gradient-brand text-primary-foreground shadow-soft"
                              : "border-border bg-secondary text-secondary-foreground",
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div>
                <Label>Interests</Label>
                <p className="mt-1 text-xs text-muted-foreground">Choose at least 3.</p>
                <InterestChips
                  className="mt-2"
                  options={INTEREST_OPTIONS}
                  selected={interests}
                  onToggle={(value) =>
                    setInterests((prev) =>
                      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" /> Back
            </Button>

            {step < STEP_LABELS.length - 1 ? (
              <Button type="button" variant="hero" onClick={goNext}>
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" variant="hero" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                {saving ? "Saving…" : "Save profile"}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
