import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import type { TeacherService } from './teacher.service';
import type { CreateTeacherDto } from './dto/create-teacher.dto';
import type { UpdateTeacherDto } from './dto/update-teacher.dto';
import type { QueryTeacherDto } from './dto/query-teacher.dto';

@ApiTags('教师管理')
@Controller('teachers')
@ApiBearerAuth()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '创建教师' })
  create(@Body() body: any) {
    // 字段映射: 前端字段名 -> 后端字段名
    const createTeacherDto: CreateTeacherDto = {
      teacherNo: body.teacherNo,
      name: body.teacherName,
      gender: body.teacherGender === 1 ? '男' : body.teacherGender === 2 ? '女' : undefined,
      phone: body.teacherPhone,
      email: body.teacherEmail,
      title: body.teacherTitle,
      department: body.teacherDepartment,
      userId: body.userId
    };
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '获取教师列表' })
  findAll(@Query() queryTeacherDto: QueryTeacherDto) {
    return this.teacherService.findAll(queryTeacherDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取教师详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '更新教师' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    // 字段映射: 前端字段名 -> 后端字段名
    const updateTeacherDto: UpdateTeacherDto = {
      teacherNo: body.teacherNo,
      name: body.teacherName,
      gender: body.teacherGender === 1 ? '男' : body.teacherGender === 2 ? '女' : undefined,
      phone: body.teacherPhone,
      email: body.teacherEmail,
      title: body.teacherTitle,
      department: body.teacherDepartment
    };
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '删除教师' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.remove(id);
  }
}
