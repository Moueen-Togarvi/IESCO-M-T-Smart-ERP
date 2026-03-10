// src/routes/api/check-ref/+server.ts
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const ref = url.searchParams.get('ref');
    if (!ref || ref.length !== 14) return json({ exists: false });

    // Check for reports with this ref in the last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const previousReport = await prisma.report.findFirst({
        where: {
            referenceNo: ref,
            createdAt: {
                gte: oneYearAgo
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (previousReport) {
        return json({
            exists: true,
            history: [{
                date: previousReport.createdAt.toISOString().split('T')[0],
                status: previousReport.statusOfMeter,
                remarks: previousReport.remarks
            }]
        });
    }

    return json({ exists: false });
};
