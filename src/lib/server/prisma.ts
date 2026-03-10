// src/lib/server/prisma.ts
import { PrismaClient } from '@prisma/client'
import { DATABASE_URL } from '$env/static/private'

// Ensure Prisma can find the database URL in the environment
// @ts-ignore
if (typeof process !== 'undefined') {
    process.env.DATABASE_URL = DATABASE_URL
}

const prisma = (globalThis as any).prisma || new PrismaClient()

// @ts-ignore
if (typeof process !== 'undefined' && (process as any).env.NODE_ENV === 'development') {
    (globalThis as any).prisma = prisma
}

export { prisma }
