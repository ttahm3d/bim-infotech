# WorkLog Feature Documentation

This document outlines the new WorkLog and Break management features added to the BIM InfoTech application.

## Overview

The WorkLog feature allows authenticated employees to:

1. **Check In** - Start their workday
2. **Check Out** - End their workday
3. **Take a Break** - Pause their active worklog
4. **Return from Break** - Resume active status after a break

## Database Schema

### WorkLog Model

```prisma
model WorkLog {
  id            String         @id @default(uuid())
  userId        String
  date          DateTime       @db.Date
  checkinAt     DateTime
  checkoutAt    DateTime?
  status        WorkLogStatus  @default(ACTIVE)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  breakSessions BreakSession[]

  user Employee @relation(fields: [userId], references: [id])

  @@unique([userId, date])  // Prevents duplicate check-ins on same calendar day
}
```

### BreakSession Model

```prisma
model BreakSession {
  id        String    @id @default(uuid())
  worklogId String
  startAt   DateTime
  endAt     DateTime?
  createdAt DateTime  @default(now())

  worklog WorkLog @relation(fields: [worklogId], references: [id])
}
```

### WorkLogStatus Enum

```prisma
enum WorkLogStatus {
  ACTIVE       // Employee is actively working
  ON_BREAK     // Employee is on break
  CHECKED_OUT  // Employee has checked out
}
```

## API Endpoints

### Hono Backend (`hono-backend/src/features/worklog/`)

All endpoints require authentication via JWT token in cookie.

#### 1. Check In

- **Endpoint:** `POST /worklog/check-in`
- **Description:** Create a new WorkLog entry with current timestamp and ACTIVE status
- **Auth Required:** Yes
- **Request Body:** Empty `{}`
- **Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "workLog": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2026-06-07",
      "checkinAt": "2026-06-07T09:00:00Z",
      "checkoutAt": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T09:00:00Z",
      "breakSessions": []
    }
  }
}
```

- **Error (409 Conflict):** Already checked in today
- **Error (401 Unauthorized):** Invalid or missing auth token

#### 2. Check Out

- **Endpoint:** `POST /worklog/check-out`
- **Description:** Update today's WorkLog with checkout time and set status to CHECKED_OUT
- **Auth Required:** Yes
- **Request Body:** Empty `{}`
- **Validations:**
  - Must have existing check-in for today
  - Current status must be ACTIVE (cannot check out while on break)
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "workLog": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2026-06-07",
      "checkinAt": "2026-06-07T09:00:00Z",
      "checkoutAt": "2026-06-07T17:30:00Z",
      "status": "CHECKED_OUT",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T17:30:00Z",
      "breakSessions": []
    }
  }
}
```

- **Error (404 Not Found):** No check-in found for today
- **Error (400 Bad Request):** Cannot check out when on break

#### 3. Take a Break

- **Endpoint:** `POST /worklog/take-break`
- **Description:** Create a new BreakSession and update WorkLog status to ON_BREAK
- **Auth Required:** Yes
- **Request Body:** Empty `{}`
- **Validations:**
  - Must have existing check-in for today
  - Current status must be ACTIVE
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "workLog": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2026-06-07",
      "checkinAt": "2026-06-07T09:00:00Z",
      "checkoutAt": null,
      "status": "ON_BREAK",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T12:00:00Z",
      "breakSessions": [
        {
          "id": "uuid",
          "worklogId": "uuid",
          "startAt": "2026-06-07T12:00:00Z",
          "endAt": null,
          "createdAt": "2026-06-07T12:00:00Z"
        }
      ]
    },
    "breakSession": {
      "id": "uuid",
      "worklogId": "uuid",
      "startAt": "2026-06-07T12:00:00Z",
      "endAt": null,
      "createdAt": "2026-06-07T12:00:00Z"
    }
  }
}
```

- **Error (404 Not Found):** No check-in found for today
- **Error (400 Bad Request):** Cannot take a break when not active

#### 4. Return from Break

- **Endpoint:** `POST /worklog/return-from-break`
- **Description:** End the open BreakSession and update WorkLog status back to ACTIVE
- **Auth Required:** Yes
- **Request Body:** Empty `{}`
- **Validations:**
  - Must have existing check-in for today
  - Current status must be ON_BREAK
  - Must have an open break session (endAt = null)
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "workLog": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2026-06-07",
      "checkinAt": "2026-06-07T09:00:00Z",
      "checkoutAt": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T13:00:00Z",
      "breakSessions": [
        {
          "id": "uuid",
          "worklogId": "uuid",
          "startAt": "2026-06-07T12:00:00Z",
          "endAt": "2026-06-07T13:00:00Z",
          "createdAt": "2026-06-07T12:00:00Z"
        }
      ]
    },
    "breakSession": {
      "id": "uuid",
      "worklogId": "uuid",
      "startAt": "2026-06-07T12:00:00Z",
      "endAt": "2026-06-07T13:00:00Z",
      "createdAt": "2026-06-07T12:00:00Z"
    }
  }
}
```

- **Error (404 Not Found):** No check-in found for today or no open break session
- **Error (400 Bad Request):** Not currently on break

#### 5. Get Today's WorkLog

- **Endpoint:** `GET /worklog/today`
- **Description:** Retrieve today's WorkLog and associated BreakSessions
- **Auth Required:** Yes
- **Request Body:** None
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "workLog": {
      "id": "uuid",
      "userId": "uuid",
      "date": "2026-06-07",
      "checkinAt": "2026-06-07T09:00:00Z",
      "checkoutAt": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T13:00:00Z",
      "breakSessions": [
        {
          "id": "uuid",
          "worklogId": "uuid",
          "startAt": "2026-06-07T12:00:00Z",
          "endAt": "2026-06-07T13:00:00Z",
          "createdAt": "2026-06-07T12:00:00Z"
        }
      ]
    }
  }
}
```

### NestJS Backend (`backend/src/worklog/`)

The NestJS implementation provides the same functionality with similar endpoints at:

- `POST /worklog/check-in`
- `POST /worklog/check-out`
- `POST /worklog/take-break`
- `POST /worklog/return-from-break`
- `GET /worklog/today`

## File Structure

### Hono Backend

```
hono-backend/src/
├── features/
│   ├── auth/
│   └── worklog/
│       ├── worklog.controller.ts    # Request handlers
│       ├── worklog.routes.ts        # Route definitions
│       ├── worklog.schema.ts        # Zod validation schemas
│       ├── worklog.service.ts       # Business logic
│       └── worklog.types.ts         # TypeScript types
├── middleware/
│   └── auth.middleware.ts           # JWT authentication middleware
└── index.ts                         # Main app with route mounting
```

### NestJS Backend

```
backend/src/
├── worklog/
│   ├── worklog.controller.ts  # Route handlers
│   ├── worklog.module.ts      # Feature module
│   ├── worklog.service.ts     # Business logic
│   └── worklog.types.ts       # TypeScript types
├── app.module.ts              # Updated to import WorkLogModule
└── prisma/
```

## Key Features & Business Logic

### 1. Unique Check-in Per Day

- Uses Prisma unique constraint: `@@unique([userId, date])`
- Prevents duplicate check-ins on the same calendar day
- Date is stored as `@db.Date` (date only, no time component)

### 2. Status Management

- **ACTIVE:** Employee is working, can take break or check out
- **ON_BREAK:** Employee is on break, can only return from break
- **CHECKED_OUT:** Employee has completed their workday, read-only

### 3. Break Sessions

- Open break session has `endAt = null`
- When returning from break, the open session is closed with current timestamp
- Multiple breaks possible per day (each tracked separately)

### 4. Authentication

- All endpoints require valid JWT token
- Token must be passed in HTTP-only cookie (Hono) or custom header (can be extended)
- User ID extracted from JWT payload (`sub` claim)

## Usage Examples

### Example 1: Complete Daily Workflow

```bash
# 1. Check in at 9:00 AM
curl -X POST http://localhost:3000/worklog/check-in \
  -H "Cookie: auth_token=<jwt_token>"

# 2. Take break at 12:00 PM
curl -X POST http://localhost:3000/worklog/take-break \
  -H "Cookie: auth_token=<jwt_token>"

# 3. Return from break at 1:00 PM
curl -X POST http://localhost:3000/worklog/return-from-break \
  -H "Cookie: auth_token=<jwt_token>"

# 4. Check out at 5:30 PM
curl -X POST http://localhost:3000/worklog/check-out \
  -H "Cookie: auth_token=<jwt_token>"

# 5. View today's complete log
curl -X GET http://localhost:3000/worklog/today \
  -H "Cookie: auth_token=<jwt_token>"
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**

- `201 Created` - Successful check-in
- `200 OK` - Successful action
- `400 Bad Request` - Invalid request or state
- `401 Unauthorized` - Missing/invalid authentication
- `404 Not Found` - Resource not found
- `409 Conflict` - Business logic conflict (e.g., duplicate check-in)
- `500 Internal Server Error` - Server error

## Future Enhancements

Potential features to add:

1. Get work logs by date range
2. Calculate total break time per day
3. Overtime tracking
4. Attendance reports
5. Manager approval workflow for extended breaks
6. Time zone handling
7. Bulk check-in/out for teams
