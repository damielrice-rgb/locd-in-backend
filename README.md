# Loc'd In — Backend API

The REST API for **Loc'd In**, a booking app for a loc and natural hair salon. Clients can create an account, browse services, and book, view, update, and cancel their own appointments. Each user can only see and change their own data.

- **Live API:** https://locd-in-backend.onrender.com
- **Frontend repo:** https://github.com/damielrice-rgb/locd-in-frontend

## Tech Stack

| Tool | Purpose |
| --- | --- |
| Node.js and Express | Server and routing |
| MongoDB Atlas and Mongoose | Database and schemas |
| bcrypt | Password hashing |
| jsonwebtoken (JWT) | Login tokens |
| dotenv | Environment variables |
| cors | Lets the React frontend call the API |

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt in a Mongoose `pre('save')` hook
- Full CRUD for appointments
- Ownership-based authorization: users can only view, update, or delete appointments and favorites they own
- Service list showing only active services
- Favorite services, with protection against favoriting the same service twice

## Project Structure

```
locd-in-backend/
├── config/
│   └── connection.js       # Connects to MongoDB
├── models/
│   ├── userSchema.js       # User + bcrypt pre-save hook
│   ├── serviceSchema.js    # Salon services
│   ├── appointSchema.js    # Appointments (owner → User, service → Service)
│   └── favoriteSchema.js   # Favorites (owner → User, service → Service)
├── routes/api/
│   ├── userRoutes.js
│   ├── serviceRoutes.js
│   ├── appointRoutes.js
│   └── favoriteRoutes.js
├── utils/
│   └── auth.js             # JWT authentication middleware
├── server.js               # App setup, middleware, and routes
└── package.json
```

## Data Models

**User**
- `username`: String, required
- `email`: String, required, unique, must be a valid email
- `password`: String, required, hashed before saving

**Service**
- `name`: String, required
- `description`: String
- `price`: Number
- `active`: Boolean, default `true`

**Appointment**
- `owner`: ObjectId, ref `User`, required
- `service`: ObjectId, ref `Service`, required
- `date`: Date, required
- `status`: String, one of `pending`, `confirmed`, `cancelled`; default `pending`
- `notes`: String

**Favorite**
- `owner`: ObjectId, ref `User`, required
- `service`: ObjectId, ref `Service`, required

All models include `createdAt` and `updatedAt` timestamps.

## Running Locally

**1. Clone the repo and install packages**

```bash
git clone https://github.com/damielrice-rgb/locd-in-backend.git
cd locd-in-backend
npm install
```

**2. Create a `.env` file** in the root folder:

```
MONGO_URI=your-mongodb-atlas-connection-string
PORT=1444
JWT_SECRET=any-long-random-string
```

**3. Start the server**

```bash
npm start
```

You should see `MongoDB connected successfully!`. The API runs at `http://localhost:1444`.

## Authentication

1. Log in with `POST /api/users/login` to receive a token.
2. Send the token in the `Authorization` header on protected routes:

```
Authorization: Bearer <your-token>
```

Tokens expire after one day. Requests without a token return `401`; invalid or expired tokens return `403`.

## API Endpoints

### Users

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/users/register` | Create an account | Public |
| POST | `/api/users/login` | Log in and receive a JWT | Public |

**Register body**

```json
{ "username": "damiel", "email": "damiel@example.com", "password": "Password123" }
```

**Login body**

```json
{ "email": "damiel@example.com", "password": "Password123" }
```

**Login response**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "username": "damiel", "email": "damiel@example.com" }
}
```

### Services

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/services` | List all active services | Public |
| POST | `/api/services` | Create a service | Protected |

**Create service body**

```json
{ "name": "Retwist", "description": "A full loc retwist service", "price": 75 }
```

### Appointments

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/appointments` | Book an appointment | Protected |
| GET | `/api/appointments` | List the logged-in user's appointments | Protected |
| GET | `/api/appointments/:id` | Get one appointment | Protected, owner only |
| PUT | `/api/appointments/:id` | Update an appointment | Protected, owner only |
| DELETE | `/api/appointments/:id` | Delete an appointment | Protected, owner only |

**Book or update body**

```json
{
  "service": "6ac52bcfa489250b22cdd828",
  "date": "2026-10-15T14:00:00",
  "notes": "First appointment"
}
```

Updates can also include `"status": "confirmed"`. Booking checks that the service exists and is active.

### Favorites

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/favorites` | Add a service to favorites | Protected |
| GET | `/api/favorites` | List the logged-in user's favorites | Protected |
| DELETE | `/api/favorites/:id` | Remove a favorite | Protected, owner only |

**Add favorite body**

```json
{ "service": "6ac52bcfa489250b22cdd828" }
```

## Authorization

Every appointment and favorite is saved with `owner: req.user.id` from the verified token, so users can't create data for someone else. Routes that read, update, or delete a single item compare the item's `owner` to the logged-in user and return `403 Forbidden` if they don't match. Listing routes only return items where `owner` matches the logged-in user.

## Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 400 | Missing or invalid data |
| 401 | Not logged in, or wrong email or password |
| 403 | Invalid token, or not the owner |
| 404 | Not found |
| 500 | Server error |

## Deployment

Deployed on Render as a Web Service connected to MongoDB Atlas.

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI` and `JWT_SECRET` (Render sets `PORT` automatically)

## Future Improvements

- Stylist account to confirm or cancel appointment requests
- Move route logic into a `controllers` folder
- Available time slots based on the stylist's schedule
- Email or text appointment reminders

## Author

Damiel Rice — Per Scholas Full-Stack MERN Capstone
