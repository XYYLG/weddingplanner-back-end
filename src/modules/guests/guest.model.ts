import { Module } from "@nestjs/common";
import { GuestController } from "./guest.controller";
import { GuestService } from "./guest.service";
import { PrismaService } from "../../core/database/prisma.service";

@Module({
    controllers: [GuestController],
    providers: [GuestService, PrismaService],
})
export class GuestModule { }