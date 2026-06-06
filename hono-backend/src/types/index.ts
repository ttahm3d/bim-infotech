import type { Prisma } from "../lib/prisma.ts";

export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type Variables = {
  prisma: Prisma;
  jwtPayload: {
    sub: string;
    email: string;
  };
};
