import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserCard } from './user-card.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => UserCard)
  @JoinColumn()
  userCard!: UserCard;

  @Column({ type: 'int', default: 1 })
  interval!: number;

  @Column({ type: 'int', default: 0 })
  repetition!: number;

  @Column({ type: 'float', default: 2.5 })
  ef!: number;

  @Column({ type: 'timestamp' })
  nextReviewDate!: Date;
}
