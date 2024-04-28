import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class AuthSignupDto {
  // username
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  username: string;

  // email
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'invalid email' })
  @Transform(({ value }: TransformFnParams) => value.trim())
  email: string;

  // password
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'password must contain at least one uppercase character, a lowercase character, a digit, and a special character.',
  })
  @Transform(({ value }: TransformFnParams) => value.trim())
  password: string;
}
