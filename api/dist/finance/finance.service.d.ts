import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { Prisma } from '@prisma/client';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateInvoiceNumber;
    private generateReceiptNumber;
    createFeeStructure(dto: CreateFeeStructureDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        amount: Prisma.Decimal;
        classId: string | null;
        sessionId: string | null;
        termId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getFeeStructures(): Promise<{
        id: string;
        name: string;
        description: string | null;
        amount: Prisma.Decimal;
        classId: string | null;
        sessionId: string | null;
        termId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createInvoice(dto: CreateInvoiceDto): Promise<{
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        };
        items: {
            id: string;
            description: string;
            amount: Prisma.Decimal;
            feeStructureId: string | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        sessionId: string | null;
        termId: string | null;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        totalAmount: Prisma.Decimal;
        amountPaid: Prisma.Decimal;
        balance: Prisma.Decimal;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        dueDate: Date | null;
        studentId: string;
    }>;
    getInvoices(studentId?: string): Promise<({
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        };
        items: {
            id: string;
            description: string;
            amount: Prisma.Decimal;
            feeStructureId: string | null;
            invoiceId: string;
        }[];
        payments: {
            id: string;
            amount: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
            notes: string | null;
        }[];
    } & {
        id: string;
        sessionId: string | null;
        termId: string | null;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        totalAmount: Prisma.Decimal;
        amountPaid: Prisma.Decimal;
        balance: Prisma.Decimal;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        dueDate: Date | null;
        studentId: string;
    })[]>;
    getInvoice(id: string): Promise<{
        student: {
            id: string;
            sessionId: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.StudentStatus;
            userId: string | null;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            middleName: string | null;
            gender: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            nationality: string | null;
            religion: string | null;
            address: string | null;
            photoUrl: string | null;
            admissionDate: Date | null;
            currentClassId: string | null;
            currentSectionId: string | null;
        };
        items: {
            id: string;
            description: string;
            amount: Prisma.Decimal;
            feeStructureId: string | null;
            invoiceId: string;
        }[];
        payments: {
            id: string;
            amount: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
            notes: string | null;
        }[];
    } & {
        id: string;
        sessionId: string | null;
        termId: string | null;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        totalAmount: Prisma.Decimal;
        amountPaid: Prisma.Decimal;
        balance: Prisma.Decimal;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        dueDate: Date | null;
        studentId: string;
    }>;
    recordPayment(dto: RecordPaymentDto): Promise<{
        payment: {
            id: string;
            amount: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
            notes: string | null;
        };
        invoice: {
            student: {
                id: string;
                admissionNumber: string;
                firstName: string;
                lastName: string;
            };
            items: {
                id: string;
                description: string;
                amount: Prisma.Decimal;
                feeStructureId: string | null;
                invoiceId: string;
            }[];
            payments: {
                id: string;
                amount: Prisma.Decimal;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                invoiceId: string;
                method: import("@prisma/client").$Enums.PaymentMethod;
                paystackRef: string | null;
                paystackAccessCode: string | null;
                receiptNumber: string | null;
                paidAt: Date | null;
                recordedById: string | null;
                notes: string | null;
            }[];
        } & {
            id: string;
            sessionId: string | null;
            termId: string | null;
            createdAt: Date;
            updatedAt: Date;
            invoiceNumber: string;
            totalAmount: Prisma.Decimal;
            amountPaid: Prisma.Decimal;
            balance: Prisma.Decimal;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date | null;
            studentId: string;
        };
    }>;
    getStudentBalances(studentId: string): Promise<{
        studentId: string;
        totalBalance: number;
        invoices: {
            id: string;
            sessionId: string | null;
            termId: string | null;
            createdAt: Date;
            updatedAt: Date;
            invoiceNumber: string;
            totalAmount: Prisma.Decimal;
            amountPaid: Prisma.Decimal;
            balance: Prisma.Decimal;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date | null;
            studentId: string;
        }[];
    }>;
}
