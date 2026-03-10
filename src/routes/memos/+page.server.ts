import { prisma } from '$lib/server/prisma';
import { fail, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const memos = await prisma.memo.findMany({
        orderBy: { date: 'desc' },
        take: 50
    });
    return { memos };
};

export const actions: Actions = {
    createMemo: async ({ request }: RequestEvent) => {
        const formData = await request.formData();
        const sendTo = formData.get('sendTo') as string;
        const subject = formData.get('subject') as string;
        const documentType = formData.get('documentType') as string;
        const content = formData.get('content') as string;
        const officesCount = parseInt(formData.get('officesCount') as string || '1');

        if (!sendTo || !subject || !content) {
            return fail(400, { message: 'Required fields missing' });
        }

        try {
            // Auto-generate Memo Number
            const count = await prisma.memo.count();
            const baseNumber = 400 + count; // Starting point as per requirements
            const paddedOffices = officesCount.toString().padStart(2, '0');
            const memoNo = `${baseNumber}-${paddedOffices}`;

            const newMemo = await prisma.memo.create({
                data: {
                    memoNo,
                    sendTo,
                    subject,
                    documentType,
                    content
                }
            });

            // Audit log
            await prisma.auditLog.create({
                data: {
                    userId: 'cl_mock_user_123',
                    action: 'CREATE_MEMO',
                    target: `Memo ${newMemo.memoNo}`
                }
            });

            return { success: true, memoNo: newMemo.memoNo };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to create memo' });
        }
    },
    deleteMemo: async ({ request }: RequestEvent) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) return fail(400, { message: 'Memo ID required' });

        try {
            const memoInfo = await prisma.memo.findUnique({ where: { id }});
            await prisma.memo.delete({ where: { id } });
            
            // Audit log
            if(memoInfo){
                 await prisma.auditLog.create({
                    data: {
                        userId: 'cl_mock_user_123',
                        action: 'DELETE_MEMO',
                        target: `Memo ${memoInfo.memoNo}`
                    }
                });
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to delete memo' });
        }
    }
};
