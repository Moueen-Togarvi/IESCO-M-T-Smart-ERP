// src/routes/+page.server.ts
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Fetch real stats from the database
    const totalReports = await prisma.report.count();
    
    const slowCases = await prisma.report.count({ where: { statusOfMeter: 'Slow' } });
    const theftCases = await prisma.report.count({ where: { statusOfMeter: 'Theft' } });
    const burntCases = await prisma.report.count({ where: { statusOfMeter: 'Burnt' } });
    const epromDamaged = await prisma.report.count({ where: { statusOfMeter: 'EPROM Damaged' } });
    const displayWashed = await prisma.report.count({ where: { statusOfMeter: 'Display Washed' } });
    const waterInsertion = await prisma.report.count({ where: { statusOfMeter: 'Water Insertion' } });

    // Mock data for "Received" vs "Checked" since we only have reports table for now
    const metersReceived = totalReports + 142; // Example static baseline
    const metersChecked = totalReports;
    const metersBalance = metersReceived - metersChecked;

    // Recent activity
    const recentLogs = await prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 5,
        include: { user: true }
    });

    return {
        stats: {
            metersReceived,
            metersChecked,
            metersBalance,
            slowCases,
            theftCases,
            burntCases,
            epromDamaged,
            displayWashed,
            waterInsertion
        },
        recentLogs
    };
};
