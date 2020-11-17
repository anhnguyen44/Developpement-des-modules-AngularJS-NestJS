import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get, InternalServerErrorException,
    Param,
    Patch,
    Post,
    Put,
    Req, Res,
    UnauthorizedException,
    UseInterceptors,
    ParseIntPipe
} from '@nestjs/common';
import { ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { Rights } from '../common/decorators/rights.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { GenerationService } from '../generation/generation.service';
import { CFormationContact } from './formation-contact.entity';
import { FormationContactService } from './formation-contact.service';
import { async } from 'rxjs/internal/scheduler/async';
import { HistoriqueService } from '../historique/historique.service';
import { DeepPartial } from 'typeorm';



@ApiUseTags('formation-contact')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1,'formation-contact'))

export class FormationContactController{
    constructor(
        private formationContactService: FormationContactService,
        private historiqueService: HistoriqueService
    ){

    }

    @ApiResponse({ status: 400, description: 'Le stagiaire de la session de formation existe déjà.' })
    @Post()
    @Authorized()
    async create(@Body() requestBody: CFormationContact, @Req() request) {
        try {
            const stagiaire = await this.formationContactService.create(requestBody);
            await this.historiqueService.add(request.user.id, 'formation', stagiaire.idFormation, 'Ajout stagiaire '+stagiaire.contact.prenom+' '+stagiaire.contact.nom+'(idStagiaire: '+stagiaire.id+')');
            return stagiaire;
        } catch (err) {
            if (err.message === 'Le stagiaire de la session de formation existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({ title: 'MàJ formation contact' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        staId: number,
        @Body() requestBody: CFormationContact
    ) {
        const prd = this.formationContactService.update(staId, requestBody);
        return prd;
    }

    @Get('countAll/:idFormation')
    @Authorized()
    async countAll(@Param('idFormation')idFormation, @Req() req): Promise<number>{
        const listToCount = await this.formationContactService.getAllByIdFormation(req.query,idFormation);

        return listToCount.length;
    }

    @Get('getByIdTypeFormation/:id')
    @Authorized()
    async getAllByIdTypeFormation(@Param('id')id, @Req() req): Promise<CFormationContact[]>{
        const list= await this.formationContactService.getAllByIdTypeFormation(id);

        return list;
    }

    @Get('getAllByIdDevis/:id')
    @Authorized()
    async getAllByIdDevis(@Param('id')id, @Req() req): Promise<CFormationContact[]>{
        const list= await this.formationContactService.getByIdDevis(id);

        return list;
    }


    @Get('getById/:idSession/:id')
    @Authorized()
    async getById(@Param('idSession') idSession,@Param('id') id): Promise<CFormationContact> {
        try {
            //console.log('TEST 1');
            //console.log(req.query);
            return this.formationContactService.getById(idSession,id);
        } catch (e) {
            console.error(e);
        }
    }

    @Get(':id')
    @Authorized()
    async getAllByIdFormation(@Req() req,@Param('id') id): Promise<CFormationContact[]> {
        try {
            //console.log('TEST 1');
            //console.log(req.query);
            return this.formationContactService.getAllByIdFormation(req.query,id);
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({title: 'Suppression stagiaire de formation'})
    @Delete(':id')
    @Authorized()
    async  delete(@Param() params) {
        return await this.formationContactService.delete(params.id)
    }
    
}