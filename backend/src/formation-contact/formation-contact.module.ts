import {Module} from '@nestjs/common';
import {FormationContactController} from './formation-contact.controller';
import {FormationContactService} from './formation-contact.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CFormationContact} from './formation-contact.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CFormationContact])
    ],
    controllers: [FormationContactController],
    providers: [FormationContactService],
    exports: [FormationContactService],
})
export class FormationContactModule {}