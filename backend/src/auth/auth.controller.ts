import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'student@yandex.ru',
    description: 'Email пользователя',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email!: string;

  @ApiProperty({ example: 'qwerty12345', description: 'Пароль' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не короче 6 символов' })
  pass!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() body: AuthDto) {
    return this.authService.register(body.email, body.pass);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя' })
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.pass);
  }
}
