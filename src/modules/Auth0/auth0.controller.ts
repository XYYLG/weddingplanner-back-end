import { Controller, Get, Param } from '@nestjs/common';
import { Auth0Service } from './auth0.service';

@Controller('auth0')
export class Auth0Controller {
    constructor(private readonly auth0Service: Auth0Service) { }

    @Get('idp-token/:userId')
    async getIdpToken(@Param('userId') userId: string) {
        const user = await this.auth0Service.getUserById(userId);

        const token = user?.identities?.[0]?.access_token;
        if (!token) {
            return { error: 'No IdP access token found' };
        }

        return { accessToken: token };
    }
}