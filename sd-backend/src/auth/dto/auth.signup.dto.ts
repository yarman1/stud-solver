import {IsString, IsNotEmpty, Length, IsEmail, Matches} from "class-validator";

export class AuthSignupDto {
    @IsEmail()
    public email: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.\/\\-]).*$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    @Length(10, 20)
    public password: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    @Matches(/^(?!\W)[^\s]{4,20}$/, {
        message: 'Username cannot start with special characters and must not contain spaces',
    })
    public userName: string;
}
