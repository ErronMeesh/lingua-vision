import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseCard } from './base-card.entity';
import { Progress } from './progress.entity';

@Entity('user_cards')
export class UserCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => BaseCard)
  baseCard!: BaseCard;

  @Column()
  customWord!: string;

  @Column()
  customTranslation!: string;

  @Column({ default: false })
  isPublic!: boolean;

  @Column({ default: false })
  isImported!: boolean;

  @OneToOne(() => Progress, (progress) => progress.userCard, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  progress!: Progress;
}
