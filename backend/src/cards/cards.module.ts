import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { BaseCard } from './entities/base-card.entity';
import { UserCard } from './entities/user-card.entity';
import { Progress } from './entities/progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseCard, UserCard, Progress]),
    HttpModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
