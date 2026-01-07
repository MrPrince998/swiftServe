import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillingSubscriptionService } from './billing-subscription.service';
import { CreateBillingSubscriptionDto } from './dto/create-billing-subscription.dto';
import { UpdateBillingSubscriptionDto } from './dto/update-billing-subscription.dto';

@Controller('billing-subscription')
export class BillingSubscriptionController {
  constructor(private readonly billingSubscriptionService: BillingSubscriptionService) {}

  @Post()
  create(@Body() createBillingSubscriptionDto: CreateBillingSubscriptionDto) {
    return this.billingSubscriptionService.create(createBillingSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.billingSubscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingSubscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillingSubscriptionDto: UpdateBillingSubscriptionDto) {
    return this.billingSubscriptionService.update(+id, updateBillingSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingSubscriptionService.remove(+id);
  }
}
