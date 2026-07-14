import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env") }); // adjust to your monorepo root
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

console.log(process.env.DATABASE_URL)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;