import { Module } from '@nestjs/common';
import { ParentService } from './parent.service.js';
import { ParentController } from './parent.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}