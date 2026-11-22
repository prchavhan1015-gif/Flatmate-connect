# RoomMate — Live Matching Setup

This update adds a live, server-backed roommate compatibility page to the original React app. The matching API reads completed profiles from MongoDB and ranks them using city, budget, lifestyle preferences and shared interests. Matching is a transparent weighted heuristic—not AI or a guarantee of compatibility.

## 1. MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a database user and allow your current IP address in Network Access.
3. Copy the cluster connection URI and replace its username/password placeholders.

## 2. Backend
Open a terminal in VS Code:
```bash
cd backend
npm install
```
Copy `backend/.env.example` to `backend/.env` and fill in `MONGO_URI` and a long `JWT_SECRET`.
```bash
npm run dev
```
Backend health check: http://localhost:5000/api/health

## 3. Frontend
In a second terminal:
```bash
cd frontend
npm install
```
Copy `frontend/.env.example` to `frontend/.env` if needed.
```bash
npm run dev
```
Use the URL printed by Vite (the original config may use port 8080).

## 4. Matching
Sign up, complete onboarding, then open **Find Matches** in the navigation or `/matches`. Only other users with completed profiles are listed. Filters include city and maximum budget. Match reasons show overlapping profile attributes. The Contact button opens an email draft; no in-app messaging is implemented yet.

## Notes
- The project requires the MongoDB server and frontend to be running for cross-user/live matching.
- Never commit your `.env` files or share your MongoDB credentials.
- Seed/sample profiles are not automatically inserted. Matches will appear when other accounts complete their profiles.
