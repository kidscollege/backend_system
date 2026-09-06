import { Module } from '@nestjs/common';
import { HrService } from './hr.service.js';
import { HrController } from './hr.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}