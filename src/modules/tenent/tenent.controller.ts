import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { TenentService } from './tenent.service';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { RestaurantTenent } from './entities/tenent.entity';

@Controller('restaurant')
export class TenentController {
  constructor(private readonly tenentService: TenentService) {}

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('create-restaurant')
  createRestaurant(@Body() tenent: RestaurantTenent, @Req() req: any) {
    return this.tenentService.createRestaurant(tenent, req.user.userId);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('my-restaurant')
  getMyRestaurant(@Req() req: any) {
    return this.tenentService.getMyRestaurant(req.user.userId);
  }
}
