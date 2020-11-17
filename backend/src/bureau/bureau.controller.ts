import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HistoriqueService } from '../historique/historique.service';
import { Bureau } from './bureau.entity';
import { BureauService } from './bureau.service';
import { profils } from '@aleaac/shared';
import { GenerationService } from '../generation/generation.service';

@ApiUseTags('bureau')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'bureau'))
export class BureauController {
    constructor(private bureauService: BureauService,
        private historiqueService: HistoriqueService,
        private generationService: GenerationService,
    ) { }


    @ApiOperation({ title: 'Génération de l\'export' })
    @Get('generateXlsx')
    @Authorized(profils.SUPER_ADMIN)
    async generateXlsx(@Param() params, @Res() res) {
        const data = await this.bureauService.getAllAll();
        const header = ['Id', 'Id Franchise', 'Raison Sociale',
            'Nom Gérant', 'Adresse', 'Code postal',
            'Ville', 'Portable', 'Bureau principal', 'Nom du bureau'
        ];
        const datas = [];

        data.forEach((row) => {
            const rowToPush = [];
            rowToPush.push(row.id);
            if (row.franchise) {
                rowToPush.push(row.franchise.id);
                rowToPush.push(row.franchise.raisonSociale);
                rowToPush.push(row.franchise.nomPrenomSignature);
            } else {
                rowToPush.push('');
                rowToPush.push('');
                rowToPush.push('');
            }
            if (row.adresse) {
                rowToPush.push(row.adresse.adresse);
                rowToPush.push(row.adresse.cp);
                rowToPush.push(row.adresse.ville);
            } else {
                rowToPush.push('');
                rowToPush.push('');
                rowToPush.push('');
            }
            rowToPush.push(row.portable);
            rowToPush.push(row.bPrincipal);
            rowToPush.push(row.nom);

            datas.push(rowToPush)
        });

        res.end(await this.generationService.generateXlsx(header, datas))
    }

    @ApiOperation({ title: 'bureaux par idFranchise' })
    @Get('all/:idFranchise')
    async findAll(@Param() params, @Req() req) {
        return await this.bureauService.getAll(params.idFranchise, req.query);
    }

    @ApiOperation({ title: 'bureaux par idFranchise' })
    @Get('allPrici/:idFranchise')
    async getAllPricipal(@Param() params, @Req() req) {
        return await this.bureauService.getAllPricipal(params.idFranchise, req.query);
    }

    @ApiOperation({ title: 'bureaux par idBureau' })
    @Get('/:idBureau')
    @Authorized()
    async find(@Param() params) {
        return await this.bureauService.getById(params.idBureau);
    }

    @ApiOperation({ title: 'Création d\'un bureau' })
    @Post()
    @Authorized()
    async create(@Body() requestBody: Bureau, @Req() req) {
        const result = await this.bureauService.create(requestBody);
        this.historiqueService.add(req.user.id, 'bureau', result.id, 'Création bureau');
    }

    @ApiOperation({ title: 'Update d\'un bureau' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: Bureau) {
        return await this.bureauService.update(requestBody);
    }

    @ApiOperation({ title: 'Suppression d\'un bureau' })
    @Delete(':id')
    @Authorized()
    async delete(@Param() params) {
        return await this.bureauService.delete(params.id);
    }
}
