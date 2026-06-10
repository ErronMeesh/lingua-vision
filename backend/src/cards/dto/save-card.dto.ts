import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';

export class SaveCardDto {
  @ApiProperty({ description: 'URL сохраненной картинки' })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({ description: 'Слово на английском' })
  @IsString()
  @IsNotEmpty()
  wordEn!: string;

  @ApiProperty({ description: 'Перевод на русский' })
  @IsString()
  @IsNotEmpty()
  wordRu!: string;

  @ApiProperty({ description: 'Сырые данные от нейросети (координаты)' })
  @IsObject()
  rawData!: Record<string, unknown>;

  @ApiProperty({ description: 'Опубликовать в общую ленту?', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
