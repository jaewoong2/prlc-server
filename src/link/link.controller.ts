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
import { SearchDto } from './dto/search.dto';
import { FindAllDto } from './dto/findall-link.dto';
import { QueryDefaultValueParseIntPipe } from './pipes/link.pipe';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    const newLink = await this.linkService.create(createLinkDto.custom_url);
    return { message: 'Link created successfully', data: newLink };
  }

  @Get('/search')
  async findId(@Query() { custom_url: customUrl }: SearchDto) {
    const link = await this.linkService.findByCustomUrl(customUrl);
    return { message: `Find ${customUrl} Successly`, data: link };
  }

  @Get(':userId')
  async findAllUsersLink(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
    const link = await this.linkService.findAllUsersLink({
      page: Number.isNaN(page) ? 1 : page,
      userId: userId,
    });

    return { message: `Find All ${userId} Link Successly`, data: link };
  }

  @Get()
  async findAll(
    @Query(QueryDefaultValueParseIntPipe)
    { take }: FindAllDto,
  ) {
    const link = await this.linkService.findAll(take);
    return { message: `Find All Link take=${take}`, data: link };
  }
}
