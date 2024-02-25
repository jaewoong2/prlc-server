import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { SearchDto } from './dto/search.dto';
import { FindAllDto } from './dto/findall-link.dto';
import { QueryDefaultValueParseIntPipe } from './pipes/link.pipe';
import { CreateUserLinkDto } from './dto/create-user-link.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('uuid') async uuid() {
    return { uuid: await this.linkService.getUUID() };
  }

  @Get('og')
  async getOg(@Query() { url }: { url: string }) {
    return await this.linkService.getOg(url);
  }

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    const newLink = await this.linkService.create(createLinkDto);
    return { message: 'Link created successfully', data: newLink };
  }

  @Post(':email')
  @UseGuards(JwtAuthGuard)
  async createForUser(
    @Body() createLinkDto: CreateUserLinkDto,
    @Param('email') email: string,
  ) {
    const newLink = await this.linkService.createForUser({
      ...createLinkDto,
      user: email,
    });
    return { message: 'Link created successfully', data: newLink };
  }

  @Get('/search')
  async findCustomUrl(@Query() { custom_url: customUrl }: SearchDto) {
    const link = await this.linkService.findByCustomUrl(customUrl);
    return { message: `Find ${customUrl} Successly`, data: link };
  }

  @Get(':userEmail')
  async findAllUsersLink(
    @Param('userEmail') userEmail: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
    const link = await this.linkService.findAllUsersLink({
      page: Number.isNaN(page) ? 1 : page,
      userEmail: userEmail,
    });

    return { message: `Find All ${userEmail} Link Successly`, data: link };
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
