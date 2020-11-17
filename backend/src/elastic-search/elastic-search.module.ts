import {Global, Module} from '@nestjs/common';
import { ElasticSearchService } from './elastic-search.service';

@Global()
@Module({
    providers: [ElasticSearchService],
    exports: [ElasticSearchService]
})
export class ElasticSearchModule {}
