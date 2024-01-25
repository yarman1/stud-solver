import {IsBooleanString, IsNotEmpty, IsString} from "class-validator";
import {TaskDto} from "./task.dto";

export class DefiniteIntegralDto extends TaskDto{
    @IsNotEmpty()
    @IsString()
    public lowerLimit: string;

    @IsNotEmpty()
    @IsString()
    public upperLimit: string;

    @IsBooleanString()
    public isDecimal: string;
}