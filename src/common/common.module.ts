import { Module } from '@nestjs/common';
import { I18nService } from './i18n/i18n.service';
import { NotificationService } from './notifications/notification.service';

@Module({
  providers: [I18nService, NotificationService],
  exports: [I18nService, NotificationService],
})
export class CommonModule {}
