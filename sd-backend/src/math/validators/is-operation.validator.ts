import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";
import {Operations} from "../../common/types/operations.type";

export function IsOperation(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsOperation',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
                    const operations = Object.values(Operations);
                    return operations.includes(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments.property} must be a valid format (${Object.values(Operations).join(', ')})`;
                }
            }
        })
    }
}
