import * as fs from 'fs';
import * as path from 'path';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import { BaseCard } from './entities/base-card.entity';
import { UserCard } from './entities/user-card.entity';
import { Progress } from './entities/progress.entity';
import 'multer';

@Injectable()
export class CardsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(BaseCard) private baseCardRepo: Repository<BaseCard>,
    @InjectRepository(UserCard) private userCardRepo: Repository<UserCard>,
    @InjectRepository(Progress) private progressRepo: Repository<Progress>,
  ) {}

  async analyzeImageWithAI(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const imageUrl = `/uploads/${fileName}`;

    const aiUrl = this.configService.get<string>('AI_SERVICE_URL');
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${aiUrl}/analyze`, formData, {
          headers: { ...formData.getHeaders() },
        }),
      );

      return {
        ...(response.data as object),
        imageUrl: imageUrl,
      };
    } catch (error) {
      console.error('Ошибка ИИ:', error);
      throw new HttpException(
        'Ошибка при распознавании образа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  calculateNextReview(
    quality: number,
    previousProgress: { interval: number; repetition: number; ef: number },
  ) {
    let { interval, repetition, ef } = previousProgress;

    if (quality >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
      repetition++;
    } else {
      repetition = 0;
      interval = 1;
    }

    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (ef < 1.3) {
      ef = 1.3;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
      interval,
      repetition,
      ef: Number(ef.toFixed(2)),
      nextReviewDate,
    };
  }

  async updateCardProgress(userCardId: number, quality: number) {
    const progress = await this.progressRepo.findOne({
      where: { userCard: { id: userCardId } },
    });

    if (!progress) {
      throw new HttpException(
        'Прогресс для карточки не найден',
        HttpStatus.NOT_FOUND,
      );
    }

    const nextData = this.calculateNextReview(quality, {
      interval: progress.interval,
      repetition: progress.repetition,
      ef: progress.ef,
    });

    progress.interval = nextData.interval;
    progress.repetition = nextData.repetition;
    progress.ef = nextData.ef;
    progress.nextReviewDate = nextData.nextReviewDate;

    await this.progressRepo.save(progress);

    return {
      success: true,
      message: 'Прогресс обновлен',
      nextReviewDate: progress.nextReviewDate,
    };
  }

  async saveCard(
    dto: {
      imageUrl: string;
      wordEn: string;
      wordRu: string;
      rawData: Record<string, unknown>;
      isPublic?: boolean;
    },
    userId: number,
  ) {
    const baseCard = this.baseCardRepo.create({
      imageUrl: dto.imageUrl || 'placeholder.jpg',
      detectedObjects: dto.rawData,
      creator: { id: userId },
    });
    const savedBaseCard = await this.baseCardRepo.save(baseCard);

    const userCard = this.userCardRepo.create({
      user: { id: userId },
      baseCard: savedBaseCard,
      customWord: dto.wordEn,
      customTranslation: dto.wordRu,
      isPublic: dto.isPublic || false,
      isImported: false,
    });
    const savedUserCard = await this.userCardRepo.save(userCard);

    const progress = this.progressRepo.create({
      userCard: savedUserCard,
      interval: 1,
      repetition: 0,
      ef: 2.5,
      nextReviewDate: new Date(),
    });
    await this.progressRepo.save(progress);

    return {
      success: true,
      message: 'Карточка успешно добавлена в словарь!',
      userCardId: savedUserCard.id,
    };
  }

  async getUserCards(userId: number) {
    const cards = await this.userCardRepo.find({
      where: { user: { id: userId } },
      relations: {
        baseCard: true,
        progress: true,
      },
      order: {
        id: 'DESC',
      },
    });

    return cards;
  }

  async getCardsToReview(userId: number) {
    const today = new Date();

    const cards = await this.userCardRepo.find({
      where: {
        user: { id: userId },
        progress: {
          nextReviewDate: LessThanOrEqual(today),
        },
      },
      relations: {
        baseCard: true,
        progress: true,
      },
      order: {
        progress: {
          nextReviewDate: 'ASC',
        },
      },
    });

    return cards;
  }

  async getFeed() {
    const feed = await this.userCardRepo.find({
      where: { isPublic: true },
      relations: {
        user: true,
        baseCard: true,
      },
      order: { id: 'DESC' },
      take: 50,
    });

    return feed;
  }

  async importCardFromFeed(feedCardId: number, userId: number) {
    const originalCard = await this.userCardRepo.findOne({
      where: { id: feedCardId, isPublic: true },
      relations: {
        baseCard: true,
        user: true,
      },
    });

    if (!originalCard) {
      throw new HttpException(
        'Карточка не найдена в публичном доступе',
        HttpStatus.NOT_FOUND,
      );
    }

    if (originalCard.user.id === userId) {
      throw new HttpException(
        'Это и так ваша карточка',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCard = this.userCardRepo.create({
      user: { id: userId },
      baseCard: originalCard.baseCard,
      customWord: originalCard.customWord,
      customTranslation: originalCard.customTranslation,
      isPublic: false,
      isImported: true,
    });

    const savedUserCard = await this.userCardRepo.save(newCard);

    const progress = this.progressRepo.create({
      userCard: savedUserCard,
      interval: 1,
      repetition: 0,
      ef: 2.5,
      nextReviewDate: new Date(),
    });
    await this.progressRepo.save(progress);

    return { success: true, message: 'Слово добавлено в ваш словарь!' };
  }

  async deleteCard(cardId: number, userId: number) {
    const userCard = await this.userCardRepo.findOne({
      where: { id: cardId, user: { id: userId } },
    });

    if (!userCard) {
      throw new HttpException(
        'Карточка не найдена или нет прав на удаление',
        HttpStatus.NOT_FOUND,
      );
    }

    const progress = await this.progressRepo.findOne({
      where: { userCard: { id: cardId } },
    });

    if (progress) {
      await this.progressRepo.remove(progress);
    }

    await this.userCardRepo.remove(userCard);

    return { success: true, message: 'Карточка успешно удалена' };
  }
}
