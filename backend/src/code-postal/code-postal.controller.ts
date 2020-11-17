import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HistoriqueService } from '../historique/historique.service';
import { CodePostal } from './code-postal.entity';
import { CodePostalService } from './code-postal.service';
import { FindManyOptions } from 'typeorm';

@ApiUseTags('code-postal')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'code-postal'))
export class CodePostalController {
    constructor(private codePostalService: CodePostalService,
        private historiqueService: HistoriqueService) { }

    @ApiOperation({ title: 'codePostal par idFranchise' })

    @Get('all')
    async findAll(@Param() params, @Req() req) {
        return await this.codePostalService.getAll();
    }

    @Get('by-partial-cp/:cp')
    async findByCP(@Param() params, @Req() req) {
        // console.log('coucou');
        // console.log(params);
        let options: FindManyOptions<CodePostal>;
        if (params.cp) {
            options = {
                where: 'CodePostal.numCP LIKE \'' + params.cp + '%\'',
                order: {
                    nbhabitant: 'DESC'
                }
            };
        } else {
            options = {};
        }
        return await this.codePostalService.getAll(options);
    }

    @Get('by-partial-ville/:ville')
    async findByVille(@Param() params, @Req() req) {
        let options: FindManyOptions<CodePostal>;
        if (params.ville) {
            options = {
                where: 'CodePostal.nomCommune LIKE \'' + params.ville + '%\'',
                order: {
                    nbhabitant: 'DESC'
                }
            };
        } else {
            options = {};
        }
        return await this.codePostalService.getAll(options);
    }

    @ApiOperation({ title: 'codePostal par idCodePostal' })
    @Get('/:idCodePostal')
    @Authorized()
    async find(@Param() params) {
        return await this.codePostalService.getById(params.idCodePostal);
    }

    @ApiOperation({ title: 'Création d\'un code-postal' })
    @Post()
    @Authorized()
    async create(@Body() requestBody: CodePostal, @Req() req) {
        const result = await this.codePostalService.create(requestBody);
        this.historiqueService.add(req.user.id, 'code-postal', result.id, 'Création code-postal');
    }

    @ApiOperation({ title: 'Update d\'un code-postal' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: CodePostal) {
        return await this.codePostalService.update(requestBody);
    }

    @ApiOperation({ title: 'Suppression d\'un code-postal' })
    @Delete()
    @Authorized()
    async delete(@Body() requestBody: number[]) {
        return await this.codePostalService.delete(requestBody);
    }
}
