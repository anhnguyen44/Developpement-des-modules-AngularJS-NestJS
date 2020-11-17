import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException, Param,
    ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UnauthorizedException, Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { apiPath } from '../api';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

import { ImportService } from './import.service';

import { UtilisateurService } from '../utilisateur/utilisateur.service';


@ApiUseTags('Imports')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'import'))
export class ImportController {
    constructor(
        private readonly importService: ImportService,
        private readonly utilisateurService: UtilisateurService,
    ) { }

    @ApiOperation({ title: 'Lit le fichier et renvoie un tableau d\'entités correspondantes' })
    @Post()
    async readFile(@Body() params: any): Promise<any[]> {
        try {
            // TODO
            const res = this.importService.readFromXlsx(params.idFichier, params.headers, params.hasHeaders);
            return res;
        } catch (err) {
            if (err.message === 'Le import existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }
}
