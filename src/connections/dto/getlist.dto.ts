import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Pagination {
    readonly page: number
    readonly perPage: number
}
class Sort {
    readonly field: string
    readonly order: string
}
class Filter {

}
class Meta {

}
class GetList {
    readonly pagination: Pagination
    readonly sort: Sort
    readonly filter: Filter
    readonly meta: Meta
}

export class GetListDto {
  @IsString()
  @ApiProperty({example: { "pagination": { "page": 1 , "perPage": 10 }, "sort": { "field": "createdAt", "order": "desc" }, "filter": {}, "meta": {} }})
  readonly display: GetList;
}