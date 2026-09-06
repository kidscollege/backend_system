import { Module } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { AuthModule } from '../auth/auth.module.js';   // ← add this

@Module({
  imports: [AuthModule],          // ← add this line
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}