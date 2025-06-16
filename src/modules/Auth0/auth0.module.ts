import { Module } from '@nestjs/common';
import { Auth0Service } from './auth0.service';
import { Auth0Controller } from './auth0.controller';


@Module({
    providers: [Auth0Service],
    controllers: [Auth0Controller],
    exports: [Auth0Service],
})
export class Auth0Module { }
