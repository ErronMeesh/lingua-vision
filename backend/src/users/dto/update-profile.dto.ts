import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Новый никнейм (опционально)',
    required: false,
    example: 'Alex99',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Никнейм не должен быть длиннее 30 символов' })
  nickname?: string;

  @ApiProperty({
    description: 'Новый пароль (опционально)',
    required: false,
    example: 'new_qwerty123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Новый пароль должен быть не короче 6 символов' })
  newPassword?: string;
}
