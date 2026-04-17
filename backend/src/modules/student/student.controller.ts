import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import type { StudentService } from './student.service';
import type { CreateStudentDto } from './dto/create-student.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';
import type { QueryStudentDto } from './dto/query-student.dto';
import type { StudentListResponse, StudentResponse } from './entities/student-response';

@ApiTags('学生管理')
@Controller('students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '创建学生' })
  create(@Body() body: any): Promise<StudentResponse> {
    // 字段映射: 前端字段名 -> 后端字段名
    const createStudentDto: CreateStudentDto = {
      studentNo: body.studentNo,
      name: body.studentName,
      gender: body.studentGender === 1 ? '男' : body.studentGender === 2 ? '女' : undefined,
      phone: body.studentPhone,
      email: body.studentEmail,
      major: body.studentMajor,
      className: body.studentClass,
      enrollYear: body.enrollYear,
      userId: body.userId
    };
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '获取学生列表' })
  findAll(@Query() queryStudentDto: QueryStudentDto): Promise<StudentListResponse> {
    return this.studentService.findAll(queryStudentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取学生详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StudentResponse> {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN, RoleCode.TEACHER)
  @ApiOperation({ summary: '更新学生' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: any): Promise<StudentResponse> {
    // 字段映射: 前端字段名 -> 后端字段名
    const updateStudentDto: UpdateStudentDto = {
      studentNo: body.studentNo,
      name: body.studentName,
      gender: body.studentGender === 1 ? '男' : body.studentGender === 2 ? '女' : undefined,
      phone: body.studentPhone,
      email: body.studentEmail,
      major: body.studentMajor,
      className: body.studentClass,
      enrollYear: body.enrollYear
    };
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '删除学生' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.studentService.remove(id);
  }
}
