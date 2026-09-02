var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
export class CreateSessionDto {
    name;
    startDate;
    endDate;
    isCurrent;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "name", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "startDate", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "endDate", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateSessionDto.prototype, "isCurrent", void 0);
//# sourceMappingURL=create-session.dto.js.map