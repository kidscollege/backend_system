var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';
class AttendanceItemDto {
    studentId;
    status;
    remark;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AttendanceItemDto.prototype, "studentId", void 0);
__decorate([
    IsEnum(AttendanceStatus),
    __metadata("design:type", String)
], AttendanceItemDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], AttendanceItemDto.prototype, "remark", void 0);
export class BulkMarkAttendanceDto {
    termId;
    date;
    records;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], BulkMarkAttendanceDto.prototype, "termId", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], BulkMarkAttendanceDto.prototype, "date", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => AttendanceItemDto),
    __metadata("design:type", Array)
], BulkMarkAttendanceDto.prototype, "records", void 0);
//# sourceMappingURL=bulk-mark-attendance.dto.js.map