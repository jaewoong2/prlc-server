import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';
import {
  ClientErrorException,
  EntityNotFoundException,
} from 'src/common/exception/service.exception';

@Injectable()
export class LinkService {
  constructor(
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

      return links;
    } catch (error) {
      throw ClientErrorException(error.message);
    }
  }

  async findAllUsersLink({ page, userId }: { page: number; userId: number }) {
    const links = await this.linkRepository.find({
      where: {
        user: { id: userId },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return links;
  }

  async createForUser(createLinkDto: CreateLinkDto) {
    const newlink = this.linkRepository.create({
      ...createLinkDto,
    });

    await this.linkRepository.save(newlink);

    return newlink;
  }

  async create(custom_url: string) {
    const newlink = this.linkRepository.create({
      custom_url: custom_url,
    });

    await this.linkRepository.save(newlink);
    return newlink;
  }
}
