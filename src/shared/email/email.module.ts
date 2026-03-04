import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailProcessor } from "./email.processor";
import { EmailService } from "./email.service";
import { BullModule } from "@nestjs/bull";
import { EMAIL_QUEUE } from "../Queue/queue.constants";

@Module({
  imports: [
    ConfigModule,

    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [EmailService],
})

export class EmailModule { }