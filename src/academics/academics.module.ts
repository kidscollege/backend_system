import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service.js';
import { AcademicsController } from './academics.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [AcademicsController],
  providers: [AcademicsService],
  exports: [AcademicsService],
})
export class AcademicsModule {}