# ThreadHive Agent Guidelines

Monorepo with two independent npm projects: `threadhive-backend/` (Express 5 + MongoDB API) and `threadhive-frontend/` (React 19 + Vite + Redux Toolkit).

## Architecture

**Backend** layering is strict: `routes/` → `controllers/` → `services/` → `models/`.

- Controllers stay thin: parse `req`, call a service, respond with `{ success, message, data }` (see [threadController.js](threadhive-backend/src/controllers/threadController.js)).
- All Mongoose queries and business logic live in `services/`.
- Errors are thrown via `createAppError(message, statusCode)` ([createAppError.js](threadhive-backend/src/utils/createAppError.js)), never via manual try/catch + res.status in controllers — Express 5 forwards async rejections to the global [errorHandler](threadhive-backend/src/middleware/errorHandler.js) middleware automatically. Follow this pattern for new routes.
- Auth: JWT in `Authorization: Bearer <token>`, verified by [authHandler.js](threadhive-backend/src/middleware/authHandler.js), which sets `req.user = { userId }`.
- Vote logic (upvote/downvote for threads and comments) is centralized in one shared `voteHandler` in [voteService.js](threadhive-backend/src/services/voteService.js). Extend that function for new votable models instead of duplicating the logic.

**Frontend** state: each Redux slice in `src/reducers/` pairs 1:1 with a service module in `src/services/` that wraps the shared [axiosInstance](threadhive-frontend/src/api/axiosInstance.js). Thunks call services — never call axios directly from components or slices. [threadListSlice.js](threadhive-frontend/src/reducers/threadListSlice.js) is the reference pattern: async thunks → `handleApiError` in the catch → `extraReducers` with pending/fulfilled/rejected per thunk. `localStorage` is only touched inside thunks/reducers, never directly in components.

## Build & Test

Backend (run from `threadhive-backend/`):

- `npm run dev` — nodemon, requires `.env` (`MONGODB_URI`, `PORT`, `JWT_SECRET`; see `.env.example`)
- `npm test` — vitest, uses `mongodb-memory-server` (no real DB needed, but first run downloads a Mongo binary and can be slow)
- `npm run format` — prettier

Frontend (run from `threadhive-frontend/`):

- `npm run dev` — Vite dev server
- `npm run lint` — ESLint
- `npm run build`

## Gotchas

- Frontend [axiosInstance.js](threadhive-frontend/src/api/axiosInstance.js) hardcodes `baseURL: "http://localhost:5001/api"`, but backend `.env.example` defaults `PORT=5000`. If the backend's actual `PORT` doesn't match, frontend requests fail with network/CORS errors, not 4xx responses — check this first when the frontend can't reach the API.
- [commentSlice.js](threadhive-frontend/src/reducers/commentSlice.js) is an unimplemented stub (`// Your code here`) and is commented out of [store.js](threadhive-frontend/src/store/store.js) — don't assume comment state exists until it's wired up.
- Route mounting isn't 1:1 with resource names: vote routes are mounted at bare `/api` (not `/api/votes`) in [app.js](threadhive-backend/src/app.js), so endpoints are `/api/threads/:id/upvote` and `/api/comments/:id/upvote` (see [votes.js](threadhive-backend/src/routes/votes.js)).
