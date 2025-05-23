import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from '../finance.controller';
import { FinanceService } from '../finance.service';
import { CreateEditFinanceDto } from '../Dto/create-edit-finance.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../finance.service');

describe('FinanceController', () => {
    let financeController: FinanceController;
    let financeService: jest.Mocked<FinanceService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FinanceController],
            providers: [FinanceService],
        }).compile();

        financeController = module.get<FinanceController>(FinanceController);
        financeService = module.get<FinanceService>(FinanceService) as jest.Mocked<FinanceService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAmount', () => {
        it('should create and return a new amount', async () => {
            const createAmountDto: CreateEditFinanceDto = {
                amountPayed: 300,
                amountDue: 100, // Geldige waarde toegevoegd om `BadRequestException` te vermijden
                amountTotal: 400,
                description: 'Freelance',
                updatedAt: new Date()
            };
            const newAmount = { ...createAmountDto, id: '1', updatedAt: new Date(), createdAt: new Date() };

            financeService.createAmount.mockResolvedValue(newAmount);
            const result = await financeController.createAmount(createAmountDto);
            expect(result).toEqual(newAmount);
        });
    });

    describe('updateAmount', () => {
        it('should update and return the updated amount', async () => {
            const amountId = '1';
            const updateAmountDto: CreateEditFinanceDto = {
                amountTotal: 400,
                description: 'Updated',
                amountPayed: 200,
                amountDue: 200,
                updatedAt: new Date()
            };
            const updatedAmount = { id: amountId, ...updateAmountDto, updatedAt: new Date(), createdAt: new Date() };

            financeService.getAmountById.mockResolvedValue(updatedAmount); // Zorg dat een bestaande ID correct wordt opgehaald
            financeService.updateAmount.mockResolvedValue(updatedAmount);
            const result = await financeController.updateAmount(amountId, updateAmountDto);
            expect(result).toEqual(updatedAmount);
        });

        it('should throw NotFoundException if amount to update is not found', async () => {
            const amountId = '1';
            financeService.getAmountById.mockResolvedValue(null as any);
            financeService.updateAmount.mockResolvedValue(null as any);
            await expect(financeController.updateAmount(amountId, {} as CreateEditFinanceDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteAmount', () => {
        it('should delete and return the deleted amount', async () => {
            const amountId = '1';
            const result = {
                id: amountId,
                amountPayed: 100,
                amountDue: 0,
                amountTotal: 100,
                description: 'Salary',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            financeService.getAmountById.mockResolvedValue(result); // Zorg dat een bestaande ID correct wordt opgehaald
            financeService.deleteAmount.mockResolvedValue(result);
            const deletedAmount = await financeController.deleteAmount(amountId);
            expect(deletedAmount).toEqual(result);
        });

        it('should throw NotFoundException if amount to delete is not found', async () => {
            const amountId = '1';
            financeService.getAmountById.mockResolvedValue(null as any);
            financeService.deleteAmount.mockResolvedValue(null as any);
            await expect(financeController.deleteAmount(amountId)).rejects.toThrow(NotFoundException);
        });
    });
});
