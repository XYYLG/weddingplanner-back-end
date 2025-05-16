import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { Finance } from "@prisma/client";

@Injectable()
export class FinanceRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<Finance[]> {
        return this.prisma.finance.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id: string): Promise<Finance | null> {
        return this.prisma.finance.findUnique({
            where: { id },
        });
    }

    async create(data: Omit<Finance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Finance> {
        return this.prisma.finance.create({
            data,
        });
    }

    async update(id: string, data: Partial<Finance>): Promise<Finance> {
        return this.prisma.finance.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Finance> {
        return this.prisma.finance.delete({
            where: { id },
        });
    }
}
