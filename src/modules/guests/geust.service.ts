import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateEditGuestDto } from "./Dto/create-edit-guest.dto";

@Injectable()
export class GuestService {

    constructor(private readonly prisma: PrismaService) { }

    public async getGuests() {
        return await this.prisma.guest.findMany();
    }

    public async getGuestById(id: string) {
        const guest = await this.prisma.guest.findUnique({
            where: { id },
        });

        if (!guest) {
            throw new NotFoundException('Guest not found');
        }

        return guest;
    }

    public async createGuest(body: CreateEditGuestDto) {
        const newGuest = await this.prisma.guest.create({
            data: {

                ...body
            },
        });

        return newGuest;
    }

    public async updateGuest(id: string, body: CreateEditGuestDto) {
        const guestToUpdate = await this.prisma.guest.findUnique({
            where: { id },
        });

        if (!guestToUpdate) {
            throw new NotFoundException('Guest not found');
        }

        return await this.prisma.guest.update({
            where: { id },
            data: {
                ...body
            },
        });
    }

    public async deleteGuest(id: string) {
        const guestToDelete = await this.prisma.guest.findUnique({
            where: { id },
        });

        if (!guestToDelete) {
            throw new NotFoundException('Guest not found');
        }

        return await this.prisma.guest.delete({
            where: { id },
        });
    }
}
