import {IsEmail} from "class-validator";

export class RequestRecoveryDto {
    @IsEmail()
    public email: string;
}
