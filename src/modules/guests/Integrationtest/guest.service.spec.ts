import { Test, TestingModule } from "@nestjs/testing";
import { GuestService } from "../guest.service";
import { GuestRepository } from "../guest.repository";
import { Guest } from "@prisma/client";

describe("GuestService", () => {
    let guestService: GuestService;
    let guestRepository: GuestRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GuestService,
                {
                    provide: GuestRepository,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([
                            {
                                id: "1",
                                firstName: "John",
                                lastName: "Doe",
                                phoneNumber: "123456789",
                                address: "Example Street 123",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ]),
                    },
                },
            ],
        }).compile();

        guestService = module.get<GuestService>(GuestService);
        guestRepository = module.get<GuestRepository>(GuestRepository);
    });

    it("Moet gastinformatie ophalen", async () => {
        const guests = await guestService.getGuests();
        expect(guests).toEqual([
            {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                phoneNumber: "123456789",
                address: "Example Street 123",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            },
        ]);
    });
});
