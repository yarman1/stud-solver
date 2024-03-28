import {IsAlphanumeric, IsNotEmpty, IsString, Length, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UsernameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    @Matches(/^(?!\W)[^\s]{4,20}$/, {
        message: 'Username cannot start with special characters and must not contain spaces',
    })
    public userName: string;
}
