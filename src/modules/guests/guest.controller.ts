import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GuestService } from "./geust.service";
import { CreateEditGuestDto } from "./Dto/create-edit-guest.dto";

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) { }


  @Get()
  async getGuest() {
    return this.guestService.getGuests();
  }

  @Get(':id')
  async getGuestById(@Param('id') id: string) {
    return this.guestService.getGuestById(id);
  }

  @Post()
  async createGuest(@Body() guest: CreateEditGuestDto) {
    return this.guestService.createGuest(guest);
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
