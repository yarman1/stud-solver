import {ApiProperty} from "@nestjs/swagger";

export class ResponseStatusCodeDto {
    @ApiProperty()
    statusCode: number

    @ApiProperty()
    message: string;
}