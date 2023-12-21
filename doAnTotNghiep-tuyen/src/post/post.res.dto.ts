import { UserResDto } from 'src/auth/dtos/common/res/user.res.dto';
import { BaseResponseDtoParams } from 'src/common/dtos/base.res';
import { FileResDto } from 'src/file/dtos/common/res/file.res.dto';
import { Post } from './post.entity';

export interface PostResDtoParams extends BaseResponseDtoParams {
  data: Post;
}

export class PostResDto {
  id: number;
  content: string;
  description: string;
  title: string;
  image: FileResDto;
  user: UserResDto;
  createdAt: Date;
  static mapProperty(dto: PostResDto, { data }: PostResDtoParams) {
    dto.id = data.id;
    dto.content = data.content;
    dto.description = data.description;
    dto.title = data.title;
    dto.createdAt = data.createdAt;
  }

  static forCustomer(params: PostResDtoParams) {
    const { data, resOpts } = params;

    const result = new PostResDto();
    if (!data) return null;
    this.mapProperty(result, params);
    result.image = FileResDto.forCustomer({ data: data.image });
    result.user = UserResDto.forCustomer({ data: data.user });
    return result;
  }

  static forAdmin(params: PostResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new PostResDto();

    this.mapProperty(result, params);
    result.image = FileResDto.forAdmin({ data: data.image });
    result.user = UserResDto.forCustomer({ data: data.user });
    return result;
  }
}
