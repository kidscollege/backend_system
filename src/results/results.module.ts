import { Module } from '@nestjs/common';
import { ResultsService } from './results.service.js';
import { ResultsController } from './results.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}