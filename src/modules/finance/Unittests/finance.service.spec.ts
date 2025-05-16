import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService } from '../finance.service';
import { FinanceRepository } from '../finance.repository';
import { CreateEditFinanceDto } from '../Dto/create-edit-finance.dto';
import { NotFoundException } from '@nestjs/common';
import { Finance } from '@prisma/client';

jest.mock('../finance.repository');

describe('FinanceService', () => {
    let financeService: FinanceService;
    let financeRepository: jest.Mocked<FinanceRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FinanceService, FinanceRepository],
        }).compile();

        financeService = module.get<FinanceService>(FinanceService);
        financeRepository = module.get<FinanceRepository>(FinanceRepository) as jest.Mocked<FinanceRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllAmounts', () => {
        it('should return an array of finance records', async () => {
            const result: Finance[] = [
                { id: '1', amountTotal: 1000, amountPayed: 500, amountDue: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', amountTotal: 2000, amountPayed: 1000, amountDue: 1000, description: 'Salary', createdAt: new Date(), updatedAt: new Date() },
            ];

            financeRepository.findAll.mockResolvedValue(result);
            const amounts = await financeService.getAllAmounts();
            expect(amounts).toEqual(result);
        });

        it('should return an empty array if no amounts are found', async () => {
            financeRepository.findAll.mockResolvedValue([]);
            const amounts = await financeService.getAllAmounts();
            expect(amounts).toEqual([]);
        });
    });

    describe('getAmountById', () => {
        it('should return a finance record by ID', async () => {
            const amountId = '1';
            const result: Finance = { id: amountId, amountTotal: 1000, amountPayed: 500, amountDue: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() };

            financeRepository.findById.mockResolvedValue(result);
            const amount = await financeService.getAmountById(amountId);
            expect(amount).toEqual(result);
        });

        it('should throw NotFoundException if amount is not found', async () => {
            const amountId = '1';
            financeRepository.findById.mockResolvedValue(null);
            await expect(financeService.getAmountById(amountId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createAmount', () => {
        it('should create and return a new finance record', async () => {
            const createAmountDto: CreateEditFinanceDto = { amountTotal: 3000, amountPayed: 1500, amountDue: 1500, description: 'Bonus', updatedAt: new Date() };
            const newAmount: Finance = { ...createAmountDto, id: '3', createdAt: new Date() };

            financeRepository.create.mockResolvedValue(newAmount);
            const result = await financeService.createAmount(createAmountDto);
            expect(result).toEqual(newAmount);
        });
    });

    describe('updateAmount', () => {
        it('should update and return the updated finance record', async () => {
            const amountId = '1';
            const updateAmountDto: CreateEditFinanceDto = { amountTotal: 4000, amountPayed: 2000, amountDue: 2000, description: 'Updated Rent', updatedAt: new Date() };
            const existingAmount: Finance = { id: amountId, amountTotal: 1000, amountPayed: 500, amountDue: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() };
            const updatedAmount: Finance = { ...existingAmount, ...updateAmountDto };

            financeRepository.findById.mockResolvedValue(existingAmount);
            financeRepository.update.mockResolvedValue(updatedAmount);
            const result = await financeService.updateAmount(amountId, updateAmountDto);
            expect(result).toEqual(updatedAmount);
        });

        it('should throw NotFoundException if amount to update is not found', async () => {
            const amountId = '1';
            financeRepository.findById.mockResolvedValue(null);
            await expect(financeService.updateAmount(amountId, {} as CreateEditFinanceDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteAmount', () => {
        it('should delete and return the deleted finance record', async () => {
            const amountId = '1';
            const result: Finance = { id: amountId, amountTotal: 1000, amountPayed: 500, amountDue: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() };

            financeRepository.findById.mockResolvedValue(result);
            financeRepository.delete.mockResolvedValue(result);
            const deletedAmount = await financeService.deleteAmount(amountId);
            expect(deletedAmount).toEqual(result);
        });

        it('should throw NotFoundException if amount to delete is not found', async () => {
            const amountId = '1';
            financeRepository.findById.mockResolvedValue(null);
            await expect(financeService.deleteAmount(amountId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('fetchAmounts', () => {
        it('should return data from API when request is successful', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: '1', amountTotal: 1000, description: 'Salary' }]),
                })
            ) as jest.Mock;

            const amounts = await financeService.fetchAmounts();
            expect(amounts).toEqual([{ id: '1', amountTotal: 1000, description: 'Salary' }]);
        });

        it('should return an empty array when API request fails', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            ) as jest.Mock;

            const amounts = await financeService.fetchAmounts();
            expect(amounts).toEqual([]);
        });
    });
});
