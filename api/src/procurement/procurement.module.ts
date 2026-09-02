import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service.js';
import { ProcurementController } from './procurement.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [ProcurementService],
})
export class ProcurementModule {}