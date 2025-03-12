import { Injectable, NotFoundException } from "@nestjs/common";
import { GuestRepository } from "./guest.repository";
import { CreateEditGuestDto } from "./Dto/create-edit-guest.dto";
import { Guest } from "@prisma/client";

@Injectable()
export class GuestService {

    constructor(private readonly guestRepository: GuestRepository) { }

    public async getGuests() {
        return await this.guestRepository.findAll();
    }

    public async getGuestById(id: string) {
        const guest = await this.guestRepository.findById(String(id));

        if (!guest) {
            throw new NotFoundException('Guest not found');
        }

        return guest;
    }

    public async createGuest(body: CreateEditGuestDto) {
        const newGuest = await this.guestRepository.create(body);
        return newGuest;
    }

    public async updateGuest(id: string, body: CreateEditGuestDto) {
        const guestToUpdate = await this.guestRepository.findById(String(id));

        if (!guestToUpdate) {
            throw new NotFoundException('Guest not found');
        }

        return await this.guestRepository.update(String(id), body);
    }

    public async deleteGuest(id: string) {
        const guestToDelete = await this.guestRepository.findById(String(id));

        if (!guestToDelete) {
            throw new NotFoundException('Guest not found');
        }

        return await this.guestRepository.delete(String(id));
    }

    public async fetchGuests(): Promise<Guest[]> {
        try {
            const response = await fetch('http://localhost:3000/api/guests', { mode: 'cors' });
            if (!response.ok) {
                throw new Error("Fout bij het ophalen van gasten");
            }
            return await response.json();
        } catch (error) {
            console.error("API fout:", error);
            return [];
        }
    }

}
