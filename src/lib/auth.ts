import { prisma } from './prisma'

export async function getCurrentAdmin() {
  // Mock authentication for Phase 1 Milestone 1
  // In a real app, we would verify a session token or JWT here
  const admin = await prisma.user.findFirst({
    where: { role: 'PLATFORM_ADMIN' }
  })
  
  if (!admin) {
    throw new Error('No admin user found. Did you run the seed script?')
  }
  
  return admin
}
