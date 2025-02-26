import { Test, TestingModule } from '@nestjs/testing';
import { GuestService } from '../guest.service';
import { GuestController } from '../guest.controller';
import { GuestRepository } from '../guest.repository';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateEditGuestDto } from '../Dto/create-edit-guest.dto';
import { PrismaClient } from '@prisma/client';

describe('GuestController', () => {
    let guestController: GuestController;
    let guestService: GuestService;
    let guestRepository: GuestRepository;
    let prisma: PrismaClient;

    beforeEach(async () => {
        prisma = new PrismaClient();

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
        guestRepository = module.get<GuestRepository>(GuestRepository);

        // Clear the test database
        await prisma.guest.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('getGuest', () => {
        it('should return an array of guests', async () => {
            // Arrange
            const result = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321', address: '456 Elm St', postalCode: '67890', city: 'CityB', createdAt: new Date(), updatedAt: new Date() },
                { id: '3', firstName: 'Alice', lastName: 'Johnson', phoneNumber: '1122334455', address: '789 Oak St', postalCode: '11223', city: 'CityC', createdAt: new Date(), updatedAt: new Date() },
            ];

            await prisma.guest.createMany({ data: result });

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
            await prisma.guest.create({ data: result });

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

            // Act
            const newGuest = await guestController.createGuest(createGuestDto);

            // Assert
            expect(newGuest).toMatchObject({ firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'Anytown' });
            expect(newGuest).toHaveProperty('id'); // Check if 'id' property exists
            expect(newGuest).toHaveProperty('createdAt');
            expect(newGuest).toHaveProperty('updatedAt');
        });
    });


    describe('updateGuest', () => {
        it('should update and return the updated guest', async () => {
            // Arrange
            const guestId = '1';
            const updateGuestDto: CreateEditGuestDto = { firstName: 'John2', lastName: 'Doe2', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'Anytown' };
            const initialData = {
                id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'Anytown', createdAt: new Date(), updatedAt: new Date(),
            };
            await prisma.guest.create({ data: initialData });

            // Act
            const updatedGuest = await guestController.updateGuest(guestId, updateGuestDto);

            // Assert
            expect(updatedGuest).toMatchObject({
                id: guestId,
                ...updateGuestDto,
                createdAt: initialData.createdAt, // Ensure createdAt is the same
            });
            expect(updatedGuest).toHaveProperty('updatedAt'); // Check if updatedAt property exists
        });
    });


    describe('deleteGuest', () => {
        it('should delete and return the deleted guest', async () => {
            // Arrange
            const guestId = '1';
            const result = { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'Anytown', createdAt: new Date(), updatedAt: new Date(), };
            await prisma.guest.create({ data: result });

            // Act
            const deletedGuest = await guestController.deleteGuest(guestId);

            // Assert
            expect(deletedGuest).toEqual(result);
        });
    });
});
