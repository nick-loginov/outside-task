import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value != 'string') {
            return false;
          }
          return (
            value.length >= 8 &&
            value.search(/[a-z]/) != -1 &&
            value.search(/[A-Z]/) != -1 &&
            value.search(/[A-Z]/) != -1 &&
            value.search(/[0-9]/) != -1
          );
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return 'password should be longer than 8 and should have at least one small letter, capital letter and digit';
        },
      },
    });
  };
}
