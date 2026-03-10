// src/routes/memos/+page.server.ts
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const memos = await prisma.memo.findMany({
        orderBy: { date: 'desc' },
        take: 20
    });

    // Get the latest memo base number
    const totalMemos = await prisma.memo.count();
    const nextBaseNo = 400 + totalMemos; // Assuming starting at 400 as per example

    return { memos, nextBaseNo };
};

export const actions: Actions = {
    dispatchMemo: async ({ request }) => {
        const formData = await request.formData();
        const memoNo = formData.get('memoNo') as string;
        const recipients = formData.get('recipients') as string;
        const subject = formData.get('subject') as string;
        const content = formData.get('content') as string;

        try {
            const newMemo = await prisma.memo.create({
                data: {
                    memoNo,
                    sendTo: recipients,
                    subject,
                    documentType: 'Official Dispatch',
                    content
                }
            });

            // Audit
            await prisma.auditLog.create({
                data: {
                    userId: 'cl_mock_user_123',
                    action: 'DISPATCH_MEMO',
                    target: `Memo ${newMemo.memoNo}`
                }
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to dispatch memo' });
        }
    }
};
