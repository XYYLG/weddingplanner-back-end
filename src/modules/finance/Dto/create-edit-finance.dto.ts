import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches, IsOptional } from "class-validator";

@Exclude()
export class CreateEditFinanceDto {

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The amount already payed of the finance is',
        example: '1000',
        type: Number,
    })
    amountPayed: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The amount to be payed',
        example: '1000',
        type: Number,
    })
    amountDue: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The total amount to be payed',
        example: '1000',
        type: Number,
    })
    amountTotal: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The description of the finance is',
        example: 'Dress',
        type: String,
    })
    description: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The date when the payment was made',
        type: Date,
    })
    updatedAt: Date;
}