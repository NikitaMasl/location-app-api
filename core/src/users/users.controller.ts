import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto, FindOneParamsDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

@ApiTags('Users endpoint')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @ApiOperation({ summary: 'User creation' })
    @ApiResponse({ status: 200, type: User })
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.create(userDto);
    }

    @ApiOperation({ summary: 'Get user by userName' })
    @ApiResponse({ status: 200, type: User })
    @Get(':userName')
    getUserById(@Param() params: FindOneParamsDto): Promise<User> {
        return this.userService.findbyUserName({ userName: params.userName });
    }
}
