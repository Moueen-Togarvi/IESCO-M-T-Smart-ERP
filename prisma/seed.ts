import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Admin and Operator Users
  const admin = await prisma.user.upsert({
    where: { username: 'moueen_admin' },
    update: {},
    create: {
      username: 'moueen_admin',
      role: 'ADMIN'
    }
  })

  const operator = await prisma.user.upsert({
    where: { username: 'operator_01' },
    update: {},
    create: {
      username: 'operator_01',
      role: 'OPERATOR'
    }
  })

  // 2. Clear Existing Data (Optional but good for a fresh start)
  await prisma.auditLog.deleteMany({})
  await prisma.report.deleteMany({})

  // 3. Create Sample Reports
  const reportsData = [
    {
      subdivision: 'Jhelum',
      referenceNo: '14212398542100',
      consumerName: 'Malik Flour Mills',
      meterNo: 'IES-99842',
      meterMake: 'Landis+Gyr',
      mcoNoDate: 'MCO-123 / 2026-01-10',
      type: 'THREE_PHASE',
      peakBill: 4500,
      offPeakBill: 12000,
      peakMeter: 4800,
      offPeakMeter: 12500,
      statusOfMeter: 'Healthy',
      remarks: 'Routine inspection completed.',
      operatorId: admin.id
    },
    {
      subdivision: 'Jhelum',
      referenceNo: '08422398542100',
      consumerName: 'Aslam & Sons',
      meterNo: 'MT-8821',
      meterMake: 'Microtech',
      mcoNoDate: 'MCO-456 / 2026-02-15',
      type: 'SINGLE_PHASE',
      readingBill: 850,
      readingMeter: 1200,
      statusOfMeter: 'Slow',
      remarks: 'Meter found running slow. Recommended for replacement.',
      operatorId: operator.id
    },
    {
      subdivision: 'Dina',
      referenceNo: '12212398542101',
      consumerName: 'Sheikh Petrol Pump',
      meterNo: 'L+G-0012',
      meterMake: 'Landis+Gyr',
      mcoNoDate: 'MCO-789 / 2025-12-20',
      type: 'THREE_PHASE',
      peakBill: 15000,
      offPeakBill: 35000,
      peakMeter: 15100,
      offPeakMeter: 35200,
      statusOfMeter: 'Healthy',
      remarks: 'All seals found intact.',
      operatorId: admin.id
    }
  ]

  for (const report of reportsData) {
    await prisma.report.create({ data: report })
  }

  // 4. Create Audit Logs
  const logsData = [
    { userId: admin.id, action: 'CREATE_USER', target: 'operator_01' },
    { userId: admin.id, action: 'CREATE_REPORT', target: 'Ref: 14212398542100' },
    { userId: operator.id, action: 'CREATE_REPORT', target: 'Ref: 08422398542100' },
    { userId: admin.id, action: 'LOGIN', target: 'System Portal' },
    { userId: operator.id, action: 'LOGIN', target: 'System Portal' },
    { userId: admin.id, action: 'DELETE_LOGS', target: 'Archive' }
  ]

  for (const log of logsData) {
    await prisma.auditLog.create({ data: log })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
