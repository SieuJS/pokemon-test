import { Controller, Get, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns application data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Hello API'
        }
      }
    }
  })
  getData() {
    return this.appService.getData();
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Protected endpoint requiring Bearer token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns protected data when valid token is provided',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Access granted to protected resource'
        },
        user: {
          type: 'object',
          example: { id: 1, name: 'User Name' }
        },
        timestamp: {
          type: 'string',
          example: '2025-07-27T10:30:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  getProtectedData() {
    return {
      message: 'Access granted to protected resource',
      user: { id: 1, name: 'Authenticated User' },
      timestamp: new Date().toISOString()
    };
  }
}
