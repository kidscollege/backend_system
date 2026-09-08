import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service.js';
import { TeacherController } from './teacher.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}