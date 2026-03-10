// src/lib/server/prisma.ts
import { PrismaClient } from '@prisma/client'
import { DATABASE_URL } from '$env/static/private'

if (!DATABASE_URL) {
    throw new Error('Missing DATABASE_URL for Prisma.')
}

const prisma =
    (globalThis as any).prisma ||
    new PrismaClient({
        datasourceUrl: DATABASE_URL
    })

// @ts-ignore
if (typeof process !== 'undefined' && (process as any).env.NODE_ENV === 'development') {
    (globalThis as any).prisma = prisma
}

export { prisma }
