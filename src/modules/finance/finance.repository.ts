import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { Finance, Guest } from "@prisma/client";

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


    async findById(id: string): Promise<Guest | null> {
        return this.prisma.guest.findUnique({
            where: { id },
        });
    }

    async create(data: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
        return this.prisma.guest.create({
            data,
        });
    }

    async update(id: string, data: Partial<Guest>): Promise<Guest> {
        return this.prisma.guest.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Guest> {
        return this.prisma.guest.delete({
            where: { id },
        });
    }
}
