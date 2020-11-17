import {Module} from '@nestjs/common';
import {CategorieMenuController} from './categorie-menu.controller';
import {CategorieMenuService} from './categorie-menu.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CCategorieMenu} from './categorie-menu.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CCategorieMenu])
    ],
    controllers: [CategorieMenuController],
    providers: [CategorieMenuService],
    exports: [CategorieMenuService],
})
export class CategorieMenuModule {}
