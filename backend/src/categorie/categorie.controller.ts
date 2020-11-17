import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Controller,
    Get,
    Post,
    UseInterceptors
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {CategorieService} from './categorie.service';


@ApiUseTags('categorie')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'categorie'))
export class CategorieController {
    constructor(private categorieService: CategorieService) {}

    @ApiOperation({title: 'recupération de toute les catégories'})
    @Get('')
    @Authorized()
    async getAll() {
        return await this.categorieService.getAll()
    }
}
