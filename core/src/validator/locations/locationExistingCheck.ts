import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { LocationsService } from 'src/modules/locations/locations.service';

export enum FindBy {
    LOCATION_ID = '_id',
}

@ValidatorConstraint({ name: 'LocationExistingCheck', async: true })
@Injectable()
export class LocationExistingCheckRule implements ValidatorConstraintInterface {
    constructor(private locationsService: LocationsService) {}

    async validate(value: string, { constraints: [options] }: ValidationArguments) {
        try {
            const { field, shoulExists } = options;

            const location = await this.locationsService.getOneByField({ value, field });

            return shoulExists ? Boolean(location) : !Boolean(location);
        } catch (e) {
            return false;
        }
    }

    defaultMessage({ constraints: [options] }: ValidationArguments) {
        const { error } = options;

        return error;
    }
}

export function LocationExistingCheck(
    options: { field: FindBy; shoulExists: boolean; error: string },
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'LocationExistingCheck',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: LocationExistingCheckRule,
        });
    };
}
