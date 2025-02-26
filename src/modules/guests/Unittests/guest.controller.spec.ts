import { Test, TestingModule } from '@nestjs/testing';
import { GuestService } from '../guest.service';
import { GuestController } from '../guest.controller';
import { GuestRepository } from '../guest.repository';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateEditGuestDto } from '../Dto/create-edit-guest.dto';

jest.mock('../guest.repository');
jest.mock('../../../core/database/prisma.service');

describe('GuestController', () => {
    let guestController: GuestController;
    let guestService: GuestService;
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

        guestService = module.get<GuestService>(GuestService);
        guestController = module.get<GuestController>(GuestController);
        guestRepository = module.get<GuestRepository>(GuestRepository) as jest.Mocked<GuestRepository>;
        prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
    });

    describe('getGuest', () => {
        it('should return an array of guests', async () => {
            // Arrange
            const result = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321', address: '456 Elm St', postalCode: '67890', city: 'CityB', createdAt: new Date(), updatedAt: new Date() },
                { id: '3', firstName: 'Alice', lastName: 'Johnson', phoneNumber: '1122334455', address: '789 Oak St', postalCode: '11223', city: 'CityC', createdAt: new Date(), updatedAt: new Date() },
            ];

            guestRepository.findAll.mockResolvedValue(result);

            // Act
            const guests = await guestController.getGuest();

            // Assert
            expect(guests).toEqual(result);
        });
    });

    describe('getGuestById', () => {
        it('should return a guest by ID', async () => {
            // Arrange
            const guestId = '1';
            const result = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() };

            guestRepository.findById.mockResolvedValue(result);

            // Act
            const guest = await guestController.getGuestById(guestId);

            // Assert
            expect(guest).toEqual(result);
        });
    });

    describe('createGuest', () => {
        it('should create and return a new guest', async () => {
            // Arrange
            const createGuestDto: CreateEditGuestDto = {
                firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890',
                address: '123 Main St', postalCode: '12345', city: 'Anytown'
            };

            const newGuest = {
                ...createGuestDto,
                id: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            guestRepository.create.mockResolvedValue(newGuest);

            // Act
            const result = await guestController.createGuest(createGuestDto);

            // Assert
            expect(result).toEqual(newGuest);
        });
    });

    describe('updateGuest', () => {
        it('should update and return the updated guest', async () => {
            // Arrange
            const guestId = '1';
            const updateGuestDto: CreateEditGuestDto = { firstName: 'John2', lastName: 'Doe2', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'Anytown' };
            const updatedGuest = {
                id: guestId,
                ...updateGuestDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            guestRepository.update.mockResolvedValue(updatedGuest);

            // Act
            const result = await guestController.updateGuest(guestId, updateGuestDto);

            // Assert
            expect(result).toEqual(updatedGuest);
        });
    });

    describe('deleteGuest', () => {
        it('should delete and return the deleted guest', async () => {
            // Arrange
            const guestId = '1';
            const result = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'Anytown', createdAt: new Date(), updatedAt: new Date() };

            guestRepository.delete.mockResolvedValue(result);

            // Act
            const deletedGuest = await guestController.deleteGuest(guestId);

            // Assert
            expect(deletedGuest).toEqual(result);
        });
    });
});
