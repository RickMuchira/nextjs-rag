import { PrismaClient } from '@prisma/client';

// Define proper type for the global variable
declare global {
  var prisma: PrismaClient | undefined;
}

// Use proper typing instead of any
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
