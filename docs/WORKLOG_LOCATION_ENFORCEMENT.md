# WorkLog Feature with Location Enforcement Documentation

## Overview

The WorkLog feature allows authenticated employees to:

1. **Check In** - Start workday at office location
2. **Check Out** - End workday at office location
3. **Take a Break** - Pause active worklog
4. **Return from Break** - Resume active status

**New:** All check-ins and check-outs are now **location-enforced** with GPS coordinates validation.

## Database Schema

### WorkLog Model (Updated with Location Fields)

```prisma
model WorkLog {
  id              String         @id @default(uuid())
  userId          String
  date            DateTime       @db.Date
  checkinAt       DateTime
  checkinLat      Float          // Check-in latitude
  checkinLng      Float          // Check-in longitude
  checkoutAt      DateTime?
  checkoutLat     Float?         // Check-out latitude
  checkoutLng     Float?         // Check-out longitude
  status          WorkLogStatus  @default(ACTIVE)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  breakSessions   BreakSession[]

  user Employee @relation(fields: [userId], references: [id])

  @@unique([userId, date])
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

### Office Model (New)

```prisma
model Office {
  id           String   @id @default(uuid())
  name         String
  latitude     Float    // Office center latitude
  longitude    Float    // Office center longitude
  radiusMeters Float   @default(10) // Allowed radius for check-in/out
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
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

## Location Validation

### How It Works

1. Client sends user's current GPS coordinates (latitude, longitude)
2. System retrieves office location from database
3. Distance calculated using **Haversine formula** (meters)
4. Check-in/out allowed only if distance ≤ office radius (default: 10 meters)

### Distance Calculation

Uses the Haversine formula to calculate the great-circle distance between two points:

- Earth radius: 6,371,000 meters
- Accuracy: Typically within 0.5 meters for short distances

### Example

```
Office Location: 40.7128°N, 74.0060°W (New York)
Office Radius: 10 meters

User Location 1: 40.71285°N, 74.00595°W → ~4.5 meters away ✅ Allowed
User Location 2: 40.71200°N, 74.00500°W → ~82 meters away ❌ Rejected
```

## API Endpoints

### Office Management Endpoints (Admin)

#### Create Office

- **Endpoint:** `POST /office`
- **Auth Required:** No (can add auth middleware if needed)
- **Request Body:**

```json
{
  "name": "Main Office",
  "latitude": 40.7128,
  "longitude": -74.006,
  "radiusMeters": 10
}
```

- **Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "office": {
      "id": "uuid",
      "name": "Main Office",
      "latitude": 40.7128,
      "longitude": -74.006,
      "radiusMeters": 10,
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T09:00:00Z"
    }
  }
}
```

#### Get All Offices

- **Endpoint:** `GET /office`
- **Auth Required:** No
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "offices": [
      {
        "id": "uuid",
        "name": "Main Office",
        "latitude": 40.7128,
        "longitude": -74.006,
        "radiusMeters": 10,
        "createdAt": "2026-06-07T09:00:00Z",
        "updatedAt": "2026-06-07T09:00:00Z"
      }
    ]
  }
}
```

#### Get Office by ID

- **Endpoint:** `GET /office/:id`
- **Auth Required:** No
- **Response (200 OK):** Same as single office object

#### Update Office

- **Endpoint:** `PUT /office/:id`
- **Auth Required:** No
- **Request Body:** (all fields optional)

```json
{
  "name": "Main Office - Updated",
  "latitude": 40.713,
  "longitude": -74.0062,
  "radiusMeters": 15
}
```

- **Response (200 OK):** Updated office object

#### Delete Office

- **Endpoint:** `DELETE /office/:id`
- **Auth Required:** No
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

### WorkLog Endpoints (Authenticated)

#### Check In (Location Required)

- **Endpoint:** `POST /worklog/check-in`
- **Auth Required:** Yes
- **Request Body:**

```json
{
  "latitude": 40.71285,
  "longitude": -74.00595
}
```

- **Validations:**
  - Latitude must be between -90 and 90
  - Longitude must be between -180 and 180
  - User must be within office radius (default 10 meters)
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
      "checkinLat": 40.71285,
      "checkinLng": -74.00595,
      "checkoutAt": null,
      "checkoutLat": null,
      "checkoutLng": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T09:00:00Z",
      "breakSessions": []
    }
  }
}
```

- **Errors:**
  - `400 Bad Request` - Invalid coordinates or already checked in
  - `409 Conflict` - Already checked in today
  - `500 Internal Server Error` - Office not configured

#### Check Out (Location Required)

- **Endpoint:** `POST /worklog/check-out`
- **Auth Required:** Yes
- **Request Body:**

```json
{
  "latitude": 40.71285,
  "longitude": -74.00595
}
```

- **Validations:**
  - User must be within office radius
  - Must have existing check-in for today
  - Status must be ACTIVE (not on break)
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
      "checkinLat": 40.71285,
      "checkinLng": -74.00595,
      "checkoutAt": "2026-06-07T17:30:00Z",
      "checkoutLat": 40.71285,
      "checkoutLng": -74.00595,
      "status": "CHECKED_OUT",
      "createdAt": "2026-06-07T09:00:00Z",
      "updatedAt": "2026-06-07T17:30:00Z",
      "breakSessions": []
    }
  }
}
```

- **Errors:**
  - `400 Bad Request` - Invalid coordinates, location out of range, or cannot check out on break
  - `404 Not Found` - No check-in found for today
  - `500 Internal Server Error` - Office not configured

#### Take a Break (No Location Required)

- **Endpoint:** `POST /worklog/take-break`
- **Auth Required:** Yes
- **Request Body:** `{}`
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "workLog": {
      "id": "uuid",
      "status": "ON_BREAK",
      ...
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

#### Return from Break (No Location Required)

- **Endpoint:** `POST /worklog/return-from-break`
- **Auth Required:** Yes
- **Request Body:** `{}`
- **Response (200 OK):** Similar to take-break with `endAt` populated

#### Get Today's WorkLog

- **Endpoint:** `GET /worklog/today`
- **Auth Required:** Yes
- **Response (200 OK):** Full worklog with break sessions

## Implementation Details

### Location Utility Functions

**Distance Calculation (Haversine Formula)**

```typescript
calculateDistance(lat1, lon1, lat2, lon2): number // Returns distance in meters
```

**Radius Validation**

```typescript
isLocationWithinRadius(userLat, userLon, officeLat, officeLon, radiusMeters): boolean
```

### Error Messages

| Error                                                 | Status | Description                           |
| ----------------------------------------------------- | ------ | ------------------------------------- |
| Invalid latitude/longitude                            | 400    | Coordinates out of valid range        |
| You are Xm away from office. Must be within 10 meters | 400    | Location out of radius                |
| Office not configured                                 | 500    | No office location exists in database |
| Already checked in today                              | 409    | User already has check-in for today   |
| No check-in found for today                           | 404    | Cannot check out without check-in     |
| Cannot check out when on break                        | 400    | Must return from break first          |
| Not currently on break                                | 400    | Cannot return when not on break       |

## File Structure

```
hono-backend/src/
├── features/
│   ├── auth/
│   ├── worklog/
│   │   ├── worklog.controller.ts
│   │   ├── worklog.routes.ts
│   │   ├── worklog.schema.ts
│   │   ├── worklog.service.ts
│   │   └── worklog.types.ts
│   └── office/
│       ├── office.controller.ts
│       ├── office.routes.ts
│       ├── office.schema.ts
│       ├── office.service.ts
│       └── office.types.ts
├── middleware/
│   └── auth.middleware.ts
├── utils/
│   ├── location.ts          # Distance calculation
│   ├── hash.ts
│   ├── jwt.ts
│   └── response.ts
└── index.ts                 # Main app with all route mounts
```

## Usage Examples

### 1. Setup Office Location

```bash
curl -X POST http://localhost:3000/office \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New York Office",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusMeters": 10
  }'
```

### 2. Complete Daily Workflow with Location

```bash
# Get current location from device (example coordinates)
LAT=40.71285
LNG=-74.00595

# Check in at office
curl -X POST http://localhost:3000/worklog/check-in \
  -H "Cookie: auth_token=<jwt_token>" \
  -H "Content-Type: application/json" \
  -d "{\"latitude\": $LAT, \"longitude\": $LNG}"

# Take break at 12:00 PM
curl -X POST http://localhost:3000/worklog/take-break \
  -H "Cookie: auth_token=<jwt_token>"

# Return from break at 1:00 PM
curl -X POST http://localhost:3000/worklog/return-from-break \
  -H "Cookie: auth_token=<jwt_token>"

# Check out at office
curl -X POST http://localhost:3000/worklog/check-out \
  -H "Cookie: auth_token=<jwt_token>" \
  -H "Content-Type: application/json" \
  -d "{\"latitude\": $LAT, \"longitude\": $LNG}"

# View today's log
curl -X GET http://localhost:3000/worklog/today \
  -H "Cookie: auth_token=<jwt_token>"
```

### 3. Handle Location Error

```bash
# Try to check in too far from office
curl -X POST http://localhost:3000/worklog/check-in \
  -H "Cookie: auth_token=<jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 40.70, "longitude": -74.01}'

# Response 400:
# {
#   "success": false,
#   "error": "You are 82m away from office. Must be within 10 meters"
# }
```

## Client Implementation Notes

### Frontend (Mobile/Web)

1. **Get User Location**

   ```javascript
   navigator.geolocation.getCurrentPosition((position) => {
     const lat = position.coords.latitude;
     const lng = position.coords.longitude;
     // Send to API
   });
   ```

2. **Check In with Location**

   ```javascript
   fetch("/worklog/check-in", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ latitude: lat, longitude: lng }),
   });
   ```

3. **Handle Location Errors**
   - If distance > radius: Show "Too far from office"
   - If coordinates invalid: Retry geolocation
   - If office not configured: Show admin error

## Security Considerations

1. **GPS Spoofing Protection**
   - Validate coordinates are reasonable (not jumping between continents)
   - Could add server-side timestamp validation
   - Consider IP geolocation as secondary check

2. **Privacy**
   - Store location data with check-in/out records
   - Only admins should see full location coordinates
   - Employees see only check-in status, not raw coordinates

3. **Authentication**
   - All worklog endpoints require valid JWT
   - Office endpoints can be restricted to admin role if needed

## Future Enhancements

1. **Configurable by Employee**
   - Allow employees to be assigned to specific offices
   - Different radius per employee/office combination

2. **Geofencing Zones**
   - Multiple zones within office (building, floor, department)
   - Unique location data per zone

3. **GPS Accuracy Validation**
   - Reject locations with poor accuracy (>50m)
   - Retry if GPS signal weak

4. **Analytics**
   - Average commute distance
   - Location patterns over time
   - Anomaly detection for impossible locations

5. **Integration**
   - Send location to mobile device background service
   - Automatic check-in via geofence trigger
   - Emergency location sharing for safety
