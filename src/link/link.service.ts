import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';
import {
  ClientErrorException,
  EntityNotFoundException,
} from 'src/common/exception/service.exception';
import { UpdateLinkDto } from './dto/update-link.dto';
import { CreateUserLinkDto } from './dto/create-user-link.dto';
import { User } from 'src/auth/entities/user.entity';
import { getMetaTags } from './lib/getMetaTags';
import { randomUUID } from 'crypto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async findByCustomUrl(customUrl: string) {
    const link = await this.linkRepository.findOne({
      where: { custom_url: customUrl },
    });

    if (!link) {
      throw EntityNotFoundException(`${customUrl} Entity is not found`);
    }

    return link;
  }

  async findAll(take: number) {
    try {
      const links = await this.linkRepository.find({
        take: take,
      });

      if (!links) {
        throw EntityNotFoundException(`${take} Entity is not found`);
      }

      return links;
    } catch (error) {
      throw ClientErrorException(error.message);
    }
  }

  async findAllUsersLink({
    page,
    userEmail,
  }: {
    page: number;
    userEmail: string;
  }) {
    const links = await this.linkRepository.find({
      where: {
        user: {
          email: userEmail,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    if (!links) {
      throw EntityNotFoundException(`${userEmail} Entity is not found`);
    }

    return links;
  }

  async createForUser(createLinkDto: CreateUserLinkDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createLinkDto.user,
      },
    });

    const newlink = this.linkRepository.create({
      ...createLinkDto,
      user: user,
    });

    await this.linkRepository.save(newlink);

    if (!newlink) {
      throw EntityNotFoundException(
        `${createLinkDto.user} Entity is not found`,
      );
    }

    return newlink;
  }

  async create({ origin_url, custom_url }: CreateLinkDto) {
    const newlink = this.linkRepository.create({
      custom_url: custom_url,
      origin_url: origin_url,
    });

    await this.linkRepository.save(newlink);

    return newlink;
  }

  async update({ custom_url, description, image, title }: UpdateLinkDto) {
    const newlink = this.linkRepository.create({
      custom_url,
      description,
      image,
      title,
    });

    await this.linkRepository.save(newlink);
    return newlink;
  }

  async getOg(url: string) {
    if (!url) {
      throw new NotFoundException('잘못된 URL 정보 입니다.');
    }

    const metadata = await getMetaTags(url);

    return metadata;
  }

  async getUUID() {
    const uuid = randomUUID().split('-')[0];
    const link = await this.linkRepository.findOne({
      where: { custom_url: uuid },
    });

    if (link) {
      return this.getUUID();
    }

    return uuid;
  }
}
