import {IsAlphanumeric, IsNotEmpty, IsString, Length} from "class-validator";

export class UsernameDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    @IsString()
    @Length(5, 25)
    public userName: string;
}
