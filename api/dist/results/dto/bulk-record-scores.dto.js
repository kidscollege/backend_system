var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
class ScoreItemDto {
    studentId;
    score;
    remark;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ScoreItemDto.prototype, "studentId", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], ScoreItemDto.prototype, "score", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ScoreItemDto.prototype, "remark", void 0);
export class BulkRecordScoresDto {
    assessmentId;
    scores;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], BulkRecordScoresDto.prototype, "assessmentId", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ScoreItemDto),
    __metadata("design:type", Array)
], BulkRecordScoresDto.prototype, "scores", void 0);
//# sourceMappingURL=bulk-record-scores.dto.js.map