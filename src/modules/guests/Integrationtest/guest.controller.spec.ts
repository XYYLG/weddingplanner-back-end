import { Test, TestingModule } from "@nestjs/testing";
import { GuestController } from "../guest.controller";
import { GuestService } from "../guest.service";
import { INestApplication, NotFoundException, BadRequestException } from "@nestjs/common";
import * as request from "supertest";
import { CreateEditGuestDto } from "../Dto/create-edit-guest.dto";

describe("GuestController (Mock)", () => {
    let app: INestApplication;
    let mockGuestService: {
        getGuests: jest.Mock;
        getGuestById: jest.Mock;
        createGuest: jest.Mock;
        updateGuest: jest.Mock;
        deleteGuest: jest.Mock;
    };

    beforeAll(async () => {
        mockGuestService = {
            getGuests: jest.fn().mockResolvedValue([
                { id: "1", firstName: "Jane", lastName: "Doe" },
                { id: "2", firstName: "John", lastName: "Smith" },
            ]),
            getGuestById: jest.fn().mockImplementation((id: string) => {
                const mockGuests = [
                    { id: "1", firstName: "Jane", lastName: "Doe" },
                    { id: "2", firstName: "John", lastName: "Smith" },
                ];
                const guest = mockGuests.find(g => g.id === id);
                if (guest) return Promise.resolve(guest);
                return Promise.reject(new NotFoundException(`Guest with ID ${id} not found`)); // ✅ FIXED
            }),
            createGuest: jest.fn().mockImplementation((body: CreateEditGuestDto) => {
                if (!body.firstName || !body.lastName) {
                    return Promise.reject(new BadRequestException("First name and last name are required")); // ✅ FIXED
                }
                return Promise.resolve({ id: "3", ...body });
            }),
            updateGuest: jest.fn().mockImplementation((id: string, body: CreateEditGuestDto) => {
                if (id !== "1") return Promise.reject(new NotFoundException(`Guest with ID ${id} not found`)); // ✅ FIXED
                return Promise.resolve({ id, ...body });
            }),
            deleteGuest: jest.fn().mockImplementation((id: string) => {
                if (id !== "1") return Promise.reject(new NotFoundException(`Guest with ID ${id} not found`)); // ✅ FIXED
                return Promise.resolve({ success: true });
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [GuestController],
            providers: [{ provide: GuestService, useValue: mockGuestService }],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("Moet alle gasten retourneren via API", async () => {
        const response = await request(app.getHttpServer()).get("/guest");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: "1", firstName: "Jane", lastName: "Doe" },
            { id: "2", firstName: "John", lastName: "Smith" },
        ]);
    });

    it("Moet een gast retourneren bij een geldige ID via API", async () => {
        const response = await request(app.getHttpServer()).get("/guest/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: "1", firstName: "Jane", lastName: "Doe" });
    });

    it("Moet een 404 Not Found retourneren bij een niet-bestaande ID via API", async () => {
        const response = await request(app.getHttpServer()).get("/guest/999");
        expect(response.status).toBe(404);
    });

    it("Moet een nieuwe gast aanmaken via API", async () => {
        const newGuestDto: CreateEditGuestDto = {
            firstName: "Mike",
            lastName: "Johnson",
            phoneNumber: "123456789",
            address: "Example Street 789",
        };

        const response = await request(app.getHttpServer())
            .post("/guest")
            .send(newGuestDto);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: "3", ...newGuestDto });
    });

    it("Moet een 400 Bad Request retourneren bij een gast zonder naam via API", async () => {
        const invalidGuestDto: CreateEditGuestDto = {
            firstName: "",
            lastName: "",
            phoneNumber: "123456789",
            address: "Example Street 789",
        };

        const response = await request(app.getHttpServer())
            .post("/guest")
            .send(invalidGuestDto);

        expect(response.status).toBe(400);
    });

    it("Moet een bestaande gast updaten via API", async () => {
        const updatedGuestDto: CreateEditGuestDto = {
            firstName: "Updated Name",
            lastName: "Updated Last",
            phoneNumber: "987654321",
            address: "New Address 456",
        };

        const response = await request(app.getHttpServer())
            .put("/guest/1")
            .send(updatedGuestDto);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: "1", ...updatedGuestDto });
    });

    it("Moet een 404 Not Found retourneren bij een update van een niet-bestaande gast via API", async () => {
        const updatedGuestDto: CreateEditGuestDto = {
            firstName: "Updated Name",
            lastName: "Updated Last",
            phoneNumber: "987654321",
            address: "New Address 456",
        };

        const response = await request(app.getHttpServer())
            .put("/guest/999")
            .send(updatedGuestDto);

        expect(response.status).toBe(404);
    });

    it("Moet een gast verwijderen via API", async () => {
        const response = await request(app.getHttpServer()).delete("/guest/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it("Moet een 404 Not Found retourneren bij een verwijdering van een niet-bestaande gast via API", async () => {
        const response = await request(app.getHttpServer()).delete("/guest/999");
        expect(response.status).toBe(404);
    });
});
