import { Injectable } from '@nestjs/common';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/entities/user.entity';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dtos/delete-multiple.dto';
import { FileRepository } from 'src/file/repositories/file.repository';
import { CreatePostDto, GetListPostDto } from './post.dto';
import { PostRepository } from './post.repo';
import { PostResDto } from './post.res.dto';

@Injectable()
export class PostCustomerService {
  constructor(
    private postRepo: PostRepository,
    private fileRepo: FileRepository,
  ) {}

  async create(dto: CreatePostDto) {
    const { title, content, imageId, description } = dto;
    if (imageId) {
      await this.fileRepo.findOneOrThrowNotFoundExc({ where: { id: imageId } });

      const post = this.postRepo.create({
        title,
        content,
        description,
        imageId,
      });

      const savedPost = await this.postRepo.save(post);
    }

    const post = this.postRepo.create({
      title,
      content,
      description,
    });

    const savedPost = await this.postRepo.save(post);

    return PostResDto.forCustomer({ data: savedPost });
  }

  async update(dto: CreatePostDto, id: number) {
    const { title, content, imageId, description } = dto;

    const post = await this.postRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });

    if (imageId) {
      await this.fileRepo.findOneOrThrowNotFoundExc({ where: { id: imageId } });
      post.imageId = imageId;
    }

    post.title = title;
    post.content = content;
    post.description = description;

    const savedPost = await this.postRepo.save(post);

    return PostResDto.forCustomer({ data: savedPost });
  }

  async deleteMany(dto: DeleteMultipleByIdNumberReqDto) {
    const { ids } = dto;

    await this.postRepo.delete(ids);

    return true;
  }

  async getMany(dto: GetListPostDto, user: User) {
    const { page, limit, content, title, userId } = dto;

    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.customer', 'customer')
      .leftJoinAndSelect('customer.avatar', 'avatar')

      .where('post.userId = :userId', { userId: userId ? userId : user.id });

    if (content) {
      qb.andWhere('post.content ilike :content', { content: `%${content}%` });
    }

    if (title) {
      qb.andWhere('post.title ilike :title', { title: `%${title}%` });
    }

    qb.orderBy('post.createdAt', 'DESC');

    const { items, meta } = await paginate(qb, { limit, page });

    const posts = items.map((item) =>
      PostResDto.forCustomer({
        data: item,
        // image: FileResDto.forCustomer({ data: item.image }),
      }),
    );

    return new Pagination(posts, meta);
  }

  async getDetail(id: number) {
    const post = await this.postRepo.findOneOrThrowNotFoundExc({
      where: { id },
      relations: { image: true, user: { customer: { avatar: true } } },
    });

    return PostResDto.forCustomer({ data: post });
  }
}
