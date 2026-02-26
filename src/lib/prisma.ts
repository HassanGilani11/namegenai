import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

/**
 * Prisma Client Singleton for Prisma 7
 */

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn("[Prisma] DATABASE_URL is missing! This is expected during build time if not provided.");
    // Return a dummy client or handle it such that it doesn't crash the build
    return new PrismaClient({
      log: ["error"],
    });
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") || connectionString.includes("ssl=true")
      ? { rejectUnauthorized: false }
      : false,
    max: 10,
  });

  const adapter = new PrismaPg(pool);

  console.log("[Prisma] Initializing PrismaClient with Pg adapter...");
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
