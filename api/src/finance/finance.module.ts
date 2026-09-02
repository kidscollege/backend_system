import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { FinanceController } from './finance.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}