import {IsNotEmpty, IsString} from "class-validator";

export class TaskDto {
    @IsNotEmpty()
    @IsString()
    public expression: string;
}
