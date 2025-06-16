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
        it('should return an array of finance records with amountDue', async () => {
            const finances: Finance[] = [
                { id: '1', amountTotal: 1000, amountPayed: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', amountTotal: 2000, amountPayed: 1000, description: 'Salary', createdAt: new Date(), updatedAt: new Date() },
            ];

            financeRepository.findAll.mockResolvedValue(finances);

            const amounts = await financeService.getAllAmounts();

            expect(amounts).toHaveLength(2);
            expect(amounts[0]).toMatchObject({ ...finances[0], amountDue: 500 });
            expect(amounts[1]).toMatchObject({ ...finances[1], amountDue: 1000 });
        });

        it('should throw NotFoundException if no finances found', async () => {
            financeRepository.findAll.mockResolvedValue([]);
            await expect(financeService.getAllAmounts()).rejects.toThrow(NotFoundException);
        });
    });

    describe('getAmountById', () => {
        it('should return a finance record with amountDue', async () => {
            const amountId = '1';
            const finance: Finance = { id: amountId, amountTotal: 1000, amountPayed: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() };

            financeRepository.findById.mockResolvedValue(finance);
            const result = await financeService.getAmountById(amountId);

            expect(result).toMatchObject({ ...finance, amountDue: 500 });
        });

        it('should throw NotFoundException if amount not found', async () => {
            financeRepository.findById.mockResolvedValue(null);
            await expect(financeService.getAmountById('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('createAmount', () => {
        it('should create and return a new finance record', async () => {
            const createAmountDto: CreateEditFinanceDto = { amountTotal: 3000, amountPayed: 1500, description: 'Bonus', updatedAt: new Date() };
            const newAmount: Finance = { ...createAmountDto, id: '3', createdAt: new Date(), updatedAt: createAmountDto.updatedAt };

            financeRepository.create.mockResolvedValue(newAmount);

            const result = await financeService.createAmount(createAmountDto);
            expect(result).toEqual(newAmount);
        });

        it('should throw BadRequestException if amountTotal < amountPayed', async () => {
            const invalidDto: CreateEditFinanceDto = { amountTotal: 1000, amountPayed: 1500, description: 'Invalid', updatedAt: new Date() };
            await expect(financeService.createAmount(invalidDto)).rejects.toThrow();
        });
    });

    describe('updateAmount', () => {
        it('should update and return the updated finance record', async () => {
            const amountId = '1';
            const updateAmountDto: CreateEditFinanceDto = { amountTotal: 4000, amountPayed: 2000, description: 'Updated Rent', updatedAt: new Date() };
            const existingAmount: Finance = { id: amountId, amountTotal: 1000, amountPayed: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() };
            const updatedAmount: Finance = { ...existingAmount, ...updateAmountDto, updatedAt: new Date() };

            financeRepository.findById.mockResolvedValue(existingAmount);
            financeRepository.update.mockResolvedValue(updatedAmount);

            const result = await financeService.updateAmount(amountId, updateAmountDto);
            expect(result).toEqual(updatedAmount);
        });

        it('should throw NotFoundException if amount to update not found', async () => {
            financeRepository.findById.mockResolvedValue(null);
            await expect(financeService.updateAmount('1', { amountTotal: 1000, amountPayed: 500, description: 'desc', updatedAt: new Date() })).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if amountTotal < amountPayed', async () => {
            const amountId = '1';
            const updateAmountDto: CreateEditFinanceDto = { amountTotal: 1000, amountPayed: 1500, description: 'Invalid', updatedAt: new Date() };
            financeRepository.findById.mockResolvedValue({ id: amountId, amountTotal: 2000, amountPayed: 500, description: 'desc', createdAt: new Date(), updatedAt: new Date() });

            await expect(financeService.updateAmount(amountId, updateAmountDto)).rejects.toThrow();
        });
    });

    describe('deleteAmount', () => {
        it('should delete and return the deleted finance record', async () => {
            const amountId = '1';
            const finance: Finance = { id: amountId, amountTotal: 1000, amountPayed: 500, description: 'Rent', createdAt: new Date(), updatedAt: new Date() };

            financeRepository.findById.mockResolvedValue(finance);
            financeRepository.delete.mockResolvedValue(finance);

            const result = await financeService.deleteAmount(amountId);
            expect(result).toEqual(finance);
        });

        it('should throw NotFoundException if amount to delete not found', async () => {
            financeRepository.findById.mockResolvedValue(null);
            await expect(financeService.deleteAmount('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('fetchAmounts', () => {
        it('should return data from API when request is successful', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ id: '1', amountTotal: 1000, description: 'Salary' }]),
                }),
            ) as jest.Mock;

            const amounts = await financeService.fetchAmounts();
            expect(amounts).toEqual([{ id: '1', amountTotal: 1000, description: 'Salary' }]);
        });

        it('should return empty array when API request fails', async () => {
            global.fetch = jest.fn(() => Promise.resolve({ ok: false })) as jest.Mock;

            const amounts = await financeService.fetchAmounts();
            expect(amounts).toEqual([]);
        });
    });
});
