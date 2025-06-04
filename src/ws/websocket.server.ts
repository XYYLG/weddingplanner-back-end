import { WebSocketServer, WebSocket } from "ws";
import { INestApplicationContext } from "@nestjs/common";
import { CreateEditGuestDto } from "src/modules/guests/Dto/create-edit-guest.dto";
import { GuestService } from "src/modules/guests/guest.service";


export function setupWebSocketServer(app: INestApplicationContext) {

    const wss = new WebSocketServer({ port: 8082 });

    const guestService = app.get(GuestService);

    // Verwerk inkomende connecties
    wss.on('connection', (ws: WebSocket) => {
        console.log('WebSocket client verbonden');

        ws.on('message', async (data) => {
            try {
                const parsed: CreateEditGuestDto = JSON.parse(data.toString());

                const guest = await guestService.createGuest(parsed);

                ws.send(JSON.stringify({ success: true, guest }));
            } catch (err) {

                ws.send(JSON.stringify({ success: false, error: (err as Error).message }));
            }
        });

        ws.on('close', () => console.log('WebSocket client ontkoppeld'));
    });

    console.log('WebSocket-server actief op poort 8082');
}