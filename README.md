# BITSA Club

BITSA Club is a student platform built with Next.js (frontend) and Express (backend).

## Quick Start
1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```
2. **Create env files**
   - `backend/.env`
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/bitsa_club
     JWT_SECRET=replace_me
     NODE_ENV=development
     FRONTEND_URL=http://localhost:3000
     ```
   - `.env.local`
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
3. **Run the app**
   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2 (project root)
   npm run dev
   ```
4. **Visit** `http://localhost:3000`

## Contact
- Email: bitsaclub@ueab.ac.ke
- President: Alpha Chamba – 0708898899
- Vice President: Gloria Jebet – 0725486687
