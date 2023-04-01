import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/location.dto';
import { Location } from './schema/location.schema';

@ApiTags('Location endpoint')
@Controller('locations')
export class LocationsController {
    constructor(private locationService: LocationsService) {}

    @ApiOperation({ summary: 'Create location' })
    @ApiResponse({ status: 200, type: Location })
    @Post()
    create(@Body() locationDto: CreateLocationDto) {
        return this.locationService.create(locationDto);
    }

    @ApiOperation({ summary: 'Get all locations with users' })
    @ApiResponse({ status: 200, type: [Location] })
    @Get()
    getAllCoords() {
        return this.locationService.getAllLocations();
    }
}
