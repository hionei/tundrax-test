import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AuthSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  usernameOrEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  @Transform(({ value }: TransformFnParams) => value.trim())
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  noExpire?: boolean;
}
