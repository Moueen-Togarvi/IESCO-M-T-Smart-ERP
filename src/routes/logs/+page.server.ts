import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const logs = await prisma.auditLog.findMany({
        include: {
            user: true
        },
        orderBy: {
            timestamp: 'desc'
        },
        take: 50 // Limit to last 50 for performance
    });

    return {
        logs
    };
};
