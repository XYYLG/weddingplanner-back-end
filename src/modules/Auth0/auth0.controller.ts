import { Controller, Get, Param } from '@nestjs/common';
import { Auth0Service } from './auth0.service';

@Controller('auth0')
export class Auth0Controller {
    constructor(private readonly auth0Service: Auth0Service) { }

    @Get('idp-token/:userId')
    async getIdpToken(@Param('userId') userId: string) {
        console.log(`GET /auth0/idp-token/${userId} aangeroepen`);

        const response = await this.auth0Service.getUserById(userId);
        const user = response.data;  // <== fix hier

        console.log('Auth0 user:', user);

        const token = user?.identities?.[0]?.access_token;
        if (!token) {
            console.log('Geen IdP access token gevonden');
            return { error: 'No IdP access token found' };
        }
        console.log('IdP access token:', token);
        return { accessToken: token };
    }

}