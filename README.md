# LineOne

Social platform built with Next.js App Router, NextAuth, MongoDB, Pusher, and Cloudinary.

## Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB
- Google OAuth credentials (optional)
- Pusher app (optional, for realtime chat/notifications)
- Cloudinary account (optional, for media uploads)

## Environment variables

Create `.env` in the project root:

```env
MONGODB_URL=mongodb+srv://...
AUTH_SECRET=generate_with_openssl_rand_base64_32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

For local development, set `NEXT_PUBLIC_APP_URL` to `http://localhost:3000` so follow notifications and internal links work correctly.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main flows

1. **Sign up** → **Log in** → complete profile at `/` (username, DOB, gender).
2. **Home** (`/home`): **Following** feed (people you follow/follow you + your posts), **Discover** (public posts), and **Suggested users** when Following is empty.
3. **Feed API**: `GET /api/feed?mode=following|discover|suggestedUsers` (authenticated).
4. **Saved posts**: bookmark on post cards; view at `/saved`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server

## Deployment

Deploy to Vercel or similar; set all env vars in the host dashboard. Ensure MongoDB network access allows your deployment IPs.
