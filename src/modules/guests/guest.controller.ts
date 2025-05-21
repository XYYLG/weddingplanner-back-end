import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, BadRequestException } from "@nestjs/common";
import { GuestService } from "./guest.service";
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
    const guest = await this.guestService.getGuestById(id);
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }
    return guest;
  }

  @Post()
  async createGuest(@Body() guest: CreateEditGuestDto) {
    if (!guest.firstName || !guest.lastName) {
      throw new BadRequestException("First name and last name are required");
    }
    return this.guestService.createGuest(guest);
  }

  @Put(':id')
  async updateGuest(@Param('id') id: string, @Body() guest: CreateEditGuestDto) {
    const existingGuest = await this.guestService.getGuestById(id);
    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }
    return this.guestService.updateGuest(id, guest);
  }

  @Delete(':id')
  async deleteGuest(@Param('id') id: string) {
    const existingGuest = await this.guestService.getGuestById(id);
    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }
    return this.guestService.deleteGuest(id);
  }
}
