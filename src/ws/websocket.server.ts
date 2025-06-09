import { WebSocketServer, WebSocket } from "ws";
import { INestApplicationContext } from "@nestjs/common";
import { GuestService } from "src/modules/guests/guest.service";
import { FinanceService } from "src/modules/finance/finance.service"; // Voeg je FinanceService toe

let wssGlobal: WebSocketServer;

export function setupWebSocketServer(app: INestApplicationContext) {
    const wss = new WebSocketServer({ port: 8082 });
    wssGlobal = wss; // Opslaan in globale variabele

    const guestService = app.get(GuestService);
    guestService.setWebSocketServer(wss); // Doorgeven aan service

    const financeService = app.get(FinanceService); // Haal de FinanceService op
    financeService.setWebSocketServer(wss); // Doorgeven aan service

    wss.on('connection', (ws: WebSocket) => {
        console.log('WebSocket client verbonden');

        ws.on('message', async (data) => {
            try {
                const parsed = JSON.parse(data.toString());

                // Controleer het type bericht en handel ernaar
                if (parsed.type === "guest") {
                    const guest = await guestService.createGuest(parsed.data);
                    ws.send(JSON.stringify({ success: true, guest }));
                } else if (parsed.type === "amount") {
                    const amount = await financeService.createAmount(parsed.data);
                    ws.send(JSON.stringify({ success: true, amount }));
                } else {
                    ws.send(JSON.stringify({ success: false, error: "Ongeldig berichttype" }));
                }
            } catch (err) {
                ws.send(JSON.stringify({ success: false, error: (err as Error).message }));
            }
        });

        ws.on('close', () => console.log('WebSocket client ontkoppeld'));
    });

    console.log('WebSocket-server actief op poort 8082');
}
