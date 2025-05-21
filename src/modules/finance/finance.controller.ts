import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, BadRequestException } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";

@Controller("finance")
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get()
    async getAmounts() {
        return this.financeService.getAllAmounts();
    }

    @Get(":id")
    async getAmountById(@Param("id") id: string) {
        const amount = await this.financeService.getAmountById(id);
        if (!amount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return amount;
    }

    @Post()
    async createAmount(@Body() amount: CreateEditFinanceDto) {
        if (!amount.amountPayed || amount.amountPayed < 0) {
            throw new BadRequestException("AmountPayed must be greater than or equal to zero");
        }
        if (!amount.amountDue || amount.amountDue < 0) {
            throw new BadRequestException("AmountDue must be greater than or equal to zero");
        }
        if (!amount.amountTotal || amount.amountTotal < 0) {
            throw new BadRequestException("AmountTotal must be greater than or equal to zero");
        }
        if (!amount.description || amount.description.trim() === "") {
            throw new BadRequestException("Description is required");
        }
        if (!amount.updatedAt || isNaN(Date.parse(amount.updatedAt.toString()))) {
            throw new BadRequestException("UpdatedAt must be a valid date");
        }
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
