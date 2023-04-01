import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { UsersService } from 'src/modules/users/users.service';

export enum FindBy {
    USER_NAME = 'userName',
    USER_ID = '_id',
}

@ValidatorConstraint({ name: 'UserExistingCheck', async: true })
@Injectable()
export class UserExistingCheckRule implements ValidatorConstraintInterface {
    constructor(private usersService: UsersService) {}

    async validate(value: string, { constraints: [options] }: ValidationArguments) {
        try {
            const { field, shoulExists } = options;

            const user = await this.usersService.getOneByField({ value, field });

            return shoulExists ? Boolean(user) : !Boolean(user);
        } catch (e) {
            return false;
        }
    }

    defaultMessage({ constraints: [options] }: ValidationArguments) {
        const { error } = options;

        return error;
    }
}

export function UserExistingCheck(
    options: { field: FindBy; shoulExists: boolean; error: string },
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UserExistingCheck',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: UserExistingCheckRule,
        });
    };
}
