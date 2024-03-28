import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RequestRecoveryDto {
    @ApiProperty()
    @IsEmail()
    public email: string;
}
