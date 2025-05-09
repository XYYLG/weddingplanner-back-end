import { Injectable, NotFoundException } from "@nestjs/common";
import { Finance, Guest } from "@prisma/client";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";
import { FinanceRepository } from "./finance.repository";

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

    public async updateAmount(id: string, body: CreateEditFinanceDto) {
        const amountToUpdate = await this.financeRepository.findById(String(id));

        if (!amountToUpdate) {
            throw new NotFoundException('Amount not found');
        }

        return await this.financeRepository.update(String(id), body);
    }

    public async deleteAmount(id: string) {
        const amountToDelete = await this.financeRepository.findById(String(id));

        if (!amountToDelete) {
            throw new NotFoundException('Amount not found');
        }

        return await this.financeRepository.delete(String(id));
    }

    public async fetchAmounts(): Promise<Finance[]> {
        try {
            const response = await fetch('http://localhost:8080/api/finance', { mode: 'cors' });
            if (!response.ok) {
                throw new Error("Fout bij het ophalen van bedragen");
            }
            return await response.json();
        } catch (error) {
            console.error("API fout:", error);
            return [];
        }
    }

}
