import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CardsService } from './cards.service';
import { SaveCardDto } from './dto/save-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get('dictionary')
  @ApiOperation({ summary: 'Получить все карточки пользователя' })
  async getDictionary(@Req() req: { user: { id: number } }) {
    return this.cardsService.getUserCards(req.user.id);
  }

  @Get('review')
  @ApiOperation({ summary: 'Получить карточки для повторения на сегодня' })
  async getCardsToReview(@Req() req: { user: { id: number } }) {
    return this.cardsService.getCardsToReview(req.user.id);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Получить общую ленту карточек' })
  async getFeed() {
    return this.cardsService.getFeed();
  }

  @Post('feed/:id/save')
  @ApiOperation({ summary: 'Сохранить карточку из ленты себе' })
  async importFromFeed(
    @Param('id') id: string,
    @Req() req: { user: { id: number } },
  ) {
    return this.cardsService.importCardFromFeed(Number(id), req.user.id);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Отправить фото на анализ ИИ' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Фотография для анализа',
        },
      },
    },
  })
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    return this.cardsService.analyzeImageWithAI(file);
  }

  @Post('save')
  @ApiOperation({ summary: 'Сохранить карточку в словарь пользователя' })
  async saveCardToDictionary(
    @Body() body: SaveCardDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.cardsService.saveCard(body, req.user.id);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Отправить результат повторения карточки' })
  async reviewCard(@Param('id') id: string, @Body() body: ReviewCardDto) {
    return this.cardsService.updateCardProgress(Number(id), body.quality);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку из словаря' })
  async deleteCard(
    @Param('id') id: string,
    @Req() req: { user: { id: number } },
  ) {
    return this.cardsService.deleteCard(Number(id), req.user.id);
  }
}
