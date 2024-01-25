import {IsNotEmpty, IsString, Length} from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    @Length(10, 25)
    public oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 25)
    public newPassword: string;
}
