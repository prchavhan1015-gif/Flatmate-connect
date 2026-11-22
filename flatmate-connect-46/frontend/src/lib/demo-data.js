// Static content shown on the landing page (HomePage) and used as the
// dropdown/chip options during onboarding. None of this is user data —
// it's just copy text and sample cards for the page to render.
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export const INTEREST_OPTIONS = [
  "Coding",
  "Gym",
  "Music",
  "Movies",
  "Cricket",
  "Football",
  "Reading",
  "Gaming",
  "Photography",
  "Travel",
  "Cooking",
  "Art",
];

export const CITIES = [
  "Pune",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Delhi NCR",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

export const LIFESTYLE_OPTIONS = {
  food_preference: ["Vegetarian", "Non-vegetarian", "Vegan", "Eggetarian"],
  smoking: ["Never", "Occasionally", "Regularly"],
  drinking: ["Never", "Socially", "Regularly"],
  pets: ["Love pets", "No pets", "Have a pet"],
  sleep_schedule: ["Early bird", "Night owl", "Flexible"],
  cleanliness: ["Very tidy", "Moderately tidy", "Relaxed"],
};

export const FEATURED_ROOMMATES = [
  {
    name: "Aarav Sharma",
    occupation: "Software Engineer",
    city: "Pune",
    budget: 12000,
    interests: ["Coding", "Gym", "Music"],
    match: 94,
  },
  {
    name: "Ishita Verma",
    occupation: "Design Student",
    city: "Bengaluru",
    budget: 9500,
    interests: ["Art", "Movies", "Travel"],
    match: 89,
  },
  {
    name: "Rohan Nair",
    occupation: "Data Analyst",
    city: "Hyderabad",
    budget: 14000,
    interests: ["Cricket", "Gaming", "Reading"],
    match: 86,
  },
  {
    name: "Sanya Kapoor",
    occupation: "MBA Student",
    city: "Mumbai",
    budget: 16000,
    interests: ["Photography", "Music", "Cooking"],
    match: 91,
  },
];

export const FEATURED_PROPERTIES = [
  {
    title: "Sunlit Room in 3BHK",
    location: "Baner, Pune",
    rent: 11000,
    type: "Private room",
    image: property1,
    tags: ["Furnished", "WiFi", "Near metro"],
  },
  {
    title: "Modern 2BHK with Balcony",
    location: "Koramangala, Bengaluru",
    rent: 18500,
    type: "Whole flat",
    image: property2,
    tags: ["Balcony", "Parking", "Gym"],
  },
  {
    title: "Student PG near Campus",
    location: "Kothrud, Pune",
    rent: 7500,
    type: "Shared room",
    image: property3,
    tags: ["Meals", "Laundry", "Study desk"],
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "I found a roommate who codes at night just like me. The compatibility details made the choice easy.",
    name: "Meera Iyer",
    role: "Final year student, VIT",
  },
  {
    quote:
      "Moved cities for a new job and had a room sorted in four days. Way calmer than scrolling group chats.",
    name: "Karan Deshmukh",
    role: "Product Analyst",
  },
  {
    quote:
      "The lifestyle filters are the best part — no more surprises about food habits or sleep timings.",
    name: "Aditi Rao",
    role: "Architecture Student",
  },
];

export const FAQS = [
  {
    q: "Is RoomMate free to use?",
    a: "Yes. Creating a profile, browsing roommates and saving listings is completely free for students and working professionals.",
  },
  {
    q: "How do you match people?",
    a: "We compare budget, city, food preference, sleep schedule, cleanliness and shared interests, then show a clear compatibility score with the reasons behind it.",
  },
  {
    q: "Do I have to share my phone number publicly?",
    a: "No. Your contact details stay hidden until you choose to share them with someone you have matched with.",
  },
  {
    q: "Can I list a room or flat?",
    a: "Property listings are rolling out next. For now you can complete your profile so owners can reach the right people.",
  },
];

export const PLATFORM_STATS = [
  { label: "Active members", value: "12,400+" },
  { label: "Rooms listed", value: "3,800+" },
  { label: "Cities covered", value: "18" },
  { label: "Successful matches", value: "6,100+" },
];
