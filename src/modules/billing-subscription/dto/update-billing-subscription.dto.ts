import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingSubscriptionDto } from './create-billing-subscription.dto';

export class UpdateBillingSubscriptionDto extends PartialType(CreateBillingSubscriptionDto) {}
