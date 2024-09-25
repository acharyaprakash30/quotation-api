import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

export const getKeys = (keys) =>
  keys.reduce((obj, k) => ({ ...obj, [k]: true }), {});

export default prisma;
