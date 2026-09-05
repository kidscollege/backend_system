var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { InvoiceStatus, PaymentStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateInvoiceNumber() {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.feeInvoice.count();
        const next = (count + 1).toString().padStart(5, '0');
        return `INV${year}${next}`;
    }
    async generateReceiptNumber() {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.payment.count({
            where: { status: PaymentStatus.SUCCESS },
        });
        const next = (count + 1).toString().padStart(5, '0');
        return `RCPT${year}${next}`;
    }
    async createFeeStructure(dto) {
        return this.prisma.feeStructure.create({
            data: {
                name: dto.name,
                description: dto.description,
                amount: new Prisma.Decimal(dto.amount),
                classId: dto.classId,
                sessionId: dto.sessionId,
                termId: dto.termId,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async getFeeStructures() {
        return this.prisma.feeStructure.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async createInvoice(dto) {
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId },
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('Invoice must have at least one item');
        }
        const totalAmount = dto.items.reduce((sum, item) => sum + Number(item.amount), 0);
        const invoiceNumber = await this.generateInvoiceNumber();
        const invoice = await this.prisma.feeInvoice.create({
            data: {
                studentId: dto.studentId,
                invoiceNumber,
                totalAmount: new Prisma.Decimal(totalAmount),
                amountPaid: new Prisma.Decimal(0),
                balance: new Prisma.Decimal(totalAmount),
                status: InvoiceStatus.PENDING,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                sessionId: dto.sessionId,
                termId: dto.termId,
                items: {
                    create: dto.items.map((item) => ({
                        description: item.description,
                        amount: new Prisma.Decimal(item.amount),
                        feeStructureId: item.feeStructureId,
                    })),
                },
            },
            include: {
                items: true,
                student: {
                    select: {
                        id: true,
                        admissionNumber: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return invoice;
    }
    async getInvoices(studentId) {
        return this.prisma.feeInvoice.findMany({
            where: studentId ? { studentId } : undefined,
            include: {
                student: {
                    select: {
                        id: true,
                        admissionNumber: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                items: true,
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getInvoice(id) {
        const invoice = await this.prisma.feeInvoice.findUnique({
            where: { id },
            include: {
                student: true,
                items: true,
                payments: true,
            },
        });
        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async recordPayment(dto) {
        const invoice = await this.prisma.feeInvoice.findUnique({
            where: { id: dto.invoiceId },
        });
        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }
        if (invoice.status === InvoiceStatus.PAID) {
            throw new BadRequestException('Invoice is already fully paid');
        }
        const paymentAmount = new Prisma.Decimal(dto.amount);
        const newAmountPaid = invoice.amountPaid.add(paymentAmount);
        const newBalance = invoice.totalAmount.sub(newAmountPaid);
        if (newBalance.lessThan(0)) {
            throw new BadRequestException('Payment amount exceeds invoice balance');
        }
        let newStatus = InvoiceStatus.PARTIAL;
        if (newBalance.equals(0)) {
            newStatus = InvoiceStatus.PAID;
        }
        const receiptNumber = await this.generateReceiptNumber();
        const result = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    invoiceId: dto.invoiceId,
                    amount: paymentAmount,
                    method: dto.method,
                    status: PaymentStatus.SUCCESS,
                    receiptNumber,
                    paidAt: new Date(),
                    notes: dto.notes,
                    paystackRef: dto.paystackRef,
                },
            });
            const updatedInvoice = await tx.feeInvoice.update({
                where: { id: dto.invoiceId },
                data: {
                    amountPaid: newAmountPaid,
                    balance: newBalance,
                    status: newStatus,
                },
                include: {
                    items: true,
                    payments: true,
                    student: {
                        select: {
                            id: true,
                            admissionNumber: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return { payment, invoice: updatedInvoice };
        });
        return result;
    }
    async getStudentBalances(studentId) {
        const invoices = await this.prisma.feeInvoice.findMany({
            where: {
                studentId,
                status: { in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIAL, InvoiceStatus.OVERDUE] },
            },
            orderBy: { createdAt: 'desc' },
        });
        const totalBalance = invoices.reduce((sum, inv) => sum + Number(inv.balance), 0);
        return {
            studentId,
            totalBalance,
            invoices,
        };
    }
    async updateFeeStructure(id, dto) {
        const item = await this.prisma.feeStructure.findUnique({ where: { id } });
        if (!item)
            throw new NotFoundException('Fee structure not found');
        return this.prisma.feeStructure.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                amount: new Prisma.Decimal(dto.amount),
                classId: dto.classId,
                sessionId: dto.sessionId,
                termId: dto.termId,
                isActive: dto.isActive ?? item.isActive,
            },
        });
    }
    async deleteFeeStructure(id) {
        const item = await this.prisma.feeStructure.findUnique({ where: { id } });
        if (!item)
            throw new NotFoundException('Fee structure not found');
        return this.prisma.feeStructure.delete({ where: { id } });
    }
    async getFeesPaidByTerm() {
        const payments = await this.prisma.payment.findMany({
            where: { status: 'SUCCESS' },
            include: {
                invoice: true,
            },
        });
        const terms = await this.prisma.term.findMany();
        const termMap = new Map(terms.map((t) => [t.id, t.name]));
        const map = {};
        for (const p of payments) {
            const termId = p.invoice?.termId || 'none';
            const termName = termId !== 'none' ? termMap.get(termId) || 'Unknown Term' : 'No Term';
            if (!map[termId]) {
                map[termId] = {
                    termId: p.invoice?.termId || null,
                    termName,
                    total: 0,
                    count: 0,
                };
            }
            map[termId].total += Number(p.amount);
            map[termId].count += 1;
        }
        return Object.values(map);
    }
    async getFeesPaidByClass() {
        const payments = await this.prisma.payment.findMany({
            where: { status: 'SUCCESS' },
            include: {
                invoice: {
                    include: {
                        student: true,
                    },
                },
            },
        });
        const classes = await this.prisma.class.findMany();
        const classMap = new Map(classes.map((c) => [c.id, c.name]));
        const map = {};
        for (const p of payments) {
            const classId = p.invoice?.student?.currentClassId || 'none';
            const className = classId !== 'none' ? classMap.get(classId) || 'Unknown Class' : 'Unassigned';
            if (!map[classId]) {
                map[classId] = {
                    classId: p.invoice?.student?.currentClassId || null,
                    className,
                    total: 0,
                    count: 0,
                };
            }
            map[classId].total += Number(p.amount);
            map[classId].count += 1;
        }
        return Object.values(map);
    }
    async getFilteredPaymentsReport(filters) {
        const payments = await this.prisma.payment.findMany({
            where: {
                status: 'SUCCESS',
                invoice: {
                    ...(filters.termId ? { termId: filters.termId } : {}),
                    ...(filters.sessionId ? { sessionId: filters.sessionId } : {}),
                    ...(filters.classId
                        ? {
                            student: {
                                currentClassId: filters.classId,
                            },
                        }
                        : {}),
                },
            },
        });
        const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            total,
            count: payments.length,
            filters,
        };
    }
};
FinanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FinanceService);
export { FinanceService };
//# sourceMappingURL=finance.service.js.map