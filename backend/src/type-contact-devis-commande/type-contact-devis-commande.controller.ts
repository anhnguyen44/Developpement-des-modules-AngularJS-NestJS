import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Controller,
    Get,
    Param,
    UseInterceptors
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {TypeContactDevisCommandeService} from './type-contact-devis-commande.service';


@ApiUseTags('type-contact-devis-commande')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-contact-devis-commande'))
export class TypeContactDevisCommandeController {
    constructor(private typeContactDevisCommandeService: TypeContactDevisCommandeService) {}

    @ApiOperation({title: 'liste des type contact devis commande'})
    @Get('')
    @Authorized()
    async find(@Param() params) {
        return await this.typeContactDevisCommandeService.getAll()
    }
}