import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StudentsModule } from './students/students.module.js';
import { AcademicsModule } from './academics/academics.module.js';
import { FinanceModule } from './finance/finance.module.js';
import { ResultsModule } from './results/results.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { HrModule } from './hr/hr.module.js';
import { AdmissionsModule } from './admissions/admissions.module.js';
import { ProcurementModule } from './procurement/procurement.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,          
    StudentsModule,   
    AcademicsModule, 
    FinanceModule,
    ResultsModule,  
    AttendanceModule,   
    HrModule,   
    AdmissionsModule, 
    ProcurementModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}