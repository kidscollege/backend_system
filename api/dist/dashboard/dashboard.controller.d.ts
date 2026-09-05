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
            totalPayments: number;
        };
        currentSession: ({
            terms: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sessionId: string;
                startDate: Date;
                endDate: Date;
                isCurrent: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
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
                    firstName: string;
                    lastName: string;
                    admissionNumber: string;
                };
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
        } & {
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
            firstName: string;
            lastName: string;
            createdAt: Date;
            admissionNumber: string;
        }[];
        recentApplications: {
            id: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ApplicationStatus;
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
        })[];
    }>;
}
