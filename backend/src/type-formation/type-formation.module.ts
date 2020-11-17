import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeFormation} from './type-formation.entity';
import {TypeFormationController} from './type-formation.controller';
import {TypeFormationService} from './type-formation.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([TypeFormation])
    ],
    controllers: [TypeFormationController],
    providers: [TypeFormationService],
    exports: [TypeFormationService]
})
export class TypeFormationModule {}
