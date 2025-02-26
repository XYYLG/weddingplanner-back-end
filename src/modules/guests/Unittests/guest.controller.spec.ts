import { Test, TestingModule } from '@nestjs/testing';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { GuestRepository } from './guest.repository';

describe('GuestController', () => {
    let guestController: GuestController;
    let guestService: GuestService;
    let guestRepository: GuestRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GuestController],
            providers: [
                GuestService,
                {
                    provide: GuestRepository,
                    useValue: {
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        guestService = module.get<GuestService>(GuestService);
        guestController = module.get<GuestController>(GuestController);
        guestRepository = module.get<GuestRepository>(GuestRepository);
    });

    describe('getGuest', () => {
        it('should return an array of guests', async () => {
            // Arrange
            const result = [
                { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() },
                { id: '2', firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321', address: '456 Elm St', postalCode: '67890', city: 'CityB', createdAt: new Date(), updatedAt: new Date() },
                { id: '3', firstName: 'Alice', lastName: 'Johnson', phoneNumber: '1122334455', address: '789 Oak St', postalCode: '11223', city: 'CityC', createdAt: new Date(), updatedAt: new Date() },
            ];
            jest.spyOn(guestService, 'getGuests').mockImplementation(() => Promise.resolve(result));
            jest.spyOn(guestRepository, 'findAll').mockImplementation(() => Promise.resolve(result));

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
            const result =
                { id: guestId, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: '123 Main St', postalCode: '12345', city: 'CityA', createdAt: new Date(), updatedAt: new Date() };
            jest.spyOn(guestService, 'getGuestById').mockImplementation((id: string) => Promise.resolve(result));
            jest.spyOn(guestRepository, 'findById').mockImplementation(() => Promise.resolve(result));

            // Act
            const guest = await guestController.getGuestById(guestId);

            // Assert
            expect(guest).toEqual(result);
        });
    });
});
