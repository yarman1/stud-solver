import {IsString, IsNotEmpty, Length, IsEmail, IsAlphanumeric} from "class-validator";

export class AuthSignupDto {
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 25)
    public password: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    @IsString()
    @Length(5, 25)
    public userName: string;
}
