import { Test, TestingModule } from "@nestjs/testing";
import { FinanceController } from "../finance.controller";
import { FinanceService } from "../finance.service";
import { INestApplication, NotFoundException, BadRequestException } from "@nestjs/common";
import * as request from "supertest";
import { CreateEditFinanceDto } from "../Dto/create-edit-finance.dto";

describe("FinanceController (Mock)", () => {
    let app: INestApplication;
    let mockFinanceService: {
        getAllAmounts: jest.Mock;
        getAmountById: jest.Mock;
        createAmount: jest.Mock;
        updateAmount: jest.Mock;
        deleteAmount: jest.Mock;
    };

    beforeAll(async () => {
        mockFinanceService = {
            getAllAmounts: jest.fn().mockResolvedValue([
                {
                    id: "1",
                    amountPayed: 500,
                    amountTotal: 1000,
                    amountDue: 500, // Toegevoegd in response, niet in DTO
                    description: "Venue",
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "2",
                    amountPayed: 200,
                    amountTotal: 1000,
                    amountDue: 800,
                    description: "Catering",
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                },
            ]),
            getAmountById: jest.fn().mockImplementation(async (id: string) => {
                const amounts = await mockFinanceService.getAllAmounts();
                const amount = amounts.find(a => a.id === id);
                if (!amount) throw new NotFoundException(`Amount with ID ${id} not found`);
                return amount;
            }),
            createAmount: jest.fn().mockImplementation((body: CreateEditFinanceDto) => {
                if (body.amountPayed < 0 || body.amountTotal < 0) {
                    return Promise.reject(new BadRequestException("Invalid amount values"));
                }
                if (!body.description?.trim()) {
                    return Promise.reject(new BadRequestException("Description is required"));
                }
                if (!body.updatedAt || isNaN(Date.parse(body.updatedAt.toString()))) {
                    return Promise.reject(new BadRequestException("UpdatedAt must be a valid date"));
                }

                const amountDue = body.amountTotal - body.amountPayed;
                return Promise.resolve({
                    id: "3",
                    ...body,
                    amountDue,
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                });
            }),
            updateAmount: jest.fn().mockImplementation(async (id: string, body: CreateEditFinanceDto) => {
                const existingAmount = await mockFinanceService.getAmountById(id);
                if (!existingAmount) throw new NotFoundException(`Amount with ID ${id} not found`);

                const amountDue = body.amountTotal - body.amountPayed;
                return Promise.resolve({
                    id,
                    ...body,
                    amountDue,
                    updatedAt: new Date().toISOString(),
                    createdAt: existingAmount.createdAt,
                });
            }),
            deleteAmount: jest.fn().mockImplementation(async (id: string) => {
                const existingAmount = await mockFinanceService.getAmountById(id);
                if (!existingAmount) throw new NotFoundException(`Amount with ID ${id} not found`);
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
        const { status, body } = await request(app.getHttpServer()).get("/finance");
        expect(status).toBe(200);
        expect(body).toHaveLength(2);
        expect(body[0]).toHaveProperty("amountDue");
    });

    it("Moet een bedrag retourneren bij een geldige ID via API", async () => {
        const { status, body } = await request(app.getHttpServer()).get("/finance/1");
        expect(status).toBe(200);
        expect(body).toEqual(expect.objectContaining({ description: "Venue", amountDue: 500 }));
    });

    it("Moet een 404 Not Found retourneren bij een niet-bestaande ID via API", async () => {
        const { status, body } = await request(app.getHttpServer()).get("/finance/999");
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Amount with ID 999 not found");
    });

    it("Moet een nieuw bedrag aanmaken via API", async () => {
        const newFinanceDto: CreateEditFinanceDto = {
            amountPayed: 300,
            amountTotal: 1000,
            description: "Florist",
            updatedAt: new Date(),
        };

        const { status, body } = await request(app.getHttpServer()).post("/finance").send(newFinanceDto);

        expect(status).toBe(201);
        expect(body).toEqual(
            expect.objectContaining({
                ...newFinanceDto,
                id: "3",
                amountDue: newFinanceDto.amountTotal - newFinanceDto.amountPayed,
                updatedAt: expect.any(String),
                createdAt: expect.any(String),
            }),
        );
    });

    it("Moet een bestaande bedrag updaten via API", async () => {
        const updatedFinanceDto = {
            amountPayed: 600,
            amountTotal: 1000,
            description: "Updated Venue",
            updatedAt: new Date().toISOString(),
        };

        const { status, body } = await request(app.getHttpServer()).put("/finance/1").send(updatedFinanceDto);

        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ...updatedFinanceDto,
                id: "1",
                amountDue: updatedFinanceDto.amountTotal - updatedFinanceDto.amountPayed,
                updatedAt: expect.any(String),
                createdAt: expect.any(String),
            }),
        );
    });

    it("Moet een bedrag verwijderen via API", async () => {
        const { status, body } = await request(app.getHttpServer()).delete("/finance/1");
        expect(status).toBe(200);
        expect(body).toEqual({ success: true });
    });

    it("Moet een 404 Not Found retourneren bij een verwijdering van een niet-bestaande bedrag via API", async () => {
        const { status, body } = await request(app.getHttpServer()).delete("/finance/999");
        expect(status).toBe(404);
    });
});
