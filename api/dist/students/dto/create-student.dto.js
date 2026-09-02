var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsEmail, } from 'class-validator';
import { StudentStatus } from '@prisma/client';
export class CreateStudentDto {
    firstName;
    lastName;
    middleName;
    gender;
    dateOfBirth;
    bloodGroup;
    nationality;
    religion;
    address;
    status;
    admissionDate;
    currentClassId;
    currentSectionId;
    sessionId;
    parentFirstName;
    parentLastName;
    parentPhone;
    parentEmail;
    relationship;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "lastName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "middleName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "gender", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "bloodGroup", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "nationality", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "religion", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsEnum(StudentStatus),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "admissionDate", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "currentClassId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "currentSectionId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "sessionId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "parentFirstName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "parentLastName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "parentPhone", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "parentEmail", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "relationship", void 0);
//# sourceMappingURL=create-student.dto.js.map