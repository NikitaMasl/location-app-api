import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/interceptors/notFoundInterceptor';
import { userErrors } from 'src/const/errors/users.errors';
import { CreateUserDto, FindOneParamsDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';

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
    @UseInterceptors(new NotFoundInterceptor(userErrors.userDoesntExists))
    getUserByUserName(@Param() params: FindOneParamsDto): Promise<User> {
        return this.userService.findbyUserName({ userName: params.userName });
    }
}
