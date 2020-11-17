import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AffectationPrelevementController} from './affectation-prelevement.controller';
import {AffectationPrelevementService} from './affectation-prelevement.service';
import {AffectationPrelevement} from './affectation-prelevement.entity';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([AffectationPrelevement])
    ],
    controllers: [AffectationPrelevementController],
    providers: [AffectationPrelevementService],
    exports: [AffectationPrelevementService]
})
export class AffectationPrelevementModule {}
