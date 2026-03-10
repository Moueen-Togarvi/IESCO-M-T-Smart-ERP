// src/routes/search/+page.server.ts
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q');
    if (!query) return { reports: [], query: '' };

    const reports = await prisma.report.findMany({
        where: {
            OR: [
                { referenceNo: { contains: query, mode: 'insensitive' } },
                { consumerName: { contains: query, mode: 'insensitive' } },
                { meterNo: { contains: query, mode: 'insensitive' } },
                { subdivision: { contains: query, mode: 'insensitive' } },
            ]
        },
        orderBy: { createdAt: 'desc' }
    });

    return { reports, query };
};
