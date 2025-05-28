import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GuestRepository } from '../guest.repository';
import { GuestService } from '../guest.service';
import { CreateEditGuestDto } from '../Dto/create-edit-guest.dto';

jest.mock('../guest.repository');

describe('GuestService', () => {
    let guestService: GuestService;
    let guestRepository: jest.Mocked<GuestRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GuestService,
                GuestRepository,
            ],
        }).compile();

        guestService = module.get<GuestService>(GuestService);
        guestRepository = module.get<GuestRepository>(GuestRepository) as jest.Mocked<GuestRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getGuests', () => {
        it('should return an array of guests', async () => {
            // Arrange
            const expectedGuests = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() }
            ];
            guestRepository.findAll.mockResolvedValue(expectedGuests);

            // Act
            const result = await guestService.getGuests();

            // Assert
            expect(result).toEqual(expectedGuests);
        });

        it('should return an empty array if no guests are found', async () => {
            // Arrange
            guestRepository.findAll.mockResolvedValue([]);

            // Act
            const result = await guestService.getGuests();

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('getGuestById', () => {
        it('should return a guest by ID', async () => {
            // Arrange
            const guestId = '1';
            const expectedGuest = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() };
            guestRepository.findById.mockResolvedValue(expectedGuest);

            // Act
            const result = await guestService.getGuestById(guestId);

            // Assert
            expect(result).toEqual(expectedGuest);
        });

        it('should throw NotFoundException if guest is not found', async () => {
            // Arrange
            const guestId = '1';
            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestService.getGuestById(guestId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createGuest', () => {
        it('should create a new guest', async () => {
            // Arrange
            const guestData: CreateEditGuestDto = { firstName: 'New', lastName: 'Guest', phoneNumber: '1234567890', address: 'Test Street' };
            const createdGuest = { id: '1', ...guestData, createdAt: new Date(), updatedAt: new Date() };
            guestRepository.create.mockResolvedValue(createdGuest);

            // Act
            const result = await guestService.createGuest(guestData);

            // Assert
            expect(result).toEqual(createdGuest);
        });
    });

    describe('updateGuest', () => {
        it('should update an existing guest', async () => {
            // Arrange
            const guestId = '1';
            const updatedData: CreateEditGuestDto = { firstName: 'Updated', lastName: 'Name', phoneNumber: '5555555555', address: 'Updated Address' };
            const existingGuest = { id: guestId, ...updatedData, createdAt: new Date(), updatedAt: new Date() };
            guestRepository.findById.mockResolvedValue(existingGuest);
            guestRepository.update.mockResolvedValue(existingGuest);

            // Act
            const result = await guestService.updateGuest(guestId, updatedData);

            // Assert
            expect(result).toEqual(existingGuest);
        });

        it('should throw NotFoundException if guest to update is not found', async () => {
            // Arrange
            const guestId = '99';
            const updatedData: CreateEditGuestDto = { firstName: 'Updated', lastName: 'Name', phoneNumber: '5555555555', address: 'Updated Address' };
            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestService.updateGuest(guestId, updatedData)).rejects.toThrow(NotFoundException);
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
            const result = await guestService.deleteGuest(guestId);

            // Assert
            expect(result).toEqual(existingGuest);
        });

        it('should throw NotFoundException if guest to delete is not found', async () => {
            // Arrange
            const guestId = '99';
            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestService.deleteGuest(guestId)).rejects.toThrow(NotFoundException);
        });
    });
});
