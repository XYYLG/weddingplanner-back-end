// src/auth0/auth0.service.ts
import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';

interface Auth0User {
    identities?: Array<{
        access_token?: string;
        [key: string]: any;
    }>;
    [key: string]: any;
}

@Injectable()
export class Auth0Service {
    private management = new ManagementClient({
        domain: process.env.AUTH0_DOMAIN ?? (() => { throw new Error('AUTH0_DOMAIN is not defined'); })(),
        clientId: process.env.AUTH0_CLIENT_ID ?? (() => { throw new Error('AUTH0_CLIENT_ID is not defined'); })(),
        clientSecret: process.env.AUTH0_CLIENT_SECRET ?? (() => { throw new Error('AUTH0_CLIENT_SECRET is not defined'); })(),
    });

    async getUserById(userId: string): Promise<Auth0User> {
        return await this.management.users.get({ id: userId }) as Auth0User;
    }
}
