import { Module } from '@nestjs/common';
import { ParentService } from './parent.service.js';
import { ParentController } from './parent.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}