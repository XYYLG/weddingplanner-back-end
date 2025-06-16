import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches, IsOptional, IsNumber, Min } from "class-validator";

@Exclude()
export class CreateEditFinanceDto {

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @ApiProperty({
        description: 'The amount already paid',
        example: 500,
        minimum: 0,
    })
    amountPayed: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @ApiProperty({
        description: 'The total amount that must be paid',
        example: 1000,
        minimum: 0,
    })
    amountTotal: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Description of the finance item',
        example: 'Wedding dress',
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