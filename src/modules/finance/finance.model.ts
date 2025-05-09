import { Module } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";
import { FinanceRepository } from "./finance.repository";

@Module({
    controllers: [FinanceController],
    providers: [FinanceService, FinanceRepository, PrismaService],
})
export class FinanceModel { }