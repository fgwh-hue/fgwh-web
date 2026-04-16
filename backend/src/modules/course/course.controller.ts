import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import { CourseService } from './course.service';
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';
import type { QueryCourseDto } from './dto/query-course.dto';
import type { CourseListResponse, CourseResponse } from './entities/course-response';

@ApiTags('课程管理')
@Controller('courses')
@ApiBearerAuth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '创建课程' })
  create(@Body() createCourseDto: CreateCourseDto): Promise<CourseResponse> {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '获取课程列表' })
  findAll(@Query() queryCourseDto: QueryCourseDto): Promise<CourseListResponse> {
    return this.courseService.findAll(queryCourseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取课程详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CourseResponse> {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '更新课程' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<CourseResponse> {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(RoleCode.SUPER_ADMIN)
  @ApiOperation({ summary: '删除课程' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.courseService.remove(id);
  }
}
