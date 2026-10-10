import { cookies } from "next/headers";
import { verifyToken, type JWTPayload } from "./jwt";
export const SESSION_COOKIE = "pt_session";
export async function getSession(): Promise<JWTPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
export async function requireAdmin(): Promise<JWTPayload> {
  const session = await requireAuth();
  if (session.role !== "admin") throw new Error("FORBIDDEN");
  return session;
}
