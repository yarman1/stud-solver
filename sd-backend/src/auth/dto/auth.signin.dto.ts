import {IsString, Length, IsEmail, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AuthSigninDto {
    @ApiProperty()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsString()
    @Length(10, 20)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.\/\\-]).*$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    public password: string;
}
