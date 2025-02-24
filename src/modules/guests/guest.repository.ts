import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { Guest } from "@prisma/client";

@Injectable()
export class GuestRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<Guest[]> {
        return this.prisma.guest.findMany();
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
