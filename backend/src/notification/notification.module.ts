import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationVuPar } from '../notification-vu-par/notification-vu-par.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, NotificationVuPar])
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule { }
