import { FinanceService } from './finance.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    createFeeStructure(dto: CreateFeeStructureDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string | null;
        classId: string | null;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        termId: string | null;
    }>;
    getFeeStructures(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string | null;
        classId: string | null;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        termId: string | null;
    }[]>;
    createInvoice(dto: CreateInvoiceDto): Promise<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            admissionNumber: string;
        };
        items: {
            id: string;
            description: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            feeStructureId: string | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        sessionId: string | null;
        studentId: string;
        termId: string | null;
        dueDate: Date | null;
        invoiceNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    getInvoices(studentId?: string): Promise<({
        student: {
            id: string;
            firstName: string;
            lastName: string;
            admissionNumber: string;
        };
        items: {
            id: string;
            description: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            feeStructureId: string | null;
            invoiceId: string;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        sessionId: string | null;
        studentId: string;
        termId: string | null;
        dueDate: Date | null;
        invoiceNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    getInvoice(id: string): Promise<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
            middleName: string | null;
            gender: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            nationality: string | null;
            religion: string | null;
            address: string | null;
            status: import("@prisma/client").$Enums.StudentStatus;
            admissionDate: Date | null;
            currentClassId: string | null;
            currentSectionId: string | null;
            sessionId: string | null;
            admissionNumber: string;
            photoUrl: string | null;
            userId: string | null;
        };
        items: {
            id: string;
            description: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            feeStructureId: string | null;
            invoiceId: string;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        sessionId: string | null;
        studentId: string;
        termId: string | null;
        dueDate: Date | null;
        invoiceNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    recordPayment(dto: RecordPaymentDto): Promise<{
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
        };
        invoice: {
            student: {
                id: string;
                firstName: string;
                lastName: string;
                admissionNumber: string;
            };
            items: {
                id: string;
                description: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                feeStructureId: string | null;
                invoiceId: string;
            }[];
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client-runtime-utils").Decimal;
                invoiceId: string;
                method: import("@prisma/client").$Enums.PaymentMethod;
                notes: string | null;
                paystackRef: string | null;
                paystackAccessCode: string | null;
                receiptNumber: string | null;
                paidAt: Date | null;
                recordedById: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            sessionId: string | null;
            studentId: string;
            termId: string | null;
            dueDate: Date | null;
            invoiceNumber: string;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            balance: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    getStudentBalance(studentId: string): Promise<{
        studentId: string;
        totalBalance: number;
        invoices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            sessionId: string | null;
            studentId: string;
            termId: string | null;
            dueDate: Date | null;
            invoiceNumber: string;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            balance: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    updateFeeStructure(id: string, dto: CreateFeeStructureDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string | null;
        classId: string | null;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        termId: string | null;
    }>;
    deleteFeeStructure(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string | null;
        classId: string | null;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        termId: string | null;
    }>;
    getFeesByTerm(): Promise<{
        termId: string | null;
        termName: string;
        total: number;
        count: number;
    }[]>;
    getFeesByClass(): Promise<{
        classId: string | null;
        className: string;
        total: number;
        count: number;
    }[]>;
    getPaymentsSummary(termId?: string, classId?: string, sessionId?: string): Promise<{
        total: number;
        count: number;
        filters: {
            termId?: string;
            classId?: string;
            sessionId?: string;
        };
    }>;
}
