import {ApiProperty} from "@nestjs/swagger";

export class AreaResponseDto {
    @ApiProperty()
    area_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    operation_name: string;

    @ApiProperty()
    picture_url: string;

    @ApiProperty()
    description: string;
}