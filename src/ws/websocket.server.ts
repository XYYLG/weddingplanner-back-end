import { WebSocketServer, WebSocket } from "ws";
import { INestApplicationContext } from "@nestjs/common";
import { CreateEditGuestDto } from "src/modules/guests/Dto/create-edit-guest.dto";
import { GuestService } from "src/modules/guests/guest.service";

let wssGlobal: WebSocketServer;

export function setupWebSocketServer(app: INestApplicationContext) {
    const wss = new WebSocketServer({ port: 8082 });
    wssGlobal = wss; // Opslaan in globale variabele

    const guestService = app.get(GuestService);
    guestService.setWebSocketServer(wss); // Doorgeven aan service

    wss.on("connection", (ws: WebSocket) => {
        console.log("WebSocket client verbonden");

        ws.on("message", async (data) => {
            try {
                const parsed = JSON.parse(data.toString());

                if (parsed.action === "add") {
                    const guest = await guestService.createGuest(parsed.guest);
                    sendToAllClients({ success: true, action: "add", guest });
                }
                else if (parsed.action === "update") {
                    const guest = await guestService.updateGuest(parsed.guestId, parsed.guest);
                    sendToAllClients({ success: true, action: "update", guest });
                }
                else if (parsed.action === "delete") {
                    await guestService.deleteGuest(parsed.guestId);
                    sendToAllClients({ success: true, action: "delete", guestId: parsed.guestId });
                } else {
                    ws.send(JSON.stringify({ success: false, error: "Onbekende actie ontvangen." }));
                }
            } catch (err) {
                ws.send(JSON.stringify({ success: false, error: (err as Error).message }));
            }
        });

        ws.on("close", () => console.log("WebSocket client ontkoppeld"));
    });

    console.log("WebSocket-server actief op poort 8082");
}

function sendToAllClients(message: object) {
    if (wssGlobal) {
        const msgString = JSON.stringify(message);
        wssGlobal.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msgString);
            }
        });
    }
}
