import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    getProfile(user: any): Promise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
}
