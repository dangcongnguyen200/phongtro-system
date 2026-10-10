import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { z } from "zod";
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không hợp lệ" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return NextResponse.json({ error: "Email không tồn tại" }, { status: 401 });
    }
    if (user.status === "banned") {
      return NextResponse.json({ error: "Tài khoản đã bị khóa" }, { status: 403 });
    }
    const valid = await verifyPassword(parsed.data.password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
    }
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined,
    });
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    await prisma.userLog.create({
      data: { userId: user.id, action: "login", ip: req.headers.get("x-forwarded-for") || "" },
    });
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
