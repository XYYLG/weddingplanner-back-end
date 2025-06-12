import { Injectable, NotFoundException } from "@nestjs/common";

import { GuestRepository } from "./guest.repository";

import { CreateEditGuestDto } from "./Dto/create-edit-guest.dto";

import { Guest } from "@prisma/client";

import { WebSocketServer } from "ws";

@Injectable()

export class GuestService {

    private wss: WebSocketServer | null = null;

    constructor(private readonly guestRepository: GuestRepository) { }

    public setWebSocketServer(wss: WebSocketServer) {

        this.wss = wss;

    }

    public async getGuests() {

        return await this.guestRepository.findAll();

    }

    public async getGuestById(id: string) {

        const guest = await this.guestRepository.findById(String(id));

        if (!guest) {

            throw new NotFoundException('Guest not found');

        }

        return guest;

    }

    public async createGuest(body: CreateEditGuestDto) {

        const newGuest = await this.guestRepository.create(body);


        if (this.wss) {

            const message = JSON.stringify({ success: true, guest: newGuest });

            this.wss.clients.forEach(client => {

                if (client.readyState === client.OPEN) {

                    client.send(message);

                }

            });

        }

        return newGuest;

    }

    public async updateGuest(id: string, body: CreateEditGuestDto) {

        const guestToUpdate = await this.guestRepository.findById(String(id));

        if (!guestToUpdate) {

            throw new NotFoundException('Guest not found');

        }

        return await this.guestRepository.update(String(id), body);

    }

    public async deleteGuest(id: string) {

        const guestToDelete = await this.guestRepository.findById(String(id));

        if (!guestToDelete) {

            throw new NotFoundException('Guest not found');

        }

        return await this.guestRepository.delete(String(id));

    }

    public async fetchGuests(): Promise<Guest[]> {

        try {
            const response = await fetch('http://localhost:8080/api/guests', { mode: 'cors' });
            if (!response.ok) {
                throw new Error("Fout bij het ophalen van gasten");
            }
            return await response.json();
        } catch (error) {
            console.error("API fout:", error);
            return [];
        }
    }
}

