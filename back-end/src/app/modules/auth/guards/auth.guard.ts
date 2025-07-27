import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    // TODO: Implement proper JWT token validation
    const token = authHeader.substring(7);
    
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    // For now, just check if token exists
    // TODO: Validate JWT token properly
    return true;
  }
}
