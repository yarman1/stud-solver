import {IsString, Length, Matches} from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @Length(10, 20)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.\/\\-]).*$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    public oldPassword: string;

    @IsString()
    @Length(10, 20)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.\/\\-]).*$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    public newPassword: string;
}
