import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";
import {OutputFormat} from "../../common/types/output-format.type";

export function IsOutputFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsOutputFormat',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
                    const formats = Object.values(OutputFormat);
                    return formats.includes(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments.property} must be a valid format (${Object.values(OutputFormat).join(', ')})`;
                }
            },
        });
    };
}
