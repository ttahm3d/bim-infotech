import { sign, verify } from "hono/jwt";

export type JwtPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export const signToken = async (
  payload: JwtPayload,
  secret: string,
): Promise<string> => {
  return sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, // 7 days
    secret,
  );
};

export const verifyToken = async (
  token: string,
  secret: string,
): Promise<JwtPayload> => {
  return (await verify(token, secret, "ES256")) as JwtPayload;
};
