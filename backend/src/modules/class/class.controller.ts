import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import { ClassService } from './class.service';
import type { CreateClassDto } from './dto/create-class.dto';
import type { UpdateClassDto } from './dto/update-class.dto';
import type { QueryClassDto } from './dto/query-class.dto';
import type { ClassListResponse, ClassResponse } from './entities/class-response';

@ApiTags('班级管理')
@Controller('classes')
@ApiBearerAuth()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '创建班级' })
  create(@Body() createClassDto: CreateClassDto): Promise<ClassResponse> {
    return this.classService.create(createClassDto);
  }

  @Get()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '获取班级列表' })
  findAll(@Query() queryClassDto: QueryClassDto): Promise<ClassListResponse> {
    return this.classService.findAll(queryClassDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取班级详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClassResponse> {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '更新班级' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClassDto: UpdateClassDto): Promise<ClassResponse> {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(RoleCode.SUPER_ADMIN)
  @ApiOperation({ summary: '删除班级' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.classService.remove(id);
  }
}
