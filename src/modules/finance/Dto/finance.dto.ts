import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, Min, IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

@Exclude()
export class FinanceDto {

    @Expose()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'AmountPayed moet een getal zijn met maximaal 2 decimalen.' })
    @Min(0, { message: 'AmountPayed mag niet negatief zijn.' })
    @ApiProperty({
        description: 'Betaald bedrag, minimaal 0',
        example: 1000,
        type: Number,
    })
    amountPayed: number;

    @Expose()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'AmountDue moet een getal zijn met maximaal 2 decimalen.' })
    @Min(0, { message: 'AmountDue mag niet negatief zijn.' })
    @ApiProperty({
        description: 'Nog te betalen bedrag, minimaal 0',
        example: 1000,
        type: Number,
    })
    amountDue: number;

    @Expose()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'AmountTotal moet een getal zijn met maximaal 2 decimalen.' })
    @Min(0, { message: 'AmountTotal mag niet negatief zijn.' })
    @ApiProperty({
        description: 'Totaal bedrag, minimaal 0',
        example: 2000,
        type: Number,
    })
    amountTotal: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Beschrijving van het bedrag',
        example: 'Bruidsjurk',
        type: String,
    })
    description: string;

    @Expose()
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Datum van aanmaak',
        example: '2025-06-16T00:00:00.000Z',
        type: Date,
    })
    createdAt: Date;

    @Expose()
    @IsDate()
    @IsOptional()
    @ApiProperty({
        description: 'Datum van laatste update',
        example: '2025-06-16T12:00:00.000Z',
        type: Date,
        required: false,
    })
    updatedAt?: Date;
}
