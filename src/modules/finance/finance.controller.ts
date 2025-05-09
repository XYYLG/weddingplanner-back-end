import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { CreateEditFinanceDto } from "./Dto/create-edit-finance.dto";


@Controller('guest')
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }


    @Get()
    async getAmounts() {
        return this.financeService.getAllAmounts();
    }

    @Get(':id')
    async getGuestById(@Param('id') id: string) {
        return this.financeService.getAmountById(id);
    }

    @Post()
    async createAmount(@Body() amount: CreateEditFinanceDto) {
        return this.financeService.createAmount(amount);
    }

    @Put(':id')
    async updateGuest(@Param('id') id: string, @Body() guest: CreateEditGuestDto) {
        return this.guestService.updateGuest(id, guest);
    }

    @Delete(':id')
    async deleteGuest(@Param('id') id: string) {
        return this.guestService.deleteGuest(id);
    }
}
