# Home Sweet Home Finder

# RoomMate – Development Roadmap

> **Note:** this is the original product brief/roadmap and describes the
> stack as it was first envisioned (Node/Express/MongoDB, etc.). The app
> actually built is a local-only, plain-JavaScript React app with no
> server or database — see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
> for how to run it, or [TECH_STACK.md](./TECH_STACK.md) for a full
> breakdown of what's actually used and why.

Build **RoomMate**, a modern full-stack Roommate Finder web application for students and working professionals.

The application should look like a real startup product with premium UI, smooth UX, responsive layouts, beautiful animations, and clean architecture.

**Important Instructions**

* Build the application **phase by phase**.

* Maintain the same design system throughout all phases.

* Do **not** redesign previously completed pages in later phases.

* Reuse components whenever possible.

* Keep the code modular and scalable.

* The code should remain understandable for a second-year engineering student.

* Use React, JavaScript, Tailwind CSS, Node.js, Express.js, MongoDB Atlas, JWT, bcrypt, and Cloudinary.

---

# Design Guidelines (Apply to Every Phase)

The UI should feel handcrafted rather than AI-generated.

Use:

* Modern SaaS-inspired design

* Rounded cards

* Beautiful gradients

* Soft shadows

* Premium typography

* Proper spacing

* Consistent color palette

* Lucide React icons

* Responsive layouts

* Light & Dark mode

* Glassmorphism only where appropriate

Animations should include:

* Smooth page transitions

* Fade-in effects

* Floating hero elements

* Card hover animations

* Button micro-interactions

* Loading skeletons

* Smooth dropdowns

* Toast animations

* Image hover zoom

* Elegant transitions

Avoid excessive animations.

---

# Tech Stack (original plan — see TECH_STACK.md for what's actually used)

Frontend

* React.js

* JavaScript

* React Router DOM

* Tailwind CSS

* Axios

Backend

* Node.js

* Express.js

Database

* MongoDB Atlas

* Mongoose

Authentication

* JWT

* bcrypt

Storage

* Cloudinary

---

# PHASE 1 (Demo Tomorrow)

**Goal:** Deliver a polished, fully functional authentication flow and a professional landing experience.

## Pages

### Landing / Home

Build a premium landing page containing:

* Responsive Navbar

* Hero Section

* Search Bar (UI only)

* CTA Buttons

* Features Section

* Platform Statistics

* Featured Roommates (dummy data)

* Featured Properties (dummy data)

* Testimonials

* FAQ

* Footer

Navigation

* Home

* Login

* Signup

Everything should be responsive.

---

### Authentication

#### Signup

Working form.

Fields

* Full Name

* Email

* Password

* Confirm Password

* User Type

Validation

Store user in MongoDB.

Hash password.

Generate JWT.

Redirect to profile completion.

---

#### Login

Working login.

JWT authentication.

Remember logged-in user.

Logout.

Protected routes.

---

### Profile Completion

Users should complete their profile after signup.

Fields

* Profile Picture (Cloudinary)

* Name

* Age

* Gender

* Occupation

* College / Company

* Phone

* City

* Budget

* Preferred Move-in Date

* Bio

Lifestyle

* Food Preference

* Smoking

* Drinking

* Pets

* Sleep Schedule

* Cleanliness

Interests

Multiple selectable chips.

Examples

* Coding

* Gym

* Music

* Movies

* Cricket

* Football

* Reading

* Gaming

* Photography

* Travel

Save profile to MongoDB.

---

### Profile Page

Show

* Cover image

* Profile photo

* Name

* Occupation

* City

* Budget

* Bio

* Interests

* Lifestyle

* Edit Profile button

---

### Backend

Implement

* User Schema

* JWT Authentication

* Login API

* Signup API

* Update Profile API

* Get Profile API

* Cloudinary integration

---

### Components

Create reusable

* Navbar

* Footer

* Button

* Input

* Card

* Modal

* Toast

* Loader

* Empty State

These should be reused in future phases.

---

### Folder Structure

Create the complete folder structure now so future phases only add functionality.

---

### Phase 1 Deliverable

A polished application where a user can:

* Visit the landing page

* Create an account

* Login

* Complete profile

* Upload profile picture

* View and edit profile

* Logout

Everything should work end-to-end.

---

# PHASE 2

**Goal:** Build the core RoomMate functionality.

## Dashboard

Create

* Welcome Card

* Profile Completion

* Suggested Roommates

* Suggested Properties

* Recent Activity

* Quick Actions

---

## Find Roommates

Working search.

Working filters.

Display users from MongoDB.

Profile cards

* Photo

* Name

* Budget

* City

* Occupation

* Interests

Buttons

* View Profile

* Save

* Contact

---

## Roommate Details

Large profile

Compatibility score

Gallery

Lifestyle

Interests

Report Profile

Save Profile

---

## Compatibility System

Create a simple scoring algorithm.

Compare

* Budget

* City

* Food Preference

* Lifestyle

* Sleep Schedule

* Interests

Return percentage.

Example

92%

Also explain why.

Example

"You share similar budgets and 5 common interests."

(No AI—just deterministic logic.)

---

## Saved Profiles

Allow users to save other users.

---

## Notifications

Simple CRUD notifications.

---

## Dashboard Analytics

Show

* Saved Profiles

* Profile Views (mock or simple count)

* Completion Percentage

---

# PHASE 3

**Goal:** Property listings and project polish.

## Find Properties

Real property listings from MongoDB.

Advanced filters.

Property cards.

---

## Property Details

Carousel

Amenities

Owner information

Nearby places (dummy/map placeholder)

Save property

Contact owner

---

## Add Property

Working CRUD.

Upload multiple property images to Cloudinary.

Store image URLs in MongoDB.

---

## Saved Properties

Working save/unsave.

---

## Settings

* Update profile

* Change password

* Delete account

* Dark mode

---

## Final Polish

Implement

* Skeleton loading

* Better empty states

* Toast notifications

* Custom 404 page

* Mobile bottom navigation

* Responsive improvements

* Performance optimization

* Accessibility improvements

* Final animation polish

---

# Final Goal

By the end of Phase 3, RoomMate should feel like a polished startup MVP suitable for a portfolio. Every feature should be fully functional, visually cohesive, and easy to explain during a college evaluation. Prioritize clean architecture, reusable components, responsive design, and tasteful animations over unnecessary complexity. The application should look professional without appearing over-engineered or like a generic AI-generated template.

For now, build phase 1. I have attached some images for idea/reference.

---

See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for the current architecture, folder structure, and how to run this project locally.

## Development

You need [Node.js](https://nodejs.org) (18+) and npm.

```sh
git clone <this-repository-url>
cd <the-cloned-folder>/frontend
npm install
npm run dev
```
