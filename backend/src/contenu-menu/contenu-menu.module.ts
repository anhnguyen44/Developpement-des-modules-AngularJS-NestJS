import {Module} from '@nestjs/common';
import {ContenuMenuController} from './contenu-menu.controller';
import {ContenuMenuService} from './contenu-menu.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CContenuMenu} from './contenu-menu.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CContenuMenu])
    ],
    controllers: [ContenuMenuController],
    providers: [ContenuMenuService],
    exports: [ContenuMenuService],
})
export class ContenuMenuModule {}
