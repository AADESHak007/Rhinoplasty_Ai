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

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Handle connection cleanup
if (process.env.NODE_ENV === 'production') {
  // Ensure initial connection
  prisma.$connect().then(() => {
    console.log('Connected to database')
  })
  
  // Handle various termination scenarios
  const cleanup = async () => {
    console.log('Cleaning up database connections')
    await prisma.$disconnect()
  }
  
  process.on('beforeExit', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('SIGINT', cleanup)
} 