var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StudentStatus, InvoiceStatus, ApplicationStatus, EmploymentStatus, } from '@prisma/client';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [totalStudents, activeStudents, totalStaff, activeStaff, totalApplications, pendingApplications, totalInvoices, pendingInvoices, totalRevenue, currentSession,] = await Promise.all([
            this.prisma.student.count(),
            this.prisma.student.count({ where: { status: StudentStatus.ACTIVE } }),
            this.prisma.staff.count(),
            this.prisma.staff.count({ where: { status: EmploymentStatus.ACTIVE } }),
            this.prisma.admissionApplication.count(),
            this.prisma.admissionApplication.count({
                where: {
                    status: {
                        in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW],
                    },
                },
            }),
            this.prisma.feeInvoice.count(),
            this.prisma.feeInvoice.count({
                where: {
                    status: { in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIAL] },
                },
            }),
            this.prisma.payment.aggregate({
                where: { status: 'SUCCESS' },
                _sum: { amount: true },
            }),
            this.prisma.academicSession.findFirst({
                where: { isCurrent: true },
                include: { terms: true },
            }),
        ]);
        return {
            students: {
                total: totalStudents,
                active: activeStudents,
            },
            staff: {
                total: totalStaff,
                active: activeStaff,
            },
            admissions: {
                total: totalApplications,
                pending: pendingApplications,
            },
            finance: {
                totalInvoices,
                pendingInvoices,
                totalRevenue: totalRevenue._sum.amount || 0,
            },
            currentSession,
        };
    }
    async getFinanceSummary() {
        const [paid, partial, pending, overdue] = await Promise.all([
            this.prisma.feeInvoice.aggregate({
                where: { status: InvoiceStatus.PAID },
                _sum: { totalAmount: true },
                _count: true,
            }),
            this.prisma.feeInvoice.aggregate({
                where: { status: InvoiceStatus.PARTIAL },
                _sum: { balance: true },
                _count: true,
            }),
            this.prisma.feeInvoice.aggregate({
                where: { status: InvoiceStatus.PENDING },
                _sum: { totalAmount: true },
                _count: true,
            }),
            this.prisma.feeInvoice.aggregate({
                where: { status: InvoiceStatus.OVERDUE },
                _sum: { balance: true },
                _count: true,
            }),
        ]);
        const recentPayments = await this.prisma.payment.findMany({
            where: { status: 'SUCCESS' },
            take: 10,
            orderBy: { paidAt: 'desc' },
            include: {
                invoice: {
                    include: {
                        student: {
                            select: {
                                admissionNumber: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            paid: {
                count: paid._count,
                amount: paid._sum.totalAmount || 0,
            },
            partial: {
                count: partial._count,
                balance: partial._sum.balance || 0,
            },
            pending: {
                count: pending._count,
                amount: pending._sum.totalAmount || 0,
            },
            overdue: {
                count: overdue._count,
                balance: overdue._sum.balance || 0,
            },
            recentPayments,
        };
    }
    async getStudentSummary() {
        const byStatus = await this.prisma.student.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const byClass = await this.prisma.student.groupBy({
            by: ['currentClassId'],
            where: { status: StudentStatus.ACTIVE },
            _count: { currentClassId: true },
        });
        const classIds = byClass
            .map((c) => c.currentClassId)
            .filter((id) => id !== null);
        const classes = await this.prisma.class.findMany({
            where: { id: { in: classIds } },
            select: { id: true, name: true },
        });
        const classMap = new Map(classes.map((c) => [c.id, c.name]));
        return {
            byStatus: byStatus.map((s) => ({
                status: s.status,
                count: s._count.status,
            })),
            byClass: byClass.map((c) => ({
                classId: c.currentClassId,
                className: c.currentClassId
                    ? classMap.get(c.currentClassId) || 'Unknown'
                    : 'Unassigned',
                count: c._count.currentClassId,
            })),
        };
    }
    async getAttendanceSummary(termId, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const records = await this.prisma.attendanceRecord.groupBy({
            by: ['status'],
            where: {
                termId,
                date: { gte: startDate },
            },
            _count: { status: true },
        });
        const total = records.reduce((sum, r) => sum + r._count.status, 0);
        return {
            period: `Last ${days} days`,
            total,
            breakdown: records.map((r) => ({
                status: r.status,
                count: r._count.status,
                percentage: total > 0 ? Math.round((r._count.status / total) * 100) : 0,
            })),
        };
    }
    async getRecentActivities() {
        const [recentStudents, recentApplications, recentPayments] = await Promise.all([
            this.prisma.student.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    admissionNumber: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                },
            }),
            this.prisma.admissionApplication.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    applicationNo: true,
                    firstName: true,
                    lastName: true,
                    status: true,
                    createdAt: true,
                },
            }),
            this.prisma.payment.findMany({
                take: 5,
                where: { status: 'SUCCESS' },
                orderBy: { paidAt: 'desc' },
                include: {
                    invoice: {
                        select: {
                            invoiceNumber: true,
                            student: {
                                select: { firstName: true, lastName: true },
                            },
                        },
                    },
                },
            }),
        ]);
        return {
            recentStudents,
            recentApplications,
            recentPayments,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map