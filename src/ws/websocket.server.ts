import { WebSocketServer, WebSocket } from "ws";
import { INestApplicationContext } from "@nestjs/common";
import { CreateEditGuestDto } from "src/modules/guests/Dto/create-edit-guest.dto";
import { GuestService } from "src/modules/guests/guest.service";


let wssGlobal: WebSocketServer;

export function setupWebSocketServer(app: INestApplicationContext) {
    const wss = new WebSocketServer({ port: 8082 });
    wssGlobal = wss; //  opslaan in globale variabele

    const guestService = app.get(GuestService);
    guestService.setWebSocketServer(wss); //  doorgeven aan service

    wss.on('connection', (ws: WebSocket) => {
        console.log('WebSocket client verbonden');

        ws.on('message', async (data) => {
            try {
                const parsed: CreateEditGuestDto = JSON.parse(data.toString());
                const guest = await guestService.createGuest(parsed);

                // Alleen naar deze client
                ws.send(JSON.stringify({ success: true, guest }));
            } catch (err) {
                ws.send(JSON.stringify({ success: false, error: (err as Error).message }));
            }
        });

        ws.on('close', () => console.log('WebSocket client ontkoppeld'));
    });

    console.log('WebSocket-server actief op poort 8082');
}