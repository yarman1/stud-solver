import {IsBooleanString, IsNotEmpty, IsString} from "class-validator";
import {TaskDto} from "./task.dto";
import {ApiProperty} from "@nestjs/swagger";

export class DefiniteIntegralDto extends TaskDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    public lowerLimit: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    public upperLimit: string;

    @ApiProperty()
    @IsBooleanString()
    public isDecimal: string;
}