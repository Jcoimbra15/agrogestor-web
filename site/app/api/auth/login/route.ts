import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { comparePassword } from "../../../lib/password";
import { signToken } from "../../../lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Informe email e senha." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });
res.cookies.set("auth_token", token, {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
});
return res;


    const res = NextResponse.json(
      { ok: true, user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    );

    res.cookies.set("ag_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return res;
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return NextResponse.json(
      { ok: false, message: "Erro interno ao entrar." },
      { status: 500 }
    );
  }
}
