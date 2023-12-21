import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { PrefixType } from 'src/common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dtos/delete-multiple.dto';
import { CreatePostDto, GetListPostDto, UpdatePostDto } from './post.dto';
import { PostCustomerService } from './post.service';

@Controller(`${PrefixType.CUSTOMER}/post`)
@ApiTags('Post customer')
@AuthenticateCustomer()
export class PostCustomerController {
  constructor(private readonly postCustomerService: PostCustomerService) {}

  @Get()
  async getAllPost(
    @Query() dto: GetListPostDto,
    @CurrentAuthData() user: User,
  ) {
    return this.postCustomerService.getMany(dto, user);
  }

  @Post()
  async createPost(@Body() dto: CreatePostDto, @CurrentAuthData() user: User) {
    return this.postCustomerService.create(dto, user);
  }

  @Put(':id')
  async updatePost(
    @Body() dto: UpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postCustomerService.update(dto, id);
  }

  @Delete()
  async deleteMany(@Body() dto: DeleteMultipleByIdNumberReqDto) {
    return this.postCustomerService.deleteMany(dto);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.postCustomerService.getDetail(id);
  }
}
