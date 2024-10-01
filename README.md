# URL Shortener API

This project is a URL shortener API built with Node.js, TypeScript, Express, and Drizzle ORM.

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- PostgreSQL (for local development without Docker)

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd url-shortener
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   DATABASE_URL=postgres://user:password@localhost:5432/url_shortener
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

## Running the Application

### Using Docker Compose

To run both the API and the database using Docker Compose:

```
docker-compose up --build
```

This will start both the PostgreSQL database and the API server. The API will be available at `http://localhost:3000`.

### Local Development

If you prefer to run the services separately:

1. Start the PostgreSQL database using Docker:

   ```
   docker-compose up db
   ```

2. Run database migrations:

   ```
   npm run migrate
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The server will be running at `http://localhost:3000`. The `dev` script uses `tsx`, which allows you to run TypeScript files directly without a separate compilation step.

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive a JWT token
- `POST /urls/shorten` - Shorten a URL (authenticated and unauthenticated)
- `GET /:shortCode` - Redirect to the original URL
- `GET /urls/list` - List all URLs for the authenticated user
- `PUT /:shortCode` - Update an existing short URL (authenticated)
- `DELETE /:shortCode` - Delete a short URL (authenticated)

## Building for Production

To build the project for production:

```
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.
