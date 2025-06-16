import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, BadRequestException } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";

@Controller("finance")
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get()
    async getAmounts() {
        const amounts = await this.financeService.getAllAmounts();

        if (!amounts || amounts.length === 0) {
            throw new NotFoundException("Geen finance records gevonden");
        }
        return amounts;
    }

    @Get(":id")
    async getAmountById(@Param("id") id: string) {
        const amount = await this.financeService.getAmountById(id);
        if (!amount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return amount;
    }

    @Get('totals')
    async getTotals() {
        const totals = await this.financeService.getFinanceTotals();

        if (!totals) {
            throw new NotFoundException('Geen totale bedragen gevonden');
        }

        if (
            totals.totalPayed < 0 ||
            totals.totalTotal < 0 ||
            totals.totalDue < 0
        ) {
            throw new BadRequestException('Totale bedragen mogen niet negatief zijn');
        }

        return totals;
    }


    @Post()
    async createAmount(@Body() amount: CreateEditFinanceDto) {
        if (amount.amountPayed < 0) {
            throw new BadRequestException("AmountPayed must be greater than or equal to zero");
        }
        if (amount.amountTotal < 0) {
            throw new BadRequestException("AmountTotal must be greater than or equal to zero");
        }
        if (amount.amountPayed > amount.amountTotal) {
            throw new BadRequestException("AmountPayed cannot be greater than AmountTotal");
        }
        if (!amount.description || amount.description.trim() === "") {
            throw new BadRequestException("Description is required");
        }

        amount.updatedAt = new Date();

        return this.financeService.createAmount(amount);
    }



    @Put(":id")
    async updateAmount(@Param("id") id: string, @Body() amount: CreateEditFinanceDto) {
        const existingAmount = await this.financeService.getAmountById(id);
        if (!existingAmount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return this.financeService.updateAmount(id, amount);
    }

    @Delete(":id")
    async deleteAmount(@Param("id") id: string) {
        const existingAmount = await this.financeService.getAmountById(id);
        if (!existingAmount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return this.financeService.deleteAmount(id);
    }
}
