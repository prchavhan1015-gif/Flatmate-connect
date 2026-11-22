// The /profile page: read-only view of the signed-in user's saved profile,
// with an "Edit profile" button that goes back to onboarding.
import { Link } from "react-router-dom";
import {
  Briefcase,
  CalendarDays,
  Cake,
  IndianRupee,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

import { InterestChips } from "@/components/InterestChips";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { RequireAuth } from "@/components/RequireAuth";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { completionPercentage } from "@/lib/profile";
import { usePageTitle } from "@/lib/use-page-title";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}

function ProfileView() {
  usePageTitle("Your RoomMate profile");

  const { profile } = useAuth();

  if (!profile) return <PageLoader />;

  const completion = completionPercentage(profile);
  const lifestyle = [
    { label: "Food", value: profile.food_preference },
    { label: "Smoking", value: profile.smoking },
    { label: "Drinking", value: profile.drinking },
    { label: "Pets", value: profile.pets },
    { label: "Sleep schedule", value: profile.sleep_schedule },
    { label: "Cleanliness", value: profile.cleanliness },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {!profile.profile_completed ? (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-5">
            <div>
              <p className="font-semibold">Your profile isn't finished yet</p>
              <p className="text-sm text-muted-foreground">
                Complete it so other members can find and trust you.
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/onboarding">Complete profile</Link>
            </Button>
          </div>
        ) : null}

        {/* Header card */}
        <section className="animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-lifted">
          <div className="h-32 bg-gradient-brand sm:h-40" />
          <div className="px-6 pb-8 sm:px-8">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <ProfileAvatar
                  path={profile.avatar_url}
                  name={profile.full_name}
                  className="size-24 rounded-3xl border-4 border-card text-xl"
                />
                <div className="pb-1">
                  <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  <p className="text-sm text-muted-foreground capitalize">
                    {profile.occupation ?? profile.user_type}
                    {profile.organization ? ` · ${profile.organization}` : ""}
                  </p>
                </div>
              </div>
              <Button variant="hero" asChild>
                <Link to="/onboarding">
                  <Pencil className="size-4" /> Edit profile
                </Link>
              </Button>
            </div>

            {profile.bio ? (
              <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{profile.bio}</p>
            ) : null}

            <div className="mt-6 rounded-2xl border border-border bg-secondary/60 p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" /> Profile strength
                </span>
                <span>{completion}%</span>
              </div>
              <Progress value={completion} className="mt-2 h-2" />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoCard title="Basic details">
            <InfoRow icon={UserRound} label="Member type" value={profile.user_type} capitalize />
            <InfoRow icon={Cake} label="Age" value={profile.age ? `${profile.age} years` : null} />
            <InfoRow icon={UserRound} label="Gender" value={profile.gender} />
            <InfoRow icon={Briefcase} label="Occupation" value={profile.occupation} />
            <InfoRow icon={Mail} label="Email" value={profile.email} />
            <InfoRow icon={Phone} label="Phone" value={profile.phone} />
          </InfoCard>

          <InfoCard title="Living plans">
            <InfoRow icon={MapPin} label="Preferred city" value={profile.city} />
            <InfoRow
              icon={IndianRupee}
              label="Monthly budget"
              value={profile.budget ? `₹${profile.budget.toLocaleString("en-IN")}` : null}
            />
            <InfoRow
              icon={CalendarDays}
              label="Move-in date"
              value={
                profile.move_in_date
                  ? new Date(profile.move_in_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : null
              }
            />
          </InfoCard>

          <InfoCard title="Lifestyle">
            <div className="grid grid-cols-2 gap-4">
              {lifestyle.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-secondary/50 p-3"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-sm font-semibold">{item.value ?? "Not set"}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Interests">
            {profile.interests.length ? (
              <InterestChips options={profile.interests} selected={profile.interests} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No interests added yet — they help us match you better.
              </p>
            )}
          </InfoCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <section className="card-hover rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value, capitalize }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`truncate text-sm font-semibold ${capitalize ? "capitalize" : ""}`}>
          {value ?? "Not set"}
        </p>
      </div>
    </div>
  );
}
