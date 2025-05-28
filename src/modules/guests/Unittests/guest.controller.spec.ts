import { Test, TestingModule } from '@nestjs/testing';
import { GuestService } from '../guest.service';
import { GuestController } from '../guest.controller';
import { GuestRepository } from '../guest.repository';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateEditGuestDto } from '../Dto/create-edit-guest.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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
            // Arrange
            const result = [{ id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() }];
            guestRepository.findAll.mockResolvedValue(result);

            // Act
            const guests = await guestController.getGuest();

            // Assert
            expect(guests).toEqual(result);
        });

        it('should return an empty array if no guests are found', async () => {
            // Arrange
            guestRepository.findAll.mockResolvedValue([]);

            // Act
            const guests = await guestController.getGuest();

            // Assert
            expect(guests).toEqual([]);
        });
    });

    describe('getGuestById', () => {
        it('should return a guest by ID', async () => {
            // Arrange
            const guestId = '1';
            const result = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };
            guestRepository.findById.mockResolvedValue(result);

            // Act
            const guest = await guestController.getGuestById(guestId);

            // Assert
            expect(guest).toEqual(result);
        });

        it('should throw NotFoundException if guest is not found', async () => {
            // Arrange
            const guestId = '1';
            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestController.getGuestById(guestId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createGuest', () => {
        it('should create and return a new guest', async () => {
            // Arrange
            const guestData: CreateEditGuestDto = { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St' };
            const newGuest = { id: '1', ...guestData, createdAt: new Date(), updatedAt: new Date() };
            guestRepository.create.mockResolvedValue(newGuest);

            // Act
            const result = await guestController.createGuest(guestData);

            // Assert
            expect(result).toEqual(newGuest);
        });

        it('should throw BadRequestException when creating guest with missing required fields', async () => {
            // Arrange
            const invalidGuestData: CreateEditGuestDto = { firstName: '', lastName: '', phoneNumber: '1234567890', address: '123 Main St' };

            // Act & Assert
            await expect(guestController.createGuest(invalidGuestData)).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateGuest', () => {
        it('should update an existing guest', async () => {
            // Arrange
            const guestId = '1';
            const updateData: CreateEditGuestDto = { firstName: 'Updated', lastName: 'Name', phoneNumber: '5555555555', address: 'Updated Address' };
            const existingGuest = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };
            const updatedGuest = { ...existingGuest, ...updateData, updatedAt: new Date() };

            guestRepository.findById.mockResolvedValue(existingGuest);
            guestRepository.update.mockResolvedValue(updatedGuest);

            // Act
            const result = await guestController.updateGuest(guestId, updateData);

            // Assert
            expect(result).toEqual(updatedGuest);
        });

        it('should throw NotFoundException if guest to update is not found', async () => {
            // Arrange
            const guestId = '99';
            const updateData: CreateEditGuestDto = { firstName: 'Updated', lastName: 'Name', phoneNumber: '5555555555', address: 'Updated Address' };
            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestController.updateGuest(guestId, updateData)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteGuest', () => {
        it('should delete a guest', async () => {
            // Arrange
            const guestId = '1';
            const existingGuest = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };
            guestRepository.findById.mockResolvedValue(existingGuest);
            guestRepository.delete.mockResolvedValue(existingGuest);

            // Act
            const result = await guestController.deleteGuest(guestId);

            // Assert
            expect(result).toEqual(existingGuest);
        });

        it('should throw NotFoundException if guest to delete is not found', async () => {
            // Arrange
            const guestId = '99';
            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestController.deleteGuest(guestId)).rejects.toThrow(NotFoundException);
        });
    });
});
