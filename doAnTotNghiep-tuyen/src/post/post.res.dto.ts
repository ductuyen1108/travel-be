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
  static mapProperty(dto: PostResDto, { data }: PostResDtoParams) {
    dto.id = data.id;
    dto.content = data.content;
    dto.description = data.description;
    dto.title = data.title;
  }

  static forCustomer(params: PostResDtoParams) {
    const { data, resOpts } = params;

    const result = new PostResDto();
    if (!data) return null;
    this.mapProperty(result, params);
    return result;
  }

  static forAdmin(params: PostResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new PostResDto();

    this.mapProperty(result, params);
    // result.image = FileResDto.forAdmin({
    //   data: data.image,
    // });
    return result;
  }
}
