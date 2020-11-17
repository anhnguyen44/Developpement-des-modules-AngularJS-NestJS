import {Module} from '@nestjs/common';
import {TypeMenuController} from './type-menu.controller';
import {TypeMenuService} from './type-menu.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeMenu} from './type-menu.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TypeMenu])
    ],
    controllers: [TypeMenuController],
    providers: [TypeMenuService],
    exports: [TypeMenuService],
})
export class TypeMenuModule {}
