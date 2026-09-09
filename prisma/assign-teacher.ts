import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'teacher@kidscollege.ng' },
  });
  if (!user) throw new Error('Teacher user not found');

  const staff = await prisma.staff.findFirst({
    where: { userId: user.id },
  });
  if (!staff) throw new Error('Teacher staff profile not found');

  const classItem = await prisma.class.findFirst();
  const subject = await prisma.subject.findFirst();

  if (!classItem || !subject) {
    throw new Error('Create at least one class and one subject first');
  }

  const existing = await prisma.classSubject.findFirst({
    where: {
      classId: classItem.id,
      subjectId: subject.id,
      teacherId: staff.id,
    },
  });

  if (!existing) {
    await prisma.classSubject.create({
      data: {
        classId: classItem.id,
        subjectId: subject.id,
        teacherId: staff.id,
      },
    });
  }

  console.log('✅ Assigned teacher to class/subject:', {
    teacher: staff.firstName,
    className: classItem.name,
    subject: subject.name,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });