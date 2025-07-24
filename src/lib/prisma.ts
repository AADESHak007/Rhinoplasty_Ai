import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// Ensure singleton pattern
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Only set global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Handle connection cleanup for production
if (process.env.NODE_ENV === 'production') {
  const cleanup = async () => {
    console.log('Cleaning up database connections')
    await prisma.$disconnect()
  }
  
  process.on('beforeExit', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('SIGINT', cleanup)
} 