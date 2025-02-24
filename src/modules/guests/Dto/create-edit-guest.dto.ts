import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

@Exclude()
export class CreateEditGuestDto {
    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The firstname of the guest is',
        example: 'Martijn',
        type: String,
    })
    firstName: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The lastname of the guest is',
        example: 'Gortzen',
        type: String,
    })
    lastName: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The phone number of the guest is',
        example: '+316123456',
        type: String,
    })
    phoneNumber: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The address of the guest is',
        example: 'Niellerveld 43, 6042TB Roermond',
        type: String,
    })
    address: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The postalcode of the guest is',
        example: '6042TB',
        type: String,
    })
    postalCode: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The city of the guest is',
        example: 'Roermond',
        type: String,
    })
    city: string;
}