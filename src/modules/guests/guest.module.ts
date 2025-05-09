import { Module } from "@nestjs/common";
import { GuestController } from "./guest.controller";
import { PrismaService } from "../../core/database/prisma.service";
import { GuestService } from "./guest.service";
import { GuestRepository } from "./guest.repository";

@Module({
    controllers: [GuestController],
    providers: [GuestService, GuestRepository, PrismaService],
})
export class GuestModule { }