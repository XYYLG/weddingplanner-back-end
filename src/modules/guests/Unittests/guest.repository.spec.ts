import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../core/database/prisma.service';
import { GuestRepository } from '../guest.repository';
import { Guest } from '@prisma/client';

jest.mock('../../../core/database/prisma.service');
jest.mock('../guest.repository');

describe('GuestRepository', () => {
    let guestRepository: jest.Mocked<GuestRepository>;
    let prismaService: jest.Mocked<PrismaService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GuestRepository,
                PrismaService,
            ],
        }).compile();

        guestRepository = module.get<GuestRepository>(GuestRepository) as jest.Mocked<GuestRepository>;
        prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
    });

    describe('findAll', () => {
        it('should return an array of guests', async () => {
            // Arrange
            const result: Guest[] = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321', address: '456 Elm St', postalCode: '67890', city: 'CityB', createdAt: new Date(), updatedAt: new Date() },
                { id: '3', firstName: 'Alice', lastName: 'Johnson', phoneNumber: '1122334455', address: '789 Oak St', postalCode: '11223', city: 'CityC', createdAt: new Date(), updatedAt: new Date() },
            ];

            guestRepository.findAll.mockResolvedValue(result);

            // Act
            const guests = await guestRepository.findAll();

            // Assert
            expect(guests).toEqual(result);
        });
    });

    describe('findById', () => {
        it('should return a guest when found by id', async () => {
            // Arrange
            const mockGuest: Guest = { id: '123', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() };

            guestRepository.findById.mockResolvedValue(mockGuest);

            // Act
            const guest = await guestRepository.findById('123');

            // Assert
            expect(guest).toEqual(mockGuest);
        });

        it('should return null when no guest is found by id', async () => {
            // Act
            guestRepository.findById.mockResolvedValue(null);

            // Assert
            const guest = await guestRepository.findById('123');
            expect(guest).toBeNull();
        });
    });
});
