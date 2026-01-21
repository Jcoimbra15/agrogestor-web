import { PrismaClient } from "@prisma/client";

declare global {
  // evita criar várias instâncias em hot-reload (dev)
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// também exporta default para não quebrar imports antigos
export default prisma;
