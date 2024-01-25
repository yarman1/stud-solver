import { IsString, IsNotEmpty, Length, IsEmail} from "class-validator";

export class AuthSigninDto {
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 20)
    public password: string;
}
