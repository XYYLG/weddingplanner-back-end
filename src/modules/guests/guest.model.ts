import { Module } from "@nestjs/common";
import { GuestController } from "./guest.controller";
import { PrismaService } from "../../core/database/prisma.service";
import { GuestService } from "./geust.service";

@Module({
    controllers: [GuestController],
    providers: [GuestService, PrismaService],
})
export class GuestModule { }