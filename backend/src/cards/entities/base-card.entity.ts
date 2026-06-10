import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('base_cards')
export class BaseCard {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'URL или путь до сохраненной картинки' })
  @Column()
  imageUrl!: string;

  @ApiProperty({
    description: 'Сырой JSON ответ от YOLOv8 (координаты и переводы)',
  })
  @Column('jsonb')
  detectedObjects!: any;

  @ApiProperty({ description: 'Доступна ли карточка в общей ленте' })
  @Column({ default: false })
  isPublic!: boolean;

  @ApiProperty({ description: 'Связь: кто загрузил эту картинку' })
  @ManyToOne(() => User)
  creator!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
