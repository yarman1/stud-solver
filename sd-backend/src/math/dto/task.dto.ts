import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class TaskDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    public expression: string;
}
