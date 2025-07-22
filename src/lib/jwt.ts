import { SignJWT, jwtVerify, JWTPayload } from "jose";

const JWT_SECRET: Uint8Array = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export interface AccessTokenPayload extends JWTPayload {
  id: string;
  username: string;
  email: string;
  roles: string[];
  is_verified: boolean;
}

export interface RefreshTokenPayload extends JWTPayload {
  id: string;
  type: "refresh";
}

export async function createAccessToken(
  payload: AccessTokenPayload,
  expiresInSeconds = 900
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(JWT_SECRET);
}

export async function createRefreshToken(
  payload: RefreshTokenPayload,
  expiresInSeconds = 60 * 60 * 24 * 30
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(JWT_SECRET);
}

export async function createVerificationToken(
  email: string,
  expiresInSeconds = 60 * 60 * 24
): Promise<string> {
  const payload: JWTPayload = {
    email: email,
    type: "verification",
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(JWT_SECRET);
}

export async function createPasswordResetToken(
  email: string,
  expiresInSeconds = 60 * 60 * 24
): Promise<string> {
  const payload: JWTPayload = {
    email: email,
    type: "password_reset",
  };
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(JWT_SECRET);
}

export async function verifyJWT<T extends JWTPayload = JWTPayload>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify<T>(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function decodeJWT<T extends JWTPayload = JWTPayload>(
  token: string
): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
          (c) => c.charCodeAt(0)
        )
      )
    );
    return decoded as T;
  } catch {
    return null;
  }
}
