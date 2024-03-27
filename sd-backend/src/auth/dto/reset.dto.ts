import {IsString, IsUUID, Length, Matches} from "class-validator";

export class ResetDto {
    @IsUUID()
    token: string;

    @IsString()
    @Length(10, 20)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.\/\\-]).*$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    newPassword: string;
}
