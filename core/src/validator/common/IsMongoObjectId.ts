import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    isMongoId,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ObjectId } from 'bson';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'ValidMongoIdCheck', async: true })
@Injectable()
export class ValidMongoIdCheckRule implements ValidatorConstraintInterface {
    constructor() {}

    validate(value: any, args: ValidationArguments) {
        const res = ObjectId.isValid(value);
        return ObjectId.isValid(value);
    }

    defaultMessage(args: ValidationArguments) {
        const { property } = args;

        return `${property} should be valid id`;
    }
}

export function IsMongoObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsMongoIdObject',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: ValidMongoIdCheckRule,
        });
    };
}
