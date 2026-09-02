var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { HrService } from './hr.service.js';
import { HrController } from './hr.controller.js';
import { AuthModule } from '../auth/auth.module.js';
let HrModule = class HrModule {
};
HrModule = __decorate([
    Module({
        imports: [AuthModule],
        controllers: [HrController],
        providers: [HrService],
        exports: [HrService],
    })
], HrModule);
export { HrModule };
//# sourceMappingURL=hr.module.js.map