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
import { CNoteCompetenceStagiaire } from './note-competence-stagiaire.entity';
import { NoteCompetenceStagiaireService } from './note-competence-stagiaire.service';
import { async } from 'rxjs/internal/scheduler/async';
import { HistoriqueService } from '../historique/historique.service';
import { DeepPartial } from 'typeorm';



@ApiUseTags('note-competence-stagiaire')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1,'note-competence-stagiaire'))

export class NoteCompetenceStagiairetController{
    constructor(
        private noteCompetenceStagiaireService: NoteCompetenceStagiaireService,
        private historiqueService: HistoriqueService
    ){

    }

    @ApiResponse({ status: 400, description: 'Le note de compétence de stagiaire de la session de formation existe déjà.' })
    @Post()
    @Authorized()
    async create(@Body() requestBody: CNoteCompetenceStagiaire, @Req() request) {
        try {
            const note = await this.noteCompetenceStagiaireService.create(requestBody);
            return note;
        } catch (err) {
            if (err.message === 'Le stagiaire de la session de formation existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({ title: 'MàJ note compétence stagiaire' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        id: number,
        @Body() partialEntry: DeepPartial<CNoteCompetenceStagiaire>
    ) {
        const prd = this.noteCompetenceStagiaireService.update(id, partialEntry);
        return prd;
    }

    // @Get('countAll/:idFormation')
    // @Authorized()
    // async countAll(@Param('idFormation')idFormation, @Req() req): Promise<number>{
    //     const listToCount = await this.formationContactService.getAllByIdFormation(req.query,idFormation);

    //     return listToCount.length;
    // }

    // @Get('getById/:idSession/:id')
    // @Authorized()
    // async getById(@Param('idSession') idSession,@Param('id') id): Promise<CFormationContact> {
    //     try {
    //         //console.log('TEST 1');
    //         //console.log(req.query);
    //         return this.formationContactService.getById(idSession,id);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    @Get('getAllByIdSta/:id')
    @Authorized()
    async getAllByIdStagiaire(@Param('id') id): Promise<CNoteCompetenceStagiaire[]> {
        try {
            return this.noteCompetenceStagiaireService.getAllByIdStagiaire(id);
        } catch (e) {
            console.error(e);
        }
    }

    @Get('getAllByIdTypeForma/:id')
    @Authorized()
    async getAllByIdTypeForma(@Param('id') id): Promise<CNoteCompetenceStagiaire[]> {
        try {
            return this.noteCompetenceStagiaireService.getAllByIdTypeForma(id);
        } catch (e) {
            console.error(e);
        }
    }
    
    
    @Delete('deleteByIdNote/:id')
    @Authorized()
    async deleteByIdNote(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.noteCompetenceStagiaireService.deleteByIdNote(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }


    @Delete('deleteByIdTypeForma/:id')
    @Authorized()
    async deleteAllNoteByIdTypeFormation(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.noteCompetenceStagiaireService.deleteAllNoteByIdTypeFormation(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    @Delete('deleteByIdForma/:id')
    @Authorized()
    async deleteAllNoteByIdFormation(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.noteCompetenceStagiaireService.deleteAllNoteByIdFormation(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    @Delete('deleteByIdSta/:id')
    @Authorized()
    async deleteAllNoteByIdSta(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.noteCompetenceStagiaireService.deleteAllNoteByIdSta(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    @Delete('deleteByIdCom/:id')
    @Authorized()
    async deleteByIdCompetence(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.noteCompetenceStagiaireService.deleteByIdCompetence(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    // @ApiOperation({title: 'Suppression stagiaire de formation'})
    // @Delete(':id')
    // @Authorized()
    // async  delete(@Param() params) {
    //     return await this.formationContactService.delete(params.id)
    // }
    
}