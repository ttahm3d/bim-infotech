export type WorkLogResponse = {
  id: string;
  userId: string;
  date: Date;
  checkinAt: Date;
  checkinLat: number;
  checkinLng: number;
  checkoutAt: Date | null;
  checkoutLat: number | null;
  checkoutLng: number | null;
  status: "ACTIVE" | "ON_BREAK" | "CHECKED_OUT";
  createdAt: Date;
  updatedAt: Date;
  breakSessions?: BreakSessionResponse[];
};

export type BreakSessionResponse = {
  id: string;
  worklogId: string;
  startAt: Date;
  endAt: Date | null;
  createdAt: Date;
};

export type OfficeResponse = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: Date;
  updatedAt: Date;
};
