import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import 'multer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
    };
  }

  async updateProfile(
    userId: number,
    nickname?: string,
    file?: Express.Multer.File,
    newPassword?: string,
  ) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    if (nickname) {
      user.nickname = nickname;
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    if (file) {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `avatar-${userId}-${Date.now()}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      user.avatarUrl = `/uploads/avatars/${fileName}`;
    }

    await this.usersRepo.save(user);
    return {
      message: 'Профиль успешно обновлен!',
      avatarUrl: user.avatarUrl,
      nickname: user.nickname,
    };
  }
}
