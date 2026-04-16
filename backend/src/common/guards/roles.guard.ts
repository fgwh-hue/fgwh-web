import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { RoleCode } from '../../modules/role/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleCode[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roleCode) {
      throw new ForbiddenException('无权限访问');
    }

    const hasRole = requiredRoles.includes(user.roleCode);

    if (!hasRole) {
      throw new ForbiddenException('无权限访问此资源');
    }

    return true;
  }
}
