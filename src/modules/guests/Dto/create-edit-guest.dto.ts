import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches, IsOptional } from "class-validator";

@Exclude()
export class CreateEditGuestDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The firstname of the guest is',
        example: 'Martijn',
        type: String,
    })
    firstName: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The lastname of the guest is',
        example: 'Gortzen',
        type: String,
    })
    lastName: string;

    @Expose()
    @IsNotEmpty()
    @Matches(/^\+?\d{10,15}$/, { message: 'Phone number must be a valid international number' })
    @ApiProperty({
        description: 'The phone number of the guest is',
        example: '+31612345678',
        type: String,
    })
    phoneNumber: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The address of the guest is',
        example: 'Niellerveld 43, 6042TB Roermond',
        type: String,
    })
    address: string;
}
