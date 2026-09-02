import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(): Promise<{
        students: {
            total: number;
            active: number;
        };
        staff: {
            total: number;
            active: number;
        };
        admissions: {
            total: number;
            pending: number;
        };
        finance: {
            totalInvoices: number;
            pendingInvoices: number;
            totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        };
        currentSession: ({
            terms: {
                id: string;
                name: string;
                startDate: Date;
                endDate: Date;
                isCurrent: boolean;
                createdAt: Date;
                updatedAt: Date;
                sessionId: string;
            }[];
        } & {
            id: string;
            schoolId: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
        }) | null;
    }>;
    getFinanceSummary(): Promise<{
        paid: {
            count: number;
            amount: number | import("@prisma/client-runtime-utils").Decimal;
        };
        partial: {
            count: number;
            balance: number | import("@prisma/client-runtime-utils").Decimal;
        };
        pending: {
            count: number;
            amount: number | import("@prisma/client-runtime-utils").Decimal;
        };
        overdue: {
            count: number;
            balance: number | import("@prisma/client-runtime-utils").Decimal;
        };
        recentPayments: ({
            invoice: {
                student: {
                    admissionNumber: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                status: import("@prisma/client").$Enums.InvoiceStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sessionId: string | null;
                totalAmount: import("@prisma/client-runtime-utils").Decimal;
                balance: import("@prisma/client-runtime-utils").Decimal;
                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                studentId: string;
                invoiceNumber: string;
                dueDate: Date | null;
                termId: string | null;
            };
        } & {
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
            notes: string | null;
        })[];
    }>;
    getStudentSummary(): Promise<{
        byStatus: {
            status: import("@prisma/client").$Enums.StudentStatus;
            count: number;
        }[];
        byClass: {
            classId: string | null;
            className: string;
            count: number;
        }[];
    }>;
    getAttendanceSummary(termId: string, days?: string): Promise<{
        period: string;
        total: number;
        breakdown: {
            status: import("@prisma/client").$Enums.AttendanceStatus;
            count: number;
            percentage: number;
        }[];
    }>;
    getRecentActivities(): Promise<{
        recentStudents: {
            id: string;
            createdAt: Date;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        }[];
        recentApplications: {
            status: import("@prisma/client").$Enums.ApplicationStatus;
            id: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            applicationNo: string;
        }[];
        recentPayments: ({
            invoice: {
                student: {
                    firstName: string;
                    lastName: string;
                };
                invoiceNumber: string;
            };
        } & {
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            invoiceId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paystackRef: string | null;
            paystackAccessCode: string | null;
            receiptNumber: string | null;
            paidAt: Date | null;
            recordedById: string | null;
            notes: string | null;
        })[];
    }>;
}
