import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async findByCustomUrl(custom_url: string) {
    if (!custom_url) {
      throw EntityNotFoundException(custom_url + ' is not found');
    }

    const link = await this.linkRepository.findOne({
      where: { custom_url },
    });

    return link;
  }

  async findAll(take: number) {
    try {
      const links = await this.linkRepository.find({
        take: take,
      });

      return links;
    } catch (err) {
      console.error('Error: Find link:', err);

      throw new HttpException(
        {
          message: 'Error: Find link',
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllUsersLink({ page, userId }: { page: number; userId: number }) {
    try {
      const links = await this.linkRepository.find({
        where: {
          user: { id: userId },
        },
        take: 10,
        skip: (page - 1) * 10,
      });

      return links;
    } catch (err) {
      console.error('Error: Find All Yours link:', err);

      throw new HttpException(
        {
          message: 'Error: Find All Yours link',
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createForUser(createLinkDto: CreateLinkDto) {
    try {
      const newlink = this.linkRepository.create({
        ...createLinkDto,
      });

      await this.linkRepository.save(newlink);

      return newlink;
    } catch (err) {
      console.error('Error creating a link:', err);

      throw new HttpException(
        {
          message: 'An error occurred while creating the link',
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(custom_url: string) {
    try {
      const newlink = this.linkRepository.create({
        custom_url: custom_url,
      });

      await this.linkRepository.save(newlink);

      return newlink;
    } catch (err) {
      console.error('Error creating a link:', err);

      throw new HttpException(
        {
          message: 'An error occurred while creating the link',
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
