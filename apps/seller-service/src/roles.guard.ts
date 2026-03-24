import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    // In production, this token would be extracted from the Authorization header via a JwtStrategy.
    // For MVP demonstration, we simulate decoding the payload.
    const userRole = request.headers['x-user-role'];
    const userId = request.headers['x-user-id'];

    if (!userRole || !userId) {
      throw new UnauthorizedException('Authentication token missing or invalid.');
    }

    const hasRole = requiredRoles.some((role) => userRole.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException(`Access denied. Requires one of: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}

// Custom Decorator to utilize the Guard seamlessly
import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export function AuthGuard(...roles: string[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(RolesGuard)
  );
}
