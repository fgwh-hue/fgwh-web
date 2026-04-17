import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { ScoreService } from './score.service';
import type { CreateScoreDto } from './dto/create-score.dto';
import type { UpdateScoreDto } from './dto/update-score.dto';
import type { QueryScoreDto } from './dto/query-score.dto';
import type { ScoreListResponse, ScoreResponse, ScoreStatistics } from './entities/score-response';

@ApiTags('成绩管理')
@Controller('scores')
@ApiBearerAuth()
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '创建成绩' })
  create(@CurrentUser('id') userId: string, @Body() createScoreDto: CreateScoreDto): Promise<ScoreResponse> {
    return this.scoreService.create({ ...createScoreDto, createdBy: userId });
  }

  @Get()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '获取成绩列表' })
  findAll(@Query() queryScoreDto: QueryScoreDto): Promise<ScoreListResponse> {
    return this.scoreService.findAll(queryScoreDto);
  }

  @Get('statistics/:courseId')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '获取课程成绩统计' })
  getStatistics(@Param('courseId', ParseUUIDPipe) courseId: string): Promise<ScoreStatistics> {
    return this.scoreService.getStatistics(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取成绩详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ScoreResponse> {
    return this.scoreService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '更新成绩' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateScoreDto: UpdateScoreDto): Promise<ScoreResponse> {
    return this.scoreService.update(id, updateScoreDto);
  }

  @Delete(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '删除成绩' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.scoreService.remove(id);
  }
}
