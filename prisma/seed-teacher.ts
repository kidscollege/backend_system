import { PrismaClient, Role, EmploymentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'teacher@kidscollege.ng';
  const password = 'Teacher@123';
  const passwordHash = await bcrypt.hash(password, 10);

  // 1. Create teacher user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      firstName: 'Test',
      lastName: 'Teacher',
      role: Role.TEACHER,
      isActive: true,
    },
  });

  // 2. Create staff profile linked to user
  let staff = await prisma.staff.findFirst({
    where: { userId: user.id },
  });

  if (!staff) {
    staff = await prisma.staff.create({
      data: {
        userId: user.id,
        staffNumber: 'TCH0001',
        firstName: 'Test',
        lastName: 'Teacher',
        email,
        designation: 'Teacher',
        status: EmploymentStatus.ACTIVE,
      },
    });
  }

  // 3. Find any class + subject to assign
  const classItem = await prisma.class.findFirst();
  const subject = await prisma.subject.findFirst();

  if (!classItem || !subject) {
    console.log('⚠️ Create at least one class and one subject in Academics first.');
    console.log('Teacher user created, but no class assignment yet.');
    console.log({ email, password });
    return;
  }

  // 4. Assign teacher to class-subject
  const existingAssignment = await prisma.classSubject.findFirst({
    where: {
      classId: classItem.id,
      subjectId: subject.id,
      teacherId: staff.id,
    },
  });

  if (!existingAssignment) {
    await prisma.classSubject.create({
      data: {
        classId: classItem.id,
        subjectId: subject.id,
        teacherId: staff.id,
      },
    });
  }

  console.log('✅ Test teacher ready');
  console.log({
    email,
    password,
    staffNumber: staff.staffNumber,
    assignedClass: classItem.name,
    assignedSubject: subject.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });