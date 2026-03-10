import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q');
    
    if (!query) {
        return { results: [], query: "" };
    }

    const results = await prisma.report.findMany({
        where: {
            OR: [
                { referenceNo: { contains: query } },
                { consumerName: { contains: query, mode: 'insensitive' } },
                { meterNo: { contains: query } }
            ]
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return { results, query };
};
