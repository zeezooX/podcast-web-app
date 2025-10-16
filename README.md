# Podcast Web App

A full-stack podcast management and streaming platform featuring a Node.js/Express backend and Next.js frontend. Developed as part of Eng Techno's technical assessment.

## Contents

- [Backend](#backend)
- [Frontend](#frontend)

## Backend

The backend is a RESTful API built with TypeScript, Express, and MongoDB using Mongoose. It supports user authentication with JWT, podcast uploads with audio and image files stored in MongoDB via GridFS, and secure file streaming.

### Quick Start

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:

   ```env
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your-super-secret-jwt-key
    JWT_EXPIRE=7d
    MAX_FILE_SIZE=52428800
   ```

3. Start the development server (with hot reload using nodemon):

   ```bash
    npm run dev
   ```

   Or build and run for production:

   ```bash
    npm run build
    npm start
   ```

4. Access the API documentation at `http://localhost:5000/swagger`

### Linting and Formatting

- Lint the code with ESLint:

  ```bash
  npm run lint
  ```

- Format the code with Prettier:

  ```bash
  npm run format
  ```

Configure in `.eslintrc.json` and `.prettierrc`.

### API Endpoints

#### Interactive Documentation

Swagger UI is available at: `http://localhost:5000/swagger`

#### Response Structure

All API responses follow this structure:

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev only)"
}
```

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

#### Podcasts

- `GET /api/podcasts` - Get all podcasts
- `GET /api/podcasts/:id` - Get a single podcast by ID
- `POST /api/podcasts` - Upload a new podcast (requires JWT)
- `DELETE /api/podcasts/:id` - Delete a podcast by ID (requires JWT)

#### File Streaming

- `GET /api/files/audio/:id` - Stream audio file by ID
- `GET /api/files/image/:id` - Get image file by ID

### Authentication

All protected routes require a JWT token in the Authorization header:

`Authorization: Bearer <your_jwt_token>`

### Database Schema

#### User Collection

```typescript
{
  email: string (unique, required, lowercase, validated)
  password: string (hashed with bcrypt, required, min 6 chars)
  name: string (required)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

#### Podcast Collection

```typescript
{
  title: string (required)
  description: string (required)
  author: string (required)
  category: string (default: "General")
  imageFileId: ObjectId (GridFS file reference, optional)
  audioFileId: ObjectId (GridFS file reference, required)
  duration: number (seconds, optional)
  fileSize: number (bytes, auto-calculated)
  uploadedBy: ObjectId (User reference, required)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

#### GridFS Collections

Auto-created by MongoDB.

## Frontend

The frontend is a React application built with Next.js and TypeScript, providing a user-friendly interface for browsing, playing, and uploading podcasts with Tailwind CSS styling and responsive design optimized for both mobile and desktop devices.

### Quick Start

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the `frontend` directory with the following variable:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Or build and run for production:

   ```bash
   npm run build
   npm start
   ```

4. Access the application at `http://localhost:3000`

### Features

- User authentication (register/login)
- Responsive design for mobile and desktop
- Browse for podcasts
- Play podcast episodes with a built-in audio player
- Upload new podcast episodes (requires authentication)
- Delete uploaded podcasts (requires authentication)
