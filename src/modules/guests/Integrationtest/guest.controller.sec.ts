import { Test, TestingModule } from "@nestjs/testing";
import { GuestController } from "../guest.controller";
import { GuestService } from "../guest.service";
import * as request from "supertest";

describe("GuestController", () => {
    let app;
    let guestService = {
        getGuests: jest.fn().mockResolvedValue([
            {
                id: "1",
                firstName: "Jane",
                lastName: "Doe",
                phoneNumber: "987654321",
                address: "Test Avenue 456",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GuestController],
            providers: [{ provide: GuestService, useValue: guestService }],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it("Moet een volledige gastinformatie retourneren via API", async () => {
        const response = await request(app.getHttpServer()).get("/guest");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                id: "1",
                firstName: "Jane",
                lastName: "Doe",
                phoneNumber: "987654321",
                address: "Test Avenue 456",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        ]);
    });
});
