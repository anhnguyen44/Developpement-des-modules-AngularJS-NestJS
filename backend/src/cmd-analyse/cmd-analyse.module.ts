import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CmdAnalyse} from './cmd-analyse.entity';
import {CmdAnalyseController} from './cmd-analyse.controller';
import {CmdAnalyseService} from './cmd-analyse.service';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([CmdAnalyse])
    ],
    controllers: [CmdAnalyseController],
    providers: [CmdAnalyseService],
    exports: [CmdAnalyseService]
})
export class CmdAnalyseModule {}
