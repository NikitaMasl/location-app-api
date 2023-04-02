import { Body, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/interceptors/notFoundInterceptor';
import { userErrors } from 'src/const/errors/users.errors';
import { ChangeUserLocationDto, CreateUserDto, FindOneParamsDto } from './dto/user.dto';
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

    @ApiOperation({ summary: 'Get all users with their locations' })
    @ApiResponse({ status: 200, type: User })
    @Get()
    getAll() {
        return this.userService.getAll();
    }

    @ApiOperation({ summary: 'Get user by userName' })
    @ApiResponse({ status: 200, type: User })
    @Get(':userName')
    @UseInterceptors(new NotFoundInterceptor(userErrors.userDoesntExists))
    getUserByUserName(@Param() params: FindOneParamsDto): Promise<User> {
        return this.userService.findbyUserName({ userName: params.userName });
    }

    @ApiOperation({ summary: 'User change' })
    @ApiResponse({ status: 200, type: User })
    @Put(':userName')
    changeUser(@Param() params: FindOneParamsDto, @Body() location: ChangeUserLocationDto) {
        return this.userService.changeUserPosition({
            userName: params.userName,
            ...location,
        });
    }
}
