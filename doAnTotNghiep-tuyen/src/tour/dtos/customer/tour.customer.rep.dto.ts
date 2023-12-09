import { IsValidNumber } from "src/common/decorators/custom-validator.decorator";
import { PaginationReqDto } from "src/common/dtos/pagination.dto";

export class BookTourCustomerReqDto {
    @IsValidNumber()
    tourId: number;

    @IsValidNumber({min: 1})
    numberOfPeople: number;

}

export class GetListBookTourCustomerReqDto extends PaginationReqDto{}