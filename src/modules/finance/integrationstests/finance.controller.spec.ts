import { Test, TestingModule } from "@nestjs/testing";
import { FinanceController } from "../finance.controller";
import { FinanceService } from "../finance.service";
import { INestApplication, NotFoundException, BadRequestException } from "@nestjs/common";
import * as request from "supertest";
import { CreateEditFinanceDto } from "../Dto/create-edit-finance.dto";

describe("FinanceController (Mock)", () => {
    let app: INestApplication;
    let mockFinanceService: {
        getAmounts: jest.Mock;
        getAmountById: jest.Mock;
        createAmount: jest.Mock;
        updateAmount: jest.Mock;
        deleteAmount: jest.Mock;
    };

    beforeAll(async () => {
        mockFinanceService = {
            getAmounts: jest.fn().mockResolvedValue([
                { id: "1", amountPayed: 500, amountDue: 500, amountTotal: 1000, description: "Venue", updatedAt: new Date() },
                { id: "2", amountPayed: 200, amountDue: 800, amountTotal: 1000, description: "Catering", updatedAt: new Date() },
            ]),
            getAmountById: jest.fn().mockImplementation((id: string) => {
                const mockAmounts = [
                    { id: "1", amountPayed: 500, amountDue: 500, amountTotal: 1000, description: "Venue", updatedAt: new Date() },
                    { id: "2", amountPayed: 200, amountDue: 800, amountTotal: 1000, description: "Catering", updatedAt: new Date() },
                ];
                const amount = mockAmounts.find(a => a.id === id);
                if (amount) return Promise.resolve(amount);
                return Promise.reject(new NotFoundException(`Amount with ID ${id} not found`)); // ✅ FIXED
            }),
            createAmount: jest.fn().mockImplementation((body: CreateEditFinanceDto) => {
                if (!body.amountPayed || body.amountPayed < 0 || !body.amountDue || body.amountDue < 0 || !body.amountTotal || body.amountTotal < 0) {
                    return Promise.reject(new BadRequestException("Invalid amount values"));
                }
                if (!body.description || body.description.trim() === "") {
                    return Promise.reject(new BadRequestException("Description is required"));
                }
                if (!body.updatedAt || isNaN(Date.parse(body.updatedAt.toString()))) {
                    return Promise.reject(new BadRequestException("UpdatedAt must be a valid date"));
                }
                return Promise.resolve({ id: "3", ...body });
            }),
            updateAmount: jest.fn().mockImplementation((id: string, body: CreateEditFinanceDto) => {
                if (id !== "1") return Promise.reject(new NotFoundException(`Amount with ID ${id} not found`));
                return Promise.resolve({ id, ...body });
            }),
            deleteAmount: jest.fn().mockImplementation((id: string) => {
                if (id !== "1") return Promise.reject(new NotFoundException(`Amount with ID ${id} not found`));
                return Promise.resolve({ success: true });
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [FinanceController],
            providers: [{ provide: FinanceService, useValue: mockFinanceService }],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("Moet alle financiele bedragen retourneren via API", async () => {
        const response = await request(app.getHttpServer()).get("/finance");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it("Moet een bedrag retourneren bij een geldige ID via API", async () => {
        const response = await request(app.getHttpServer()).get("/finance/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("description", "Venue");
    });

    it("Moet een 404 Not Found retourneren bij een niet-bestaande ID via API", async () => {
        const response = await request(app.getHttpServer()).get("/finance/999");
        expect(response.status).toBe(404);
    });

    it("Moet een nieuw bedrag aanmaken via API", async () => {
        const newFinanceDto: CreateEditFinanceDto = {
            amountPayed: 300,
            amountDue: 700,
            amountTotal: 1000,
            description: "Florist",
            updatedAt: new Date(),
        };

        const response = await request(app.getHttpServer())
            .post("/finance")
            .send(newFinanceDto);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("description", "Florist");
    });

    it("Moet een 400 Bad Request retourneren bij een foutieve invoer via API", async () => {
        const invalidFinanceDto: CreateEditFinanceDto = {
            amountPayed: -100,
            amountDue: -500,
            amountTotal: -1000,
            description: "",
            updatedAt: new Date(),
        };

        const response = await request(app.getHttpServer())
            .post("/finance")
            .send(invalidFinanceDto);

        expect(response.status).toBe(400);
    });

    it("Moet een bestaande bedrag updaten via API", async () => {
        const updatedFinanceDto: CreateEditFinanceDto = {
            amountPayed: 600,
            amountDue: 400,
            amountTotal: 1000,
            description: "Updated Venue",
            updatedAt: new Date(),
        };

        const response = await request(app.getHttpServer())
            .put("/finance/1")
            .send(updatedFinanceDto);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("description", "Updated Venue");
    });

    it("Moet een gast verwijderen via API", async () => {
        const response = await request(app.getHttpServer()).delete("/finance/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it("Moet een 404 Not Found retourneren bij een verwijdering van een niet-bestaande bedrag via API", async () => {
        const response = await request(app.getHttpServer()).delete("/finance/999");
        expect(response.status).toBe(404);
    });
});
