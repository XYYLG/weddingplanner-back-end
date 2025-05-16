import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";

@Controller('finance')
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get()
    async getAmounts() {
        return this.financeService.getAllAmounts();
    }

    @Get(':id')
    async getAmountById(@Param('id') id: string) {
        const amount = await this.financeService.getAmountById(id);
        if (!amount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return amount;
    }

    @Post()
    async createAmount(@Body() amount: CreateEditFinanceDto) {
        return this.financeService.createAmount(amount);
    }

    @Put(':id')
    async updateAmount(@Param('id') id: string, @Body() amount: CreateEditFinanceDto) {
        const updatedAmount = await this.financeService.updateAmount(id, amount);
        if (!updatedAmount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return updatedAmount;
    }

    @Delete(':id')
    async deleteAmount(@Param('id') id: string) {
        const deletedAmount = await this.financeService.deleteAmount(id);
        if (!deletedAmount) {
            throw new NotFoundException(`Amount with ID ${id} not found`);
        }
        return deletedAmount;
    }
}
