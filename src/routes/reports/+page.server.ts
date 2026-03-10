// src/routes/reports/+page.server.ts
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const reports = await prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });
    return { reports };
};

export const actions: Actions = {
    createReport: async ({ request }) => {
        const formData = await request.formData();
        const type = formData.get('type') as string;
        const referenceNo = formData.get('referenceNo') as string;
        const consumerName = formData.get('consumerName') as string;
        const meterNo = formData.get('meterNo') as string;
        const meterMake = formData.get('meterMake') as string;
        const subdivision = formData.get('subdivision') as string;
        const statusOfMeter = formData.get('statusOfMeter') as string;
        const remarks = formData.get('remarks') as string;

        if (referenceNo.length !== 14) {
            return fail(400, { message: 'Reference number must be 14 digits' });
        }

        try {
            const reportData: any = {
                type,
                referenceNo,
                consumerName,
                meterNo,
                meterMake,
                subdivision: subdivision || 'Jhelum',
                statusOfMeter,
                remarks,
                operatorId: 'cl_mock_user_123', // Placeholder until Auth is implemented
            };

            if (type === 'SINGLE_PHASE') {
                reportData.readingBill = parseFloat(formData.get('readingBill') as string) || 0;
                reportData.readingMeter = parseFloat(formData.get('readingMeter') as string) || 0;
            } else {
                reportData.peakBill = parseFloat(formData.get('peakBill') as string) || 0;
                reportData.offPeakBill = parseFloat(formData.get('offPeakBill') as string) || 0;
                reportData.peakMeter = parseFloat(formData.get('peakMeter') as string) || 0;
                reportData.offPeakMeter = parseFloat(formData.get('offPeakMeter') as string) || 0;
            }

            // Background AI Analysis Simulation
            let analysisRemarks = "";
            let flagged = false;
            
            if (type === 'SINGLE_PHASE') {
                const diff = Math.abs(parseFloat(formData.get('readingMeter') as string) - parseFloat(formData.get('readingBill') as string));
                if (diff > 500) { flagged = true; analysisRemarks = "Suspicious consumption jump (>500 units). Possible meter interference."; }
            }

            const newReport = await prisma.report.create({
                data: {
                    ...reportData,
                    isAiFlagged: flagged,
                    aiRemarks: analysisRemarks
                }
            });

            // Audit log
            await prisma.auditLog.create({
                data: {
                    userId: 'cl_mock_user_123',
                    action: flagged ? 'AI_FLAGGED_REPORT' : 'CREATE_REPORT',
                    target: `Report ${newReport.referenceNo}`
                }
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to save report' });
        }
    }
};
