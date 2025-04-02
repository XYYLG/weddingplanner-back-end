import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GuestRepository } from '../guest.repository';
import { GuestService } from '../guest.service';

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

        guestService = module.get<GuestService>(GuestService) as jest.Mocked<GuestService>;
        guestRepository = module.get<GuestRepository>(GuestRepository) as jest.Mocked<GuestRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getGuests', () => {
        it('should return an array of guests', async () => {
            // Arrange
            const result = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321', address: '456 Elm St', createdAt: new Date(), updatedAt: new Date() },
                { id: '3', firstName: 'Alice', lastName: 'Johnson', phoneNumber: '1122334455', address: '789 Oak St', createdAt: new Date(), updatedAt: new Date() },
            ];

            guestRepository.findAll.mockResolvedValue(result);

            // Act
            const guests = await guestService.getGuests();

            // Assert
            expect(guests).toEqual(result);
        });

        it('should return an empty array if no guests are found', async () => {
            // Arrange
            guestRepository.findAll.mockResolvedValue([]);

            // Act
            const guests = await guestService.getGuests();

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
            const guest = await guestService.getGuestById(guestId);

            // Assert
            expect(guest).toEqual(result);
        });

        it('should throw NotFoundException if guest is not found', async () => {
            // Arrange
            const guestId = '1';

            guestRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(guestService.getGuestById(guestId)).rejects.toThrow(NotFoundException);
        });
    });
});
