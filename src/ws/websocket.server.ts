import { WebSocketServer, WebSocket } from 'ws';
import { INestApplicationContext } from '@nestjs/common';
import { GuestService } from 'src/modules/guests/guest.service';
import { CreateEditGuestDto } from 'src/modules/guests/Dto/create-edit-guest.dto';

export function setupWebSocketServer(app: INestApplicationContext) {
    const wss = new WebSocketServer({ port: 8081 }); // WebSocket draait los van HTTP-server

    const guestService = app.get(GuestService); // Nest injectie

    wss.on('connection', (ws: WebSocket) => {
        console.log(' Nieuwe WebSocket-verbinding');

        ws.on('message', async (data) => {
            try {
                // Parse de binnenkomende data
                const parsed: CreateEditGuestDto = JSON.parse(data.toString());

                const guest = await guestService.createGuest(parsed);

                ws.send(JSON.stringify({ success: true, guest }));
            } catch (err) {
                ws.send(JSON.stringify({ success: false, error: (err as Error).message }));
            }
        });

        ws.on('close', () => {
            console.log('WebSocket-verbinding gesloten');
        });
    });

    console.log(' WebSocket-server gestart op poort 8081');
}