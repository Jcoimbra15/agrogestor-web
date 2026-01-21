import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { hashPassword } from "../../../lib/password";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "Informe nome, email e senha." },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Email já cadastrado." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: passwordHash },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json(
      { ok: false, message: "Erro interno ao cadastrar." },
      { status: 500 }
    );
  }
}
