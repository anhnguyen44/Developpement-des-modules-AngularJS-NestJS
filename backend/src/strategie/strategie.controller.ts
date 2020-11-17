import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req, Patch
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { StrategieService } from './strategie.service';
import { Strategie } from './strategie.entity';
import { HistoriqueService } from '../historique/historique.service';
import {
    EnumTypeStrategie, EnumSousSectionStrategie, EnumStatutStrategie, EnumTypeZoneIntervention, EnumTypeBatimentsForWord,
    EnumTypeDeChantier, EnumConfinement, EnumEmpoussierementGeneral, EnumAppareilsProtectionRespiratoire, EnumEnvironnement,
    EnumTypeFichier, EnumTypeTemplate, profils
} from '@aleaac/shared';
import { ChantierService } from '../chantier/chantier.service';
import { FranchiseService } from '../franchise/franchise.service';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';
import { PrelevementService } from '../prelevement/prelevement.service';
import { Objectif } from '../objectif/objectif.entity';
import { FichierService } from '../fichier/fichier.service';
import { Fichier } from '../fichier/fichier.entity';
import { TemplateVersionService } from '../template-version/template-version.service';
import { GenerationService } from '../generation/generation.service';
import { Chantier } from '../chantier/chantier.entity';


@ApiUseTags('strategie')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'strategie'))
export class StrategieController {
    constructor(
        private strategieService: StrategieService,
        private historiqueService: HistoriqueService,
        private generationService: GenerationService,
    ) { }

    @ApiOperation({ title: 'Recupération de toute les stratégies d\'un chantier' })
    @Get('getAll/:idChantier')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.strategieService.getAll(params.idChantier, res.query)
    }

    @ApiOperation({ title: 'Recupération de toute les stratégies SS3 d\'un chantier' })
    @Get('getSS3/:idChantier')
    @Authorized()
    async getSS3(@Param() params, @Req() res) {
        return await this.strategieService.getSS3(params.idChantier, res.query)
    }

    @ApiOperation({ title: 'Recupération de toute les stratégies SS4 d\'un chantier' })
    @Get('getSS4/:idChantier')
    @Authorized()
    async getSS4(@Param() params, @Req() res) {
        return await this.strategieService.getSS4(params.idChantier, res.query)
    }

    @ApiOperation({ title: 'Recupération de toute les stratégies CSP d\'un chantier' })
    @Get('getCSP/:idChantier')
    @Authorized()
    async getCSP(@Param() params, @Req() res) {
        return await this.strategieService.getCSP(params.idChantier, res.query)
    }

    @ApiOperation({ title: 'Count de toute les stratégies d\'un chantier' })
    @Get('countAll/:idChantier')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.strategieService.countAll(params.idChantier, res.query)
    }

    @ApiOperation({ title: 'Get 1 strategie en fonction de son id' })
    @Get(':idStrategie')
    @Authorized()
    async get(@Param() params) {
        return await this.strategieService.get(params.idStrategie)
    }

    @ApiOperation({ title: 'Création strategie' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: Strategie, @Req() req) {
        // console.log(requestBody);
        requestBody.idChantier = <number>requestBody.idChantier;

        let descriptionStrat = '';
        descriptionStrat += requestBody.reference + ' ';
        descriptionStrat += requestBody.typeStrategie ? '(' + EnumTypeStrategie[requestBody.typeStrategie] + ') ' : '';
        descriptionStrat += requestBody.sousSection ? '(' + EnumSousSectionStrategie[requestBody.sousSection] + ') ' : '';
        if (requestBody.moments) {
            let i = 1;
            descriptionStrat += '[';

            for (const mom of requestBody.moments) {
                descriptionStrat += mom.nom;
                if (i < requestBody.moments.length) {
                    descriptionStrat += ',';
                }
                i++;
            }

            descriptionStrat += ']';
        }

        this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier, 'Ajout de la stratégie :' + '\n' + descriptionStrat);
        return await this.strategieService.create(requestBody)
    }

    @ApiOperation({ title: 'Update strategie' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: Strategie, @Req() req) {
        // console.log(requestBody);
        const old = await this.strategieService.get(requestBody.id);

        let descriptionStrat = '';
        descriptionStrat += requestBody.reference + ' ';
        descriptionStrat += requestBody.typeStrategie ? '(' + EnumTypeStrategie[requestBody.typeStrategie] + ') ' : '';
        descriptionStrat += requestBody.sousSection ? '(' + EnumSousSectionStrategie[requestBody.sousSection] + ') ' : '';
        if (requestBody.moments) {
            let i = 1;
            descriptionStrat += '[';

            for (const mom of requestBody.moments) {
                descriptionStrat += mom.nom;
                if (i < requestBody.moments.length) {
                    descriptionStrat += ',';
                }
                i++;
            }

            descriptionStrat += ']';
        }

        let historique = '';

        if (old.reference && requestBody.reference && old.reference !== requestBody.reference) {
            historique += 'Modification de la référence stratégie : ' + old.reference
                + ' &#x2192; ' + requestBody.reference + '\n';
        }

        // Normalement on peut pas changer la sous-section d'une strat après sa création, donc pas histo

        if (old.version && requestBody.version && old.version !== requestBody.version) {
            historique += 'Modification de la version stratégie : ' + old.version
                + ' &#x2192; ' + requestBody.version + '\n';
        }

        if ((old.isCOFRAC && !requestBody.isCOFRAC) || (!old.isCOFRAC && requestBody.isCOFRAC)) {
            historique += 'Modification du statut COFRAC : ' + (old.isCOFRAC ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (requestBody.isCOFRAC ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.statut && !requestBody.statut) || (!old.statut && requestBody.statut)) {
            historique += 'Modification du statut stratégie : ' + EnumStatutStrategie[old.statut]
                + ' &#x2192; ' + EnumStatutStrategie[requestBody.statut] + '\n';
        }

        // Normalement on peut pas changer le type d'une strat après sa création, donc pas histo
        // idem chantier, moments, generated

        if (old.description && requestBody.description && old.description !== requestBody.description) {
            historique += 'Modification de la description stratégie : ' + old.description
                + ' &#x2192; ' + requestBody.description + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier,
                'Modification de la stratégie : ' + '\n' + descriptionStrat + '\n' + historique);
        }

        requestBody.idChantier = <number>requestBody.idChantier;
        return await this.strategieService.update(requestBody)
    }

    @ApiOperation({ title: 'generation devis' })
    @Get('generate-test/:idChantier')
    @Authorized([profils.ANIMATEUR_QUALITE, profils.SUPER_ADMIN])
    async generateTest(@Param() params, @Req() req) {
        // TODO : check droits
        const { data, chantier, nomFichier }: { data: any; chantier: Chantier; nomFichier: string; } =
                                                    await this.strategieService.getDataForStrategie(params, req);

        // console.log(data);
        return await this.generationService.generateDocx(data, EnumTypeTemplate.TEST_LABO_STRATEGIE, 'chantier',
            chantier.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CHANTIER_STRATEGIE, true);
    }

    @ApiOperation({ title: 'generation devis' })
    @Get('generate/:idChantier')
    @Authorized()
    async generate(@Param() params, @Req() req) {
        // TODO : check droits
        const { data, chantier, nomFichier }: { data: any; chantier: Chantier; nomFichier: string; } =
                                                    await this.strategieService.getDataForStrategie(params, req);

        // console.log(data);
        return await this.generationService.generateDocx(data, EnumTypeTemplate.LABO_STRATEGIE, 'chantier',
            chantier.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CHANTIER_STRATEGIE, true);
    }

    @ApiOperation({ title: 'Update strategie' })
    @Patch(':idStrategie')
    @Authorized()
    async partialUpdate(@Body() requestBody: Strategie) {
        // console.log(requestBody);
        requestBody.idChantier = <number>requestBody.idChantier;
        return await this.strategieService.update(requestBody)
    }

    @ApiOperation({ title: 'Delete 1 strategie en fonction de son id' })
    @Delete(':idStrategie')
    @Authorized()
    async delete(@Param() params, @Req() req) {
        const requestBody = await this.strategieService.get(params.idStrategie);
        let descriptionStrat = '';
        descriptionStrat += requestBody.reference + ' ';
        descriptionStrat += requestBody.typeStrategie ? '(' + EnumTypeStrategie[requestBody.typeStrategie] + ') ' : '';
        descriptionStrat += requestBody.sousSection ? '(' + EnumSousSectionStrategie[requestBody.sousSection] + ') ' : '';
        if (requestBody.moments) {
            let i = 1;
            descriptionStrat += '[';

            for (const mom of requestBody.moments) {
                descriptionStrat += mom.nom;
                if (i < requestBody.moments.length) {
                    descriptionStrat += ',';
                }
                i++;
            }

            descriptionStrat += ']';
        }

        this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier,
            'Suppression de la stratégie :' + '\n' + descriptionStrat);
        return await this.strategieService.delete(params.idStrategie)
    }
}
