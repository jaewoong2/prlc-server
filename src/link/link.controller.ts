import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    try {
      const newLink = await this.linkService.create(createLinkDto.custom_url);
      return { message: 'Link created successfully', data: newLink };
    } catch (error) {
      console.error('Error creating a link:', error);
      return { message: error };
    }
  }

  @Get(':userId')
  async findAllUsersLink(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
    try {
      const newLink = await this.linkService.findAllUsersLink({
        page: Number.isNaN(page) ? 1 : page,
        userId: userId,
      });
      return { message: 'Find All Links Successly', data: newLink };
    } catch (error) {
      console.error('Error creating a link:', error);
      return { message: error };
    }
  }

  @Get()
  async findAll(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number = 10,
  ) {
    try {
      const newLink = await this.linkService.findAll(take);
      return { message: 'Find All Links Successly', data: newLink };
    } catch (error) {
      console.error('Error creating a link:', error);
      return { message: error };
    }
  }
}
