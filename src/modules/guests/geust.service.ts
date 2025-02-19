import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateEditPetDto } from "./dto/create-edit-pet.dto";

@Injectable()
export class GuestService {

    constructor(private readonly prisma: PrismaService) { }

    public async getGuests() {
        return await this.prisma.guests.findMany();
    }

    public async getPetById(id: string) {
        const pet = await this.prisma.pet.findUnique({
            where: { id },
        });

        if (!pet) {
            throw new NotFoundException('Pet not found'); // This returns a 404 error
        }

        return pet;
    }

    public async createPet(body: CreateEditPetDto) {
        if (body.userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: body.userId },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }
        }

        const newPet = await this.prisma.pet.create({
            data: {
                // This is a spreat operator that spreads the body object into the create object
                ...body
            },
        });

        return newPet;
    }

    public async updatePet(id: string, body: CreateEditPetDto) {
        const petToUpdate = await this.prisma.pet.findUnique({
            where: { id },
        });

        if (!petToUpdate) {
            throw new NotFoundException('Pet not found');
        }

        return await this.prisma.pet.update({
            where: { id },
            data: {
                ...body
            },
        });
    }

    public async deletePet(id: string) {
        const petToDelete = await this.prisma.pet.findUnique({
            where: { id },
        });

        if (!petToDelete) {
            throw new NotFoundException('Pet not found');
        }

        return await this.prisma.pet.delete({
            where: { id },
        });
    }
}
