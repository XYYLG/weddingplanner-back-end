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

    describe('getAmounts', () => {
        it('should return an array of amounts', async () => {
            const result = [
                {
                    id: '1',
                    amountPayed: 100,
                    amountDue: 0,
                    amountTotal: 100,
                    description: 'Salary',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '2',
                    amountPayed: 200,
                    amountDue: 0,
                    amountTotal: 200,
                    description: 'Bonus',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            financeService.getAllAmounts.mockResolvedValue(result);
            const amounts = await financeController.getAmounts();
            expect(amounts).toEqual(result);
        });

        it('should return an empty array if no amounts are found', async () => {
            financeService.getAllAmounts.mockResolvedValue([]);
            const amounts = await financeController.getAmounts();
            expect(amounts).toEqual([]);
        });
    });

    describe('getAmountById', () => {
        it('should return an amount by ID', async () => {
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

            financeService.getAmountById.mockResolvedValue(result);
            const amount = await financeController.getAmountById(amountId);
            expect(amount).toEqual(result);
        });

        it('should throw NotFoundException if amount is not found', async () => {
            const amountId = '1';
            financeService.getAmountById.mockResolvedValue(null as any);
            await expect(financeController.getAmountById(amountId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createAmount', () => {
        it('should create and return a new amount', async () => {
            const createAmountDto: CreateEditFinanceDto = {
                amountPayed: 300, amountDue: 0, amountTotal: 300, description: 'Freelance',
                updatedAt: new Date()
            };
            const newAmount = { ...createAmountDto, id: '1', createdAt: new Date() };

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
            const updatedAmount = { id: amountId, ...updateAmountDto, createdAt: new Date() };

            financeService.updateAmount.mockResolvedValue(updatedAmount);
            const result = await financeController.updateAmount(amountId, updateAmountDto);
            expect(result).toEqual(updatedAmount);
        });

        it('should throw NotFoundException if amount to update is not found', async () => {
            const amountId = '1';
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

            financeService.deleteAmount.mockResolvedValue(result);
            const deletedAmount = await financeController.deleteAmount(amountId);
            expect(deletedAmount).toEqual(result);
        });

        it('should throw NotFoundException if amount to delete is not found', async () => {
            const amountId = '1';
            (financeService.deleteAmount as jest.Mock).mockResolvedValue(null);
            await expect(financeController.deleteAmount(amountId)).rejects.toThrow(NotFoundException);
        });
    });
});
