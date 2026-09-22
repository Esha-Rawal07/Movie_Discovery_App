# CineScope — Movie Discovery App

A full-stack movie discovery application built with React and Node.js. CineScope lets users discover movies, search titles, filter and sort results, view movie details, and maintain a persistent wishlist.

## Tech Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Tailwind CSS
- Axios
- React Router
- TMDB API

## Architecture

The React client never calls TMDB directly.

```text
React client
    |
    | HTTP
    v
Express API
    |
    +--> short-lived server cache
    |
    +--> TMDB API
    |
    +--> MongoDB (wishlist)
```

The backend normalizes TMDB responses into a smaller application-facing movie model. This keeps the frontend independent of the external API response shape.

## Features

- Discover popular, top-rated and upcoming movies
- Search with debouncing
- Genre filtering
- Sort by popularity, rating and release date
- Pagination
- Movie detail pages
- Persistent wishlist stored in MongoDB
- Responsive UI
- Loading skeletons
- Empty states
- Error handling
- Server-side short-lived caching
- Request cancellation on the frontend
- TMDB credentials kept on the server

## Setup

### 1. Requirements

- Node.js 20+
- MongoDB (local or MongoDB Atlas)
- TMDB API Read Access Token

TMDB credentials are created from your TMDB account API settings.

### 2. Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cinescope
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Client

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/movies/discover` | Discover movies |
| GET | `/api/movies/search` | Search movies |
| GET | `/api/movies/genres` | Movie genres |
| GET | `/api/movies/:id` | Movie details |
| GET | `/api/wishlist` | Read wishlist |
| POST | `/api/wishlist` | Add movie |
| DELETE | `/api/wishlist/:movieId` | Remove movie |

## Important Decisions

### Backend abstraction

TMDB is called only from Express. The server transforms external data into the format the client needs.

### Caching

Movie discovery, search and detail responses use a small in-memory TTL cache. This reduces repeated external API requests during normal browsing.

### Search cancellation

The frontend uses `AbortController` so a previous search can be cancelled when the query changes quickly.

### Pagination

Only one page of results is rendered at a time. This keeps the DOM and network payload smaller as the result set grows.

### Wishlist persistence

Wishlist records are stored in MongoDB rather than only browser storage. The app can therefore restore saved movies after the browser is closed.

## Assumptions

- This assignment uses a single shared wishlist without authentication.
- TMDB provides the source movie metadata.
- Wishlist records keep the normalized movie snapshot needed by the UI so the wishlist remains usable even when a later TMDB request is unavailable.
- MongoDB is available during local development.

## Known Limitations

- There is no user authentication because it was not required by the assignment.
- The in-memory cache is per server process and resets after a restart.
- A production deployment would use a shared cache such as Redis when multiple server instances are required.
- The wishlist currently represents one local application user.

## AI Usage

I used AI tools as supporting development tools to understand the third-party API documentation, explore implementation approaches, troubleshoot errors, and review parts of the code. I reviewed and tested the resulting implementation and made the final architecture and feature decisions for the application.

## What I Would Improve

With additional time I would add authentication and per-user wishlists, automated API tests, a shared production cache, richer accessibility testing, analytics for discovery behaviour, and deployment monitoring.

## TMDB

This product uses the TMDB API but is not endorsed or certified by TMDB.
