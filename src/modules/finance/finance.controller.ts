import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";

@Controller("finance")
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get()
    async getAmounts() {
        try {
            return await this.financeService.getAllAmounts();
        } catch (error) {
            throw new InternalServerErrorException("Error retrieving amounts");
        }
    }

    @Get(":id")
    async getAmountById(@Param("id") id: string) {
        try {
            const amount = await this.financeService.getAmountById(id);
            if (!amount) {
                throw new NotFoundException(`Amount with ID ${id} not found`);
            }
            return amount;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Error retrieving amount");
        }
    }

    @Post()
    async createAmount(@Body() amount: CreateEditFinanceDto) {
        if (amount.amountPayed == null || amount.amountPayed < 0) {
            throw new BadRequestException("AmountPayed must be greater than or equal to zero");
        }
        if (amount.amountDue == null || amount.amountDue < 0) {
            throw new BadRequestException("AmountDue must be greater than or equal to zero");
        }
        if (amount.amountTotal == null || amount.amountTotal < 0) {
            throw new BadRequestException("AmountTotal must be greater than or equal to zero");
        }
        if (!amount.description || amount.description.trim() === "") {
            throw new BadRequestException("Description is required");
        }
        if (!amount.updatedAt || isNaN(Date.parse(amount.updatedAt.toString()))) {
            throw new BadRequestException("UpdatedAt must be a valid date");
        }

        try {
            return await this.financeService.createAmount(amount);
        } catch (error) {
            throw new InternalServerErrorException("Error creating amount");
        }
    }

    @Put(":id")
    async updateAmount(@Param("id") id: string, @Body() amount: CreateEditFinanceDto) {
        try {
            const existingAmount = await this.financeService.getAmountById(id);
            if (!existingAmount) {
                throw new NotFoundException(`Amount with ID ${id} not found`);
            }
            if (amount.amountPayed == null || amount.amountPayed < 0) {
                throw new BadRequestException("AmountPayed must be greater than or equal to zero");
            }
            if (amount.amountDue == null || amount.amountDue < 0) {
                throw new BadRequestException("AmountDue must be greater than or equal to zero");
            }
            if (amount.amountTotal == null || amount.amountTotal < 0) {
                throw new BadRequestException("AmountTotal must be greater than or equal to zero");
            }
            if (!amount.description || amount.description.trim() === "") {
                throw new BadRequestException("Description is required");
            }
            if (!amount.updatedAt || isNaN(Date.parse(amount.updatedAt.toString()))) {
                throw new BadRequestException("UpdatedAt must be a valid date");
            }

            return await this.financeService.updateAmount(id, amount);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Error updating amount");
        }
    }

    @Delete(":id")
    async deleteAmount(@Param("id") id: string) {
        try {
            const deletedAmount = await this.financeService.deleteAmount(id);
            if (!deletedAmount) {
                throw new NotFoundException(`Amount with ID ${id} not found`);
            }
            return deletedAmount;
        } catch (error) {
            if (error instanceof NotFoundException) { //controleert of een object een instantie is van een bepaalde klasse
                throw error;
            }
            throw new InternalServerErrorException("Error deleting amount");
        }
    }
}
