import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Finance } from "@prisma/client";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";
import { FinanceRepository } from "./finance.repository";
import { WebSocketServer, WebSocket } from "ws";

@Injectable()
export class FinanceService {

    private wss: WebSocketServer | null = null;

    constructor(private readonly financeRepository: FinanceRepository) { }

    public setWebSocketServer(wss: WebSocketServer) {
        this.wss = wss;
    }

    public async getAllAmounts() {
        const finances = await this.financeRepository.findAll();

        if (!finances || finances.length === 0) {
            throw new NotFoundException("No finance records found");
        }

        return finances.map(f => {
            const amountDue = f.amountTotal - f.amountPayed;

            if (amountDue < 0) {
                throw new BadRequestException(
                    `Invalid finance record (ID: ${f.id}): amountDue cannot be negative (amountTotal: ${f.amountTotal}, amountPayed: ${f.amountPayed})`
                );
            }

            return {
                ...f,
                amountDue
            };
        });
    }

    public async getAmountById(id: string) {
        const amount = await this.financeRepository.findById(id);

        if (!amount) {
            throw new NotFoundException('Amount not found');
        }

        const amountDue = amount.amountTotal - amount.amountPayed;

        if (amountDue < 0) {
            throw new BadRequestException(
                `Invalid finance record (ID: ${id}): amountDue cannot be negative (amountTotal: ${amount.amountTotal}, amountPayed: ${amount.amountPayed})`
            );
        }

        return {
            ...amount,
            amountDue
        };
    }

    public async createAmount(body: CreateEditFinanceDto) {
        if (body.amountTotal < body.amountPayed) {
            throw new BadRequestException('amountTotal mag niet kleiner zijn dan amountPayed');
        }

        const newAmount = await this.financeRepository.create(body);

        if (this.wss) {
            const amountDue = newAmount.amountTotal - newAmount.amountPayed;
            const message = JSON.stringify({ success: true, finance: { ...newAmount, amountDue } });

            this.wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }

        return newAmount;
    }

    public async updateAmount(id: string, body: CreateEditFinanceDto) {
        const amountToUpdate = await this.financeRepository.findById(id);

        if (!amountToUpdate) {
            throw new NotFoundException('Amount not found');
        }

        if (body.amountTotal < body.amountPayed) {
            throw new BadRequestException('amountTotal mag niet kleiner zijn dan amountPayed');
        }

        const updatedAmount = await this.financeRepository.update(id, body);

        return updatedAmount;
    }

    public async deleteAmount(id: string) {
        const amountToDelete = await this.financeRepository.findById(id);

        if (!amountToDelete) {
            throw new NotFoundException('Amount not found');
        }

        return await this.financeRepository.delete(id);
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

    public async getFinanceTotals() {
        const finances = await this.financeRepository.findAll();

        if (!finances || finances.length === 0) {
            throw new NotFoundException("No finance records found");
        }

        const totalPayed = finances.reduce((sum, f) => sum + f.amountPayed, 0);
        const totalTotal = finances.reduce((sum, f) => sum + f.amountTotal, 0);
        const totalDue = finances.reduce((sum, f) => sum + (f.amountTotal - f.amountPayed), 0);

        return {
            totalPayed,
            totalTotal,
            totalDue,
        };
    }

}
