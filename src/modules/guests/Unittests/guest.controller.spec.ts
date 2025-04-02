import { Test, TestingModule } from '@nestjs/testing';
import { GuestService } from '../guest.service';
import { GuestController } from '../guest.controller';
import { GuestRepository } from '../guest.repository';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateEditGuestDto } from '../Dto/create-edit-guest.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../guest.repository');
jest.mock('../../../core/database/prisma.service');

describe('GuestController', () => {
    let guestController: GuestController;
    let guestRepository: jest.Mocked<GuestRepository>;
    let prismaService: jest.Mocked<PrismaService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GuestController],
            providers: [
                GuestService,
                GuestRepository,
                PrismaService,
            ],
        }).compile();

        guestController = module.get<GuestController>(GuestController);
        guestRepository = module.get<GuestRepository>(GuestRepository) as jest.Mocked<GuestRepository>;
        prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getGuest', () => {
        it('should return an array of guests', async () => {
            const result = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321', address: '456 Elm St', createdAt: new Date(), updatedAt: new Date() },
                { id: '3', firstName: 'Alice', lastName: 'Johnson', phoneNumber: '1122334455', address: '789 Oak St', createdAt: new Date(), updatedAt: new Date() },
            ];

            guestRepository.findAll.mockResolvedValue(result);
            const guests = await guestController.getGuest();
            expect(guests).toEqual(result);
        });

        it('should return an empty array if no guests are found', async () => {
            guestRepository.findAll.mockResolvedValue([]);
            const guests = await guestController.getGuest();
            expect(guests).toEqual([]);
        });
    });

    describe('getGuestById', () => {
        it('should return a guest by ID', async () => {
            const guestId = '1';
            const result = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };

            guestRepository.findById.mockResolvedValue(result);
            const guest = await guestController.getGuestById(guestId);
            expect(guest).toEqual(result);
        });

        it('should throw NotFoundException if guest is not found', async () => {
            const guestId = '1';
            guestRepository.findById.mockResolvedValue(null);
            await expect(guestController.getGuestById(guestId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createGuest', () => {
        it('should create and return a new guest', async () => {
            const createGuestDto: CreateEditGuestDto = { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St' };

            const newGuest = {
                ...createGuestDto,
                id: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            guestRepository.create.mockResolvedValue(newGuest);
            const result = await guestController.createGuest(createGuestDto);
            expect(result).toEqual(newGuest);
        });
    });

    describe('updateGuest', () => {
        it('should update and return the updated guest', async () => {
            const guestId = '1';
            const updateGuestDto: CreateEditGuestDto = { firstName: 'John2', lastName: 'Doe2', phoneNumber: '1234567890', address: '123 Main St' };
            const existingGuest = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };
            const updatedGuest = {
                ...existingGuest,
                ...updateGuestDto,
                updatedAt: new Date(),
            };

            guestRepository.findById.mockResolvedValue(existingGuest);
            guestRepository.update.mockResolvedValue(updatedGuest);
            const result = await guestController.updateGuest(guestId, updateGuestDto);
            expect(result).toEqual(updatedGuest);
        });

        it('should throw NotFoundException if guest to update is not found', async () => {
            const guestId = '1';
            const updateGuestDto: CreateEditGuestDto = { firstName: 'John2', lastName: 'Doe2', phoneNumber: '1234567890', address: '123 Main St' };
            guestRepository.findById.mockResolvedValue(null);
            await expect(guestController.updateGuest(guestId, updateGuestDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteGuest', () => {
        it('should delete and return the deleted guest', async () => {
            const guestId = '1';
            const result = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };

            guestRepository.findById.mockResolvedValue(result);
            guestRepository.delete.mockResolvedValue(result);
            const deletedGuest = await guestController.deleteGuest(guestId);
            expect(deletedGuest).toEqual(result);
        });

        it('should throw NotFoundException if guest to delete is not found', async () => {
            const guestId = '1';
            guestRepository.findById.mockResolvedValue(null);
            await expect(guestController.deleteGuest(guestId)).rejects.toThrow(NotFoundException);
        });
    });
});
