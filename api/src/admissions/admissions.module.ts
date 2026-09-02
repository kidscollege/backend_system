import { Module } from '@nestjs/common';
import { AdmissionsService } from './admissions.service.js';
import { AdmissionsController } from './admissions.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [AdmissionsController],
  providers: [AdmissionsService],
  exports: [AdmissionsService],
})
export class AdmissionsModule {}