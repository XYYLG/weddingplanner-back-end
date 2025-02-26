// Configureren van de testdatabase-URL
process.env.DATABASE_URL = 'mysql://username:password@localhost:3306/testdb';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Zorg ervoor dat de Prisma Client correct wordt afgesloten na alle tests
afterAll(async () => {
    await prisma.$disconnect();
});
