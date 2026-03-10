import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const reference = url.searchParams.get('ref');

    if (!reference || reference.length !== 14) {
        return json({ exists: false, history: [] });
    }

    try {
        const pastReports = await prisma.report.findMany({
            where: { referenceNo: reference },
            orderBy: { createdAt: 'desc' },
            select: {
                createdAt: true,
                statusOfMeter: true,
                remarks: true
            }
        });

        if (pastReports.length > 0) {
            const formattedHistory = pastReports.map((report: any) => ({
                date: report.createdAt.toLocaleDateString(),
                status: report.statusOfMeter,
                remarks: report.remarks
            }));
            return json({ exists: true, history: formattedHistory });
        }

        return json({ exists: false, history: [] });
    } catch (error) {
        console.error("Reference Check Error:", error);
        return json({ exists: false, history: [] });
    }
};
