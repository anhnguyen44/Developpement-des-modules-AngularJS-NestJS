import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationVuPar } from './notification-vu-par.entity';
import { NotificationVuParController } from './notification-vu-par.controller';
import { NotificationVuParService } from './notification-vu-par.service';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationVuPar])
    ],
    controllers: [NotificationVuParController],
    providers: [NotificationVuParService],
    exports: [NotificationVuParService]
})
export class NotificationVuParModule { }
