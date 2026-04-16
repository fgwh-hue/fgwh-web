import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnnouncementService } from './announcement.service';
import type { CreateAnnouncementDto } from './dto/create-announcement.dto';
import type { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import type { QueryAnnouncementDto } from './dto/query-announcement.dto';
import type { AnnouncementListResponse, AnnouncementResponse } from './entities/announcement-response';

@ApiTags('公告管理')
@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '创建公告' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createAnnouncementDto: CreateAnnouncementDto
  ): Promise<AnnouncementResponse> {
    return this.announcementService.create(createAnnouncementDto, userId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取公告列表' })
  findAll(@Query() queryAnnouncementDto: QueryAnnouncementDto): Promise<AnnouncementListResponse> {
    return this.announcementService.findAll(queryAnnouncementDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取公告详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AnnouncementResponse> {
    return this.announcementService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '更新公告' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ): Promise<AnnouncementResponse> {
    return this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RoleCode.SUPER_ADMIN)
  @ApiOperation({ summary: '删除公告' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.announcementService.remove(id);
  }
}
