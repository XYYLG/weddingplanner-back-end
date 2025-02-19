import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateEditPetDto } from "./dto/create-edit-guest.dto";
import { PetService } from "./guest.service";

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) { }


  @Get()
  async getGuest() {
    return this.guestService.getGuest();
  }

  @Get(':id')
  async getPetById(@Param('id') id: string) {
    return this.petService.getPetById(id);
  }

  @Post()
  async createPet(@Body() pet: CreateEditPetDto) {
    return this.petService.createPet(pet);
  }

  @Put(':id')
  async updatePet(@Param('id') id: string, @Body() pet: CreateEditPetDto) {
    return this.petService.updatePet(id, pet);
  }

  @Delete(':id')
  async deletePet(@Param('id') id: string) {
    return this.petService.deletePet(id);
  }
}
