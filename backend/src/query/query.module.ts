import {Global, Module} from '@nestjs/common';
import {QueryService} from './query.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [QueryService],
    exports: [QueryService]
})
export class QueryModule {}
