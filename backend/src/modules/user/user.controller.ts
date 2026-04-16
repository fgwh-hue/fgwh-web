import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import type { UserService } from './user.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { QueryUserDto } from './dto/query-user.dto';

@ApiTags('用户管理')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleCode.SUPER_ADMIN)
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
