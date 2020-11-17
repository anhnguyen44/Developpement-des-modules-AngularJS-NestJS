import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { SitePrelevement } from './site-prelevement.entity';
import { SitePrelevementService } from './site-prelevement.service';
import { FichierService } from '../fichier/fichier.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { BatimentService } from '../batiment/batiment.service';
import { Batiment } from '../batiment/batiment.entity';
import { HistoriqueService } from '../historique/historique.service';


@ApiUseTags('SitePrelevement')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'site-prelevement'))
export class SitePrelevementController {
    constructor(
        private sitePrelevementService: SitePrelevementService,
        private batimentService: BatimentService,
        private fichierService: FichierService,
        private historiqueService: HistoriqueService,
    ) { }

    @ApiOperation({ title: 'Nouvelle sitePrelevement' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle sitePrelevement.',
        type: SitePrelevement
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post()
    async create(@Body() requestBody: SitePrelevement, @Req() req) {
        // console.log(requestBody);

        try {
            let adresseSite = '';
            adresseSite += requestBody.nom ? requestBody.nom + ' - ' : '';
            adresseSite += requestBody.adresse && requestBody.adresse.adresse ? requestBody.adresse.adresse + ' ' : '';
            adresseSite += requestBody.adresse && requestBody.adresse.cp ? requestBody.adresse.cp + ' ' : '';
            adresseSite += requestBody.adresse && requestBody.adresse.ville ? requestBody.adresse.ville + ' ' : '';

            this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier,
                'Création du site d\'intervention : ' + adresseSite);
            return await this.sitePrelevementService.create(requestBody);
        } catch (err) {
            if (err.message === 'La sitePrelevement existe déjà.') {
                // console.log(err);
                throw new ForbiddenException(err.message);
            } else {
                // console.log(err);
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('all/:idChantier')
    @Authorized()
    async findAllChantier(@Param('idChantier') idChantier, @Req() req): Promise<SitePrelevement[]> {

        const foundSitePrelevement = await this.sitePrelevementService.findByChantier(idChantier, req.query);

        return foundSitePrelevement;
    }

    @Get('countAll/:idChantier')
    @Authorized()
    async countAllChantier(@Param('idChantier') idChantier, @Req() req): Promise<number> {
        const foundSitePrelevement = await this.sitePrelevementService.findByChantier(idChantier, req.query);

        return foundSitePrelevement.length;
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<SitePrelevement>): Promise<SitePrelevement[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.sitePrelevementService.find(options);
    }

    isNumber(value: string | number): boolean {
        return !isNaN(Number(value.toString()));
    }

    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<SitePrelevement> {
        const foundSitePrelevement = this.sitePrelevementService.findOneById(parseInt(idOrName, 10));

        if (!foundSitePrelevement) {
            throw new NotFoundException(`SitePrelevement '${idOrName}' introuvable`);
        }

        return foundSitePrelevement;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() sitePrelevement: SitePrelevement, @Req() req) {
        // TODO : check droits
        const old = await this.sitePrelevementService.findOneById(sitePrelevement.id);
        let historique = '';

        if (old.nom && sitePrelevement.nom && old.nom !== sitePrelevement.nom) {
            historique += 'Modification du nom du site : ' + old.nom
                + ' &#x2192; ' + sitePrelevement.nom + '\n';
        }

        if (old.code && sitePrelevement.code && old.code !== sitePrelevement.code) {
            historique += 'Modification du code du site : ' + old.code
                + ' &#x2192; ' + sitePrelevement.code + '\n';
        }

        // ADRESSE
        if (old.adresse && sitePrelevement.adresse
            && (
                old.adresse.adresse !== sitePrelevement.adresse.adresse
                || old.adresse.cp !== sitePrelevement.adresse.cp
                || old.adresse.ville !== sitePrelevement.adresse.ville
            )
        ) {
            historique += 'Modification de l\'adresse du site : ' + old.adresse.adresse + ' ' + old.adresse.cp + ' ' + old.adresse.ville
                + ' &#x2192; ' + sitePrelevement.adresse.adresse + ' ' + sitePrelevement.adresse.cp + ' ' + sitePrelevement.adresse.ville
                + '\n';
        }

        // Batiments : Suppressions
        for (const batiment of old.batiments) {
            if (sitePrelevement.batiments.findIndex(o => o.id === batiment.id) === -1) {
                historique += 'Suppression batiment : ' + batiment.nom + '\n';
            }
        }
        // Batiments : Ajouts
        for (const batiment of sitePrelevement.batiments) {
            if (old.batiments.findIndex(o => o.id === batiment.id) === -1) {
                historique += 'Ajout batiment : ' + batiment.nom + '\n';
            }
        }

        if (old.latitude && sitePrelevement.latitude && old.latitude !== sitePrelevement.latitude) {
            historique += 'Modification de la latitude du site : ' + old.latitude
                + ' &#x2192; ' + sitePrelevement.latitude + '\n';
        }

        if (old.longitude && sitePrelevement.longitude && old.longitude !== sitePrelevement.longitude) {
            historique += 'Modification de la longitude du site : ' + old.longitude
                + ' &#x2192; ' + sitePrelevement.longitude + '\n';
        }

        if ((old.accesHauteurNecessaire && !sitePrelevement.accesHauteurNecessaire)
            || (!old.accesHauteurNecessaire && sitePrelevement.accesHauteurNecessaire)) {
            historique += 'Accès en hauteur nécessaire : ' + (old.accesHauteurNecessaire ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (sitePrelevement.accesHauteurNecessaire ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.electriciteSurPlace && !sitePrelevement.electriciteSurPlace)
            || (!old.electriciteSurPlace && sitePrelevement.electriciteSurPlace)) {
            historique += '&Eacute;lectricité sur  place : ' + (old.electriciteSurPlace ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (sitePrelevement.electriciteSurPlace ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.combles && !sitePrelevement.combles)
            || (!old.combles && sitePrelevement.combles)) {
            historique += 'Combles : ' + (old.combles ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (sitePrelevement.combles ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if (old.digicode && sitePrelevement.digicode && old.digicode !== sitePrelevement.digicode) {
            historique += 'Modification du digicode du site : ' + old.digicode
                + ' &#x2192; ' + sitePrelevement.digicode + '\n';
        }

        if (old.commentaire && sitePrelevement.commentaire && old.commentaire !== sitePrelevement.commentaire) {
            historique += 'Modification commentaire du site : ' + old.commentaire
                + ' &#x2192; ' + sitePrelevement.commentaire + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'chantier', old.idChantier,
                'Modification d\'un site d\'intervention : ' + '\n' + historique);
            this.historiqueService.add(req.user.id, 'site-prelevement', old.id, historique);
        }

        return this.sitePrelevementService.update(sitePrelevement.id, sitePrelevement);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        sitePrelevementId: number,
        @Body() sitePrelevement: DeepPartial<SitePrelevement>,
        @Req() req
    ) {
        // TODO : check droits
        const old = await this.sitePrelevementService.findOneById(sitePrelevement.id);
        let historique = '';

        if (old.nom && sitePrelevement.nom && old.nom !== sitePrelevement.nom) {
            historique += 'Modification du nom du site : ' + old.nom
                + ' &#x2192; ' + sitePrelevement.nom + '\n';
        }

        if (old.code && sitePrelevement.code && old.code !== sitePrelevement.code) {
            historique += 'Modification du code du site : ' + old.code
                + ' &#x2192; ' + sitePrelevement.code + '\n';
        }

        // ADRESSE
        if (old.adresse && sitePrelevement.adresse
            && (
                old.adresse.adresse !== sitePrelevement.adresse.adresse
                || old.adresse.cp !== sitePrelevement.adresse.cp
                || old.adresse.ville !== sitePrelevement.adresse.ville
            )
        ) {
            historique += 'Modification de l\'adresse du site : ' + old.adresse.adresse + ' ' + old.adresse.cp + ' ' + old.adresse.ville
                + ' &#x2192; ' + sitePrelevement.adresse.adresse + ' ' + sitePrelevement.adresse.cp + ' ' + sitePrelevement.adresse.ville
                + '\n';
        }


        // Batiments : Suppressions
        if (old.batiments) {
            for (const batiment of old.batiments) {
                if (!sitePrelevement.batiments || sitePrelevement.batiments.findIndex(o => o.id === batiment.id) === -1) {
                    historique += 'Suppression batiment : ' + batiment.nom + '\n';
                }
            }
        }

        // Batiments : Ajouts
        if (sitePrelevement.batiments) {
            for (const batiment of sitePrelevement.batiments) {
                if (!old.batiments || old.batiments.findIndex(o => o.id === batiment.id) === -1) {
                    historique += 'Ajout batiment : ' + batiment.nom + '\n';
                }
            }
        }


        if (old.latitude && sitePrelevement.latitude && old.latitude !== sitePrelevement.latitude) {
            historique += 'Modification de la latitude du site : ' + old.latitude
                + ' &#x2192; ' + sitePrelevement.latitude + '\n';
        }

        if (old.longitude && sitePrelevement.longitude && old.longitude !== sitePrelevement.longitude) {
            historique += 'Modification de la longitude du site : ' + old.longitude
                + ' &#x2192; ' + sitePrelevement.longitude + '\n';
        }

        if ((old.accesHauteurNecessaire && !sitePrelevement.accesHauteurNecessaire)
            || (!old.accesHauteurNecessaire && sitePrelevement.accesHauteurNecessaire)) {
            historique += 'Accès en hauteur nécessaire : ' + (old.accesHauteurNecessaire ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (sitePrelevement.accesHauteurNecessaire ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.electriciteSurPlace && !sitePrelevement.electriciteSurPlace)
            || (!old.electriciteSurPlace && sitePrelevement.electriciteSurPlace)) {
            historique += '&Eacute;lectricité sur  place : ' + (old.electriciteSurPlace ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (sitePrelevement.electriciteSurPlace ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.combles && !sitePrelevement.combles)
            || (!old.combles && sitePrelevement.combles)) {
            historique += 'Combles : ' + (old.combles ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (sitePrelevement.combles ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if (old.digicode && sitePrelevement.digicode && old.digicode !== sitePrelevement.digicode) {
            historique += 'Modification du digicode du site : ' + old.digicode
                + ' &#x2192; ' + sitePrelevement.digicode + '\n';
        }

        if (old.commentaire && sitePrelevement.commentaire && old.commentaire !== sitePrelevement.commentaire) {
            historique += 'Modification commentaire du site : ' + old.commentaire
                + ' &#x2192; ' + sitePrelevement.commentaire + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'chantier', old.idChantier,
                'Modification d\'un site d\'intervention : ' + '\n' + historique);
            this.historiqueService.add(req.user.id, 'site-prelevement', old.id, historique);
        }

        delete sitePrelevement.generatedMaps;
        delete sitePrelevement.raw;
        return this.sitePrelevementService.update(sitePrelevementId, sitePrelevement);
    }

    @Delete(':id')
    @Authorized()
    async remove(
        @Param('id', new ParseIntPipe())
        sitePrelevementId: number,
        @CurrentUtilisateur() user
    ) {
        const old = await this.sitePrelevementService.findOneById(sitePrelevementId);

        let adresseSite = '';
        adresseSite += old.nom ? old.nom + ' - ' : '';
        adresseSite += old.adresse && old.adresse.adresse ? old.adresse.adresse + ' ' : '';
        adresseSite += old.adresse && old.adresse.cp ? old.adresse.cp + ' ' : '';
        adresseSite += old.adresse && old.adresse.ville ? old.adresse.ville + ' ' : '';

        this.historiqueService.add(user, 'chantier', old.idChantier,
            'Suppression du site d\'intervention : ' + adresseSite);

        // TODO : check droits
        // Delete pieces jointes
        const fichiersLies = await this.fichierService.getAll('site-prelevement', sitePrelevementId);
        for (const fichier of fichiersLies) {
            this.fichierService.delete(fichier.id, user);
        }

        // Delete batiments
        for (const batiment of old.batiments) {
            this.batimentService.remove(batiment.id);
        }

        return this.sitePrelevementService.remove(sitePrelevementId);
    }
}
