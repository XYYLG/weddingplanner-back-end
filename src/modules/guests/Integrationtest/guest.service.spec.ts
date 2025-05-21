import { Test, TestingModule } from "@nestjs/testing";
import { GuestService } from "../guest.service";
import { GuestRepository } from "../guest.repository";
import { NotFoundException } from "@nestjs/common";
import { CreateEditGuestDto } from "../Dto/create-edit-guest.dto";

describe("GuestService (Mock)", () => {
    let guestService: GuestService;
    let mockGuestRepository: {
        findAll: jest.Mock;
        findById: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };

    beforeEach(async () => {
        mockGuestRepository = {
            findAll: jest.fn().mockResolvedValue([
                { id: "1", firstName: "John", lastName: "Doe" },
                { id: "2", firstName: "Jane", lastName: "Smith" },
            ]),
            findById: jest.fn().mockImplementation((id: string) => {
                const mockGuests = [
                    { id: "1", firstName: "John", lastName: "Doe" },
                    { id: "2", firstName: "Jane", lastName: "Smith" },
                ];
                return Promise.resolve(mockGuests.find(g => g.id === id) || null);
            }),
            create: jest.fn().mockImplementation((body: CreateEditGuestDto) =>
                Promise.resolve({ id: "3", ...body })
            ),
            update: jest.fn().mockImplementation((id: string, body: CreateEditGuestDto) => {
                if (id !== "1") throw new NotFoundException("Guest not found");
                return Promise.resolve({ id, ...body });
            }),
            delete: jest.fn().mockImplementation((id: string) => {
                if (id !== "1") throw new NotFoundException("Guest not found");
                return Promise.resolve({ success: true });
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GuestService,
                { provide: GuestRepository, useValue: mockGuestRepository },
            ],
        }).compile();

        guestService = module.get<GuestService>(GuestService);
    });

    it("Moet alle gasten ophalen", async () => {
        const guests = await guestService.getGuests();
        expect(guests).toEqual([
            { id: "1", firstName: "John", lastName: "Doe" },
            { id: "2", firstName: "Jane", lastName: "Smith" },
        ]);
    });

    it("Moet een gast ophalen bij een geldige ID", async () => {
        const guest = await guestService.getGuestById("1");
        expect(guest).toEqual({ id: "1", firstName: "John", lastName: "Doe" });
    });

    it("Moet een NotFoundException gooien bij een niet-bestaande ID", async () => {
        await expect(guestService.getGuestById("999")).rejects.toThrow(NotFoundException);
    });

    it("Moet een nieuwe gast aanmaken", async () => {
        const newGuest = await guestService.createGuest({
            firstName: "Mike",
            lastName: "Johnson",
            phoneNumber: "123456789",
            address: "Example Street 789",
        });
        expect(newGuest).toEqual({
            id: "3",
            firstName: "Mike",
            lastName: "Johnson",
            phoneNumber: "123456789",
            address: "Example Street 789",
        });
    });

    it("Moet een bestaande gast updaten", async () => {
        const updatedGuest = await guestService.updateGuest("1", {
            firstName: "Updated Name",
            lastName: "Updated Last",
            phoneNumber: "987654321",
            address: "New Address 456",
        });
        expect(updatedGuest).toEqual({
            id: "1",
            firstName: "Updated Name",
            lastName: "Updated Last",
            phoneNumber: "987654321",
            address: "New Address 456",
        });
    });

    it("Moet een NotFoundException gooien bij een update van een niet-bestaande gast", async () => {
        await expect(
            guestService.updateGuest("999", {
                firstName: "Updated Name",
                lastName: "Updated Last",
                phoneNumber: "987654321",
                address: "New Address 456",
            })
        ).rejects.toThrow(NotFoundException);
    });

    it("Moet een gast verwijderen", async () => {
        const result = await guestService.deleteGuest("1");
        expect(result).toEqual({ success: true });
    });

    it("Moet een NotFoundException gooien bij een verwijdering van een niet-bestaande gast", async () => {
        await expect(guestService.deleteGuest("999")).rejects.toThrow(NotFoundException);
    });
});
