import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserCard } from '../cards/entities/user-card.entity';
import { Progress } from '../cards/entities/progress.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserCard)
    private userCardRepo: Repository<UserCard>,
    @InjectRepository(Progress)
    private progressRepo: Repository<Progress>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const passwordHash = await bcrypt.hash(pass, 10);
    const user = this.userRepository.create({ email, passwordHash });
    await this.userRepository.save(user);

    try {
      const publicCards = await this.userCardRepo.find({
        where: { isPublic: true },
        relations: { baseCard: true },
        take: 3,
        order: { id: 'ASC' },
      });

      for (const originalCard of publicCards) {
        const newCard = this.userCardRepo.create({
          user: user,
          baseCard: originalCard.baseCard,
          customWord: originalCard.customWord,
          customTranslation: originalCard.customTranslation,
          isPublic: false,
          isImported: true,
        });
        const savedCard = await this.userCardRepo.save(newCard);

        const progress = this.progressRepo.create({
          userCard: savedCard,
          interval: 1,
          repetition: 0,
          ef: 2.5,
          nextReviewDate: new Date(),
        });
        await this.progressRepo.save(progress);
      }
    } catch (error) {
      console.error('Ошибка при выдаче стартовых карточек:', error);
    }
    return this.generateToken(user);
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
