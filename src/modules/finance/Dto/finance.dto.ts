import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
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
        description: 'The amount to be payed of the finance is',
        example: '1000',
        type: Number,
    })
    amountDue: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The amount to be payed ',
        example: '1000',
        type: Number,
    })
    totalAmount: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The description of the amount is',
        example: 'Dress',
        type: String,
    })
    description: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'created at finance',
        example: '2025-14-02',
        type: Date,
    })
    createdAt: Date;

    @Expose()
    @ApiProperty({
        description: 'updated at finance',
        example: '2025-16-02',
        type: Date,
    })
    updatedAt: Date;
}