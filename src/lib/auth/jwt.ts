import { SignJWT, jwtVerify } from "jose";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "phongtro-secret-key-change-in-production-2024"
);
export type JWTPayload = {
  userId: string;
  email: string;
  role: string;
  name?: string;
};
export async function signToken(payload: JWTPayload, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET);
}
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}
