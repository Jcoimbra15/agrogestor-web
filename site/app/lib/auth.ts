import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";

const COOKIE_NAME = "agrogestor_session";
const DAYS = 7;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = addDays(new Date(), DAYS);

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().delete(COOKIE_NAME);
}

export async function getUserFromRequest() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  // sessão expirada
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { token } });
    cookies().delete(COOKIE_NAME);
    return null;
  }

  return session.user;
}
