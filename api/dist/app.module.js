var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map