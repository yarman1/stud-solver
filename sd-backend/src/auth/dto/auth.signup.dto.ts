import {IsString, IsNotEmpty, Length, IsEmail, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AuthSignupDto {
    @ApiProperty()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.\/\\-]).*$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    @Length(10, 20)
    public password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    @Matches(/^(?!\W)[^\s]{4,20}$/, {
        message: 'Username cannot start with special characters and must not contain spaces',
    })
    public userName: string;
}
