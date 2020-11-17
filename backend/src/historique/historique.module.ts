import {Global, Module} from '@nestjs/common';
import {HistoriqueController} from './historique.controller';
import {HistoriqueService} from './historique.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Historique} from './historique.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Historique])
    ],
    controllers: [HistoriqueController],
    providers: [HistoriqueService],
    exports: [HistoriqueService]
})
export class HistoriqueModule {}
