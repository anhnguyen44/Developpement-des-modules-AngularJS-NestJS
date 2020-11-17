import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller, Delete, FilesInterceptor,
    Get,
    Param,
    Post, Res, UploadedFiles,
    UseInterceptors,
    Patch
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { AffectationPrelevementService } from './affectation-prelevement.service';
import { Authorized } from '../common/decorators/authorized.decorator';
import { AffectationPrelevement } from './affectation-prelevement.entity';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { DeepPartial } from 'typeorm';

@ApiUseTags('affectationPrelevement')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'affectationPrelevement'))
export class AffectationPrelevementController {
    constructor(private affectationPrelevementService: AffectationPrelevementService) { }

    @ApiOperation({ title: 'Creation d\'une affectation prelevement' })
    @Post('')
    @Authorized()
    async create(@Body() requestBody: AffectationPrelevement) {
        // console.log(requestBody);
        return await this.affectationPrelevementService.create(requestBody);
    }

    @ApiOperation({ title: 'Suppression d\'une affectation prelevement' })
    @Delete('/:idAffectationPrelevement')
    @Authorized()
    async delete(@Param() params) {
        return await this.affectationPrelevementService.delete(params.idAffectationPrelevement);
    }
}