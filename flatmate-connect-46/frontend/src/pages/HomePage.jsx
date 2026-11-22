// The / page (landing page): hero, stats, features, how-it-works,
// featured roommates/rooms, testimonials, FAQ, and a closing CTA. All the
// content here is static copy from lib/demo-data.js, not real data.
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hero-roommates.jpg";
import { InterestChips } from "@/components/InterestChips";
import { SectionHeading } from "@/components/SectionHeading";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FAQS,
  FEATURED_ROOMMATES,
  FEATURED_PROPERTIES,
  PLATFORM_STATS,
  TESTIMONIALS,
} from "@/lib/demo-data";
import { initialsOf } from "@/lib/profile";
import { usePageTitle } from "@/lib/use-page-title";

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: "Lifestyle-first filters",
    text: "Filter by food habits, sleep schedule, cleanliness and pets before you ever open a chat.",
  },
  {
    icon: Sparkles,
    title: "Clear compatibility",
    text: "Every match comes with a percentage and a plain-English reason, not a mysterious algorithm.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Your phone number and address stay hidden until you decide to share them.",
  },
  {
    icon: BadgeCheck,
    title: "Real profiles",
    text: "Complete profiles with photos, budgets and interests — no half-empty listings.",
  },
];

const STEPS = [
  { step: "01", title: "Create your account", text: "Sign up with your email in under a minute." },
  {
    step: "02",
    title: "Complete your profile",
    text: "Add your budget, city, lifestyle and interests so we can match you well.",
  },
  {
    step: "03",
    title: "Meet your roommate",
    text: "Browse people nearby, save the ones you like and start the conversation.",
  },
];

export default function HomePage() {
  usePageTitle("RoomMate — Find a roommate who actually fits your life");

  // If we arrived at "/#how-it-works" (e.g. clicked from another page),
  // scroll to that section once the page has rendered.
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero-glow">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Trusted by 12,400+ students & professionals
              </span>
              <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
                Find your <span className="text-gradient-brand">perfect roommate</span>, not just a
                spare room.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Because every great chapter starts with the right roommate. Match on budget,
                lifestyle and interests — then move in with someone who actually gets you.
              </p>

              {/* Search bar (UI only for now) */}
              <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft sm:flex-row">
                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter a city or locality"
                    className="h-12 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                    aria-label="Search by city or locality"
                  />
                </div>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">
                    <Search className="size-4" /> Search roommates
                  </Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">
                    Get started free <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/login">I already have an account</Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="overflow-hidden rounded-[2rem] border border-border shadow-lifted">
                <img
                  src={heroImage}
                  alt="Three roommates laughing together in a sunlit living room"
                  width={1200}
                  height={1408}
                  className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105 lg:h-[520px]"
                />
              </div>

              <div className="animate-float absolute -bottom-6 -left-4 hidden rounded-2xl border border-border bg-card p-4 shadow-lifted sm:block">
                <p className="text-xs font-medium text-muted-foreground">Compatibility</p>
                <p className="text-2xl font-bold text-gradient-brand">92%</p>
                <p className="text-xs text-muted-foreground">Similar budget · 5 shared interests</p>
              </div>

              <div className="animate-float absolute -top-5 right-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-lifted [animation-delay:1.5s] sm:block">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="size-4 text-accent" /> 38 new matches today
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gradient-brand">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Why RoomMate"
            title="Everything you need to choose well"
            description="Shared living goes wrong for small reasons. We surface those small reasons up front."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="card-hover rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-border bg-card/40 scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading
              eyebrow="How it works"
              title="Three steps to a better living situation"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((item) => (
                <div
                  key={item.step}
                  className="card-hover relative rounded-2xl border border-border bg-card p-7 shadow-soft"
                >
                  <span className="font-display text-4xl font-extrabold text-primary/25">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured roommates */}
        <section id="roommates" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Featured roommates"
            title="People looking right now"
            description="A preview of the kind of profiles waiting for you inside."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_ROOMMATES.map((person) => (
              <article
                key={person.name}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand font-bold text-primary-foreground">
                    {initialsOf(person.name)}
                  </span>
                  <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                    {person.match}% match
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.occupation}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" /> {person.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="size-3.5" />
                    {person.budget.toLocaleString("en-IN")}/mo
                  </span>
                </div>
                <InterestChips options={person.interests} selected={[]} className="mt-4" />
                <Button variant="outline" size="sm" className="mt-5 w-full" asChild>
                  <Link to="/signup">View profile</Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        {/* Featured properties */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading
              eyebrow="Featured rooms"
              title="Rooms and flats worth a look"
              description="Full property search arrives in the next release — here is a taste."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {FEATURED_PROPERTIES.map((property) => (
                <article
                  key={property.title}
                  className="card-hover overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                >
                  <div className="overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="h-48 w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" /> {property.location}
                        </p>
                      </div>
                      <Heart className="size-5 shrink-0 text-muted-foreground transition-colors hover:text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-bold">
                      ₹{property.rent.toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <InterestChips
                      options={[property.type, ...property.tags]}
                      selected={[]}
                      className="mt-4"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Testimonials" title="What members say" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="card-hover rounded-2xl border border-border bg-card p-7 shadow-soft"
              >
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold">
                    {initialsOf(item.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{item.name}</span>
                    <span className="block text-xs text-muted-foreground">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border bg-card/40 scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="FAQ" title="Questions people ask us" />
            <Accordion type="single" collapsible className="mt-10">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q} className="border-border">
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-hero-glow p-10 text-center shadow-lifted sm:p-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Your next home starts with hello</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Create your profile today and get matched with roommates who share your vibe, your
              budget and your values.
            </p>
            <Button variant="hero" size="xl" className="mt-8" asChild>
              <Link to="/signup">
                Create your free profile <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
