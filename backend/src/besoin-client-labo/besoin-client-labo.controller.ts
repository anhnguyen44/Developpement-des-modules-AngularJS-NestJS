import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, BadRequestException, Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { BesoinClientLabo } from './besoin-client-labo.entity';
import { BesoinClientLaboService } from './besoin-client-labo.service';
import { InitStrategieFromBesoinDto, EnumTypeBesoinLabo, EnumStatutStrategie, EnumTypeStrategie,
    EnumMomentObjectifs, EnumSousSectionStrategie } from '@aleaac/shared';
import { StrategieService } from '../strategie/strategie.service';
import { Strategie } from '../strategie/strategie.entity';
import { MomentObjectifService } from '../moment-objectif/moment-objectif.service';
import { MomentObjectif } from '../moment-objectif/moment-objectif.entity';
import { TypeObjectifService } from '../type-objectif/type-objectif.service';
import { HistoriqueService } from '../historique/historique.service';


@ApiUseTags('BesoinClientLabo')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'besoin-client-labo'))
export class BesoinClientLaboController {
    constructor(
        private besoinClientLaboService: BesoinClientLaboService,
        private strategieService: StrategieService,
        private momentObjectifService: MomentObjectifService,
        private typeBsoinLaboService: TypeObjectifService,
        private historiqueService: HistoriqueService,
    ) { }


    @Post('initStrategiesFromBesoin')
    async initStrategiesFromBesoin(@Body() requestBody: InitStrategieFromBesoinDto, @Req() req) {
        // console.log(requestBody);

        try {
            if (requestBody.sousSection) {
                // Ici on est forcément en code du travail
                // Pour SS3 et SS4, on génère exactement la même chose,
                // la différence sera sur la possibilité de supprimer ou pas par la suite
                let nbLast = (await this.strategieService.countAll(requestBody.idChantier, '')) + 1;
                const stratEtatsInitiaux: Strategie = new Strategie();
                stratEtatsInitiaux.generated = true;
                stratEtatsInitiaux.reference = 'STR-' + requestBody.idChantier + '-' + nbLast;
                stratEtatsInitiaux.typeStrategie = EnumTypeStrategie.SPATIALE;
                stratEtatsInitiaux.idChantier = requestBody.idChantier;
                stratEtatsInitiaux.isCOFRAC = true;
                stratEtatsInitiaux.version = 1;
                stratEtatsInitiaux.sousSection = requestBody.sousSection;
                stratEtatsInitiaux.statut = EnumStatutStrategie.STRAT_A_REALISER;
                stratEtatsInitiaux.description = 'Avant travaux et interventions liés à l\'amiante';

                const momentStratEtatsInitiaux =
                    await this.momentObjectifService.findOneById(EnumMomentObjectifs.AVANT_TRAVAUX_LIES_AMIANTE.valueOf());
                stratEtatsInitiaux.moments = [momentStratEtatsInitiaux];
                await this.strategieService.create(stratEtatsInitiaux);

                // On refait l'appel car tout est asynchrone
                nbLast = (await this.strategieService.countAll(requestBody.idChantier, '')) + 1;
                const stratSuivi: Strategie = new Strategie();
                stratSuivi.generated = true;
                stratSuivi.reference = 'STR-' + requestBody.idChantier + '-' + nbLast;
                stratSuivi.typeStrategie = EnumTypeStrategie.SUIVI;
                stratSuivi.idChantier = requestBody.idChantier;
                stratSuivi.isCOFRAC = true;
                stratSuivi.version = 1;
                stratSuivi.sousSection = requestBody.sousSection;
                stratSuivi.statut = EnumStatutStrategie.STRAT_A_REALISER;

                stratSuivi.description = '';
                const momentsStratSuivi = new Array<MomentObjectif>();

                if (requestBody.sousSection === EnumSousSectionStrategie.SS4) {
                    stratSuivi.description += 'Suite à incident, ';
                    momentsStratSuivi.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.SUITE_A_INCIDENT.valueOf()));
                }

                stratSuivi.description += 'Pendant travaux préliminaires et préparatoires, Pendant travaux et interventions liés à l\'amiante';
                momentsStratSuivi.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.PENDANT_TRAVAUX_PRELIM_PREPA.valueOf()));
                momentsStratSuivi.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.PENDANT_TRAVAUX_INTERV_LIES_AMIANTE.valueOf()));
                stratSuivi.moments = momentsStratSuivi;
                await this.strategieService.create(stratSuivi);

                nbLast = (await this.strategieService.countAll(requestBody.idChantier, '')) + 1;
                const stratFinChantier: Strategie = new Strategie();
                stratFinChantier.generated = true;
                stratFinChantier.reference = 'STR-' + requestBody.idChantier + '-' + nbLast;
                stratFinChantier.typeStrategie = EnumTypeStrategie.SPATIALE;
                stratFinChantier.idChantier = requestBody.idChantier;
                stratFinChantier.isCOFRAC = true;
                stratFinChantier.version = 1;
                stratFinChantier.sousSection = requestBody.sousSection;
                stratFinChantier.statut = EnumStatutStrategie.STRAT_A_REALISER;

                const momentsStratFin = new Array<MomentObjectif>();
                if (requestBody.sousSection === EnumSousSectionStrategie.SS3) {
                    stratFinChantier.description = 'A la fin de travaux de retrait ou l\'encapsulage de l\'amiante';
                    momentsStratFin.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.FIN_TRAVAUX_RETRAIT_ENCAPSULAGE.valueOf()));
                } else if (requestBody.sousSection === EnumSousSectionStrategie.SS4) {
                    stratFinChantier.description = 'A la fin d\'interventions susceptibles de provoquer l\'émission de fibres d\'amiante, A l\'issue de travaux de retrait ou d\'encapsulage de l\'amiante et avant restitution aux occupants';
                    momentsStratFin.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.FIN_INTERVENTION_EMISSION_FIBRES.valueOf()));
                    momentsStratFin.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.ISSUE_TRAVAUX_RETRAIT_ENCAPSULAGE.valueOf()));
                }
                stratFinChantier.moments = momentsStratFin;

                this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier,
                    'Initialisation des stratégies à partir du besoin. (' + EnumSousSectionStrategie[requestBody.sousSection] + ')');
                await this.strategieService.create(stratFinChantier);
            } else {
                if (requestBody.besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_TRAVAIL
                    && requestBody.besoin.ss3 && requestBody.besoin.ss4) {
                    // Cas de SS3 + SS4
                    requestBody.sousSection = EnumSousSectionStrategie.SS3;
                    await this.initStrategiesFromBesoin(requestBody, req);

                    requestBody.sousSection = EnumSousSectionStrategie.SS4;
                    await this.initStrategiesFromBesoin(requestBody, req);
                } else if (requestBody.besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_SANTE_PUBLIQUE) {
                    // Cas CSP
                    const avantTravaux: Strategie = new Strategie();
                    avantTravaux.generated = true;
                    avantTravaux.reference = 'STR-' + requestBody.idChantier + '-1';
                    avantTravaux.typeStrategie = EnumTypeStrategie.SPATIALE;
                    avantTravaux.idChantier = requestBody.idChantier;
                    avantTravaux.isCOFRAC = true;
                    avantTravaux.version = 1;
                    avantTravaux.sousSection = null;
                    avantTravaux.statut = EnumStatutStrategie.STRAT_A_REALISER;
                    avantTravaux.description = 'Avant travaux et interventions liés à l\'amiante';

                    const momentsAvantTravaux = new Array<MomentObjectif>();
                    momentsAvantTravaux.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.UTILISATION_NORMALE_LOCAUX.valueOf()));
                    momentsAvantTravaux.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.SUITE_A_INCIDENT.valueOf()));
                    avantTravaux.moments = momentsAvantTravaux;
                    this.strategieService.create(avantTravaux);


                    const apresTravaux: Strategie = new Strategie();
                    apresTravaux.generated = true;
                    apresTravaux.reference = 'STR-' + requestBody.idChantier + '-2';
                    apresTravaux.typeStrategie = EnumTypeStrategie.SPATIALE;
                    apresTravaux.idChantier = requestBody.idChantier;
                    apresTravaux.isCOFRAC = true;
                    apresTravaux.version = 1;
                    apresTravaux.sousSection = null;
                    apresTravaux.statut = EnumStatutStrategie.STRAT_A_REALISER;
                    apresTravaux.description = 'A l\'issue de travaux de retrait ou d\'encapsulage de l\'amiante et avant restitution aux occupants';

                    const momentsApresTravaux = new Array<MomentObjectif>();
                    momentsApresTravaux.push(await this.momentObjectifService.findOneById(EnumMomentObjectifs.ISSUE_TRAVAUX_RETRAIT_ENCAPSULAGE.valueOf()));
                    apresTravaux.moments = momentsApresTravaux;
                    this.strategieService.create(apresTravaux);

                    this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier,
                                        'Initialisation des stratégies à partir du besoin. (CSP)');
                } else {
                    // Ni CSP, ni SS3+SS4, on n'a rien à faire là
                    throw new BadRequestException('Il faut fournir une requête correcte, merci.');
                }
            }
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    @ApiOperation({ title: 'Nouvelle Besoin client labo' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle Besoin client labo.',
        type: BesoinClientLabo
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post()
    async create(@Body() requestBody: BesoinClientLabo) {
        // console.log(requestBody);

        try {
            delete requestBody.besoinClientLabo;
            return await this.besoinClientLaboService.create(requestBody);
        } catch (err) {
            if (err.message === 'La Besoin client labo existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<BesoinClientLabo>): Promise<BesoinClientLabo[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.besoinClientLaboService.find(options);
    }

    isNumber(value: string | number): boolean {
        return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the besoinClientLabo
     */
    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<BesoinClientLabo> {
        const foundBesoinClientLabo = await this.besoinClientLaboService.findOneById(parseInt(id, 10));

        if (!foundBesoinClientLabo) {
            throw new NotFoundException(`BesoinClientLabo '${id}' introuvable`);
        }

        return foundBesoinClientLabo;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() besoinClientLabo: BesoinClientLabo, @Req() req) {
        // TODO : check droits
        const typesBesoin = await this.typeBsoinLaboService.find();
        const old = await this.besoinClientLaboService.findOneById(besoinClientLabo.id);
        let historique = '';

        if (old.dateDemande && besoinClientLabo.dateDemande && old.dateDemande !== besoinClientLabo.dateDemande) {
            historique += 'Modification de la date de demande : ' + old.dateDemande.toLocaleDateString()
                            + ' &#x2192; ' + besoinClientLabo.dateDemande.toLocaleDateString() + '\n';
        }

        if (old.dateDemandeSS4 && besoinClientLabo.dateDemandeSS4 && old.dateDemandeSS4 !== besoinClientLabo.dateDemandeSS4) {
            historique += 'Modification de la date de demande : ' + old.dateDemandeSS4.toLocaleDateString()
                            + ' &#x2192; ' + besoinClientLabo.dateDemandeSS4.toLocaleDateString() + '\n';
        }

        if (old.idTypeBesoinLabo && besoinClientLabo.idTypeBesoinLabo && old.idTypeBesoinLabo !== besoinClientLabo.idTypeBesoinLabo){
            historique += 'Modification du xxx du besoin client : ' + typesBesoin.find(b => b.id === old.idTypeBesoinLabo).nom
                            + ' &#x2192; ' + typesBesoin.find(b => b.id === besoinClientLabo.idTypeBesoinLabo).nom + '\n';
        }

        if ((old.ss3 && !besoinClientLabo.ss3) || (!old.ss3 && besoinClientLabo.ss3)) {
            historique += 'SS3 : ' + (old.ss3 ? '&#x2705;' : '&times;')
                            + ' &#x2192; ' + (besoinClientLabo.ss3 ? '&#x2705;' : '&times;') + '\n';
        }

        if ((old.ss4 && !besoinClientLabo.ss4) || (!old.ss4 && besoinClientLabo.ss4)) {
            historique += 'SS4 : ' + (old.ss4 ? '&#x2705;' : '&times;')
                            + ' &#x2192; ' + (besoinClientLabo.ss4 ? '&#x2705;' : '&times;') + '\n';
        }

        // Objectifs : Suppressions
        for (const objectif of old.objectifs) {
            if (!besoinClientLabo.objectifs || besoinClientLabo.objectifs.findIndex(o => o.id === objectif.id) === -1) {
                historique += 'Suppression objectif : ' + objectif.lettre + '\n';
            }
        }
        // Objectifs : Ajouts
        for (const objectif of besoinClientLabo.objectifs) {
            if (!old.objectifs || old.objectifs.findIndex(o => o.id === objectif.id) === -1) {
                historique += 'Ajout objectif : ' + objectif.lettre + '\n';
            }
        }

        if (old.commentaires !== besoinClientLabo.commentaires) {
            historique += 'Modification du commentaire : ' + old.commentaires
                            + ' &#x2192; ' + besoinClientLabo.commentaires + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'chantier', besoinClientLabo.chantier.id, 'Modification du besoin client : \n' + historique);
            this.historiqueService.add(req.user.id, 'besoin-client-labo', besoinClientLabo.id, historique);
        }

        return this.besoinClientLaboService.update(besoinClientLabo.id, besoinClientLabo);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        id: number,
        @Body() besoinClientLabo: DeepPartial<BesoinClientLabo>,
        @Req() req
    ) {
        // TODO : check droits
        // console.log(besoinClientLabo);
        // console.log(id);

        const typesBesoin = await this.typeBsoinLaboService.find();
        const old = await this.besoinClientLaboService.findOneById(id);
        let historique = '';

        if (old.dateDemande && besoinClientLabo.dateDemande && old.dateDemande !== besoinClientLabo.dateDemande) {
            historique += 'Modification de la date de demande : ' + old.dateDemande.toLocaleDateString()
                            + ' &#x2192; ' + JSON.stringify(besoinClientLabo.dateDemande) + '\n';
        }

        if (old.dateDemandeSS4 && besoinClientLabo.dateDemandeSS4 && old.dateDemandeSS4 !== besoinClientLabo.dateDemandeSS4) {
            historique += 'Modification de la date de demande : ' + old.dateDemandeSS4.toLocaleDateString()
                            + ' &#x2192; ' + JSON.stringify(besoinClientLabo.dateDemandeSS4) + '\n';
        }

        if (old.idTypeBesoinLabo && besoinClientLabo.idTypeBesoinLabo && old.idTypeBesoinLabo !== besoinClientLabo.idTypeBesoinLabo){
            historique += 'Modification du xxx du besoin client : ' + typesBesoin.find(b => b.id === old.idTypeBesoinLabo).nom
                            + ' &#x2192; ' + typesBesoin.find(b => b.id === besoinClientLabo.idTypeBesoinLabo).nom + '\n';
        }

        if ((old.ss3 && !besoinClientLabo.ss3) || (!old.ss3 && besoinClientLabo.ss3)) {
            historique += 'SS3 : ' + (old.ss3 ? '&#x2705;' : '&#x274C;')
                            + ' &#x2192; ' + (besoinClientLabo.ss3 ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.ss4 && !besoinClientLabo.ss4) || (!old.ss4 && besoinClientLabo.ss4)) {
            historique += 'SS4 : ' + (old.ss4 ? '&#x2705;' : '&#x274C;')
                            + ' &#x2192; ' + (besoinClientLabo.ss4 ? '&#x2705;' : '&#x274C;') + '\n';
        }

        // Objectifs : Suppressions
        for (const objectif of old.objectifs) {
            if (!besoinClientLabo.objectifs || besoinClientLabo.objectifs.findIndex(o => o.id === objectif.id) === -1) {
                historique += 'Suppression objectif : ' + objectif.lettre + '\n';
            }
        }
        // Objectifs : Ajouts
        for (const objectif of besoinClientLabo.objectifs) {
            if (!old.objectifs || old.objectifs.findIndex(o => o.id === objectif.id) === -1) {
                historique += 'Ajout objectif : ' + objectif.lettre + '\n';
            }
        }

        if (old.commentaires !== besoinClientLabo.commentaires) {
            historique += 'Modification du commentaire : ' + old.commentaires
                            + ' &#x2192; ' + besoinClientLabo.commentaires + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'chantier', old.chantier.id, 'Modification du besoin client : \n' + historique);
            this.historiqueService.add(req.user.id, 'besoin-client-labo', besoinClientLabo.id, historique);
        }

        return this.besoinClientLaboService.update(besoinClientLabo.id, besoinClientLabo);
    }

    @Delete(':id')
    @Authorized()
    async remove(
        @Param('id', new ParseIntPipe())
        besoinClientLaboId: number
    ) {
        // TODO : check droits
        return this.besoinClientLaboService.remove(besoinClientLaboId);
    }
}
