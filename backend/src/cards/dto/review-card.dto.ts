import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class ReviewCardDto {
  @ApiProperty({
    description: 'Оценка качества ответа (от 0 до 5)',
    example: 4,
  })
  @IsInt({ message: 'Оценка должна быть целым числом' })
  @Min(0, { message: 'Минимальная оценка - 0' })
  @Max(5, { message: 'Максимальная оценка - 5' })
  quality!: number;
}
