import { Injectable, NotFoundException } from "@nestjs/common";
import { Guest } from "@prisma/client";
import { FinanceRepository } from "./finance.repository";
import { CreateEditFinanceDto } from "./Dto/finance.dto";

@Injectable()
export class FinanceService {

    constructor(private readonly financeRepository: FinanceRepository) { }

    public async getAllAmounts() {
        return await this.financeRepository.findAll();
    }

    public async getAmountById(id: string) {
        const amount = await this.financeRepository.findById(String(id));

        if (!amount) {
            throw new NotFoundException('Amount not found');
        }

        return amount;
    }

    public async createAmount(body: CreateEditFinanceDto) {
        const newAmount = await this.financeRepository.create(body);
        return newAmount;
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
            const response = await fetch('http://localhost:8080/api/guests', { mode: 'cors' });
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
