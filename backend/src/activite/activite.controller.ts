import {Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, Req, Res} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HistoriqueService } from '../historique/historique.service';
import { Activite } from './activite.entity';
import { ActiviteService } from './activite.service';
import {profils} from '@aleaac/shared';
import {GenerationService} from '../generation/generation.service';


@ApiUseTags('activite')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'activite'))
export class ActiviteController {
    constructor(private activiteService: ActiviteService,
        private historiqueService: HistoriqueService,
                private generationService: GenerationService) {}

        // GetAll par type ou par franchise
    @ApiOperation({title: 'recupération de toute les activités d\'un compte'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        return await this.activiteService.getAll(params.idFranchise, req.query);
    }

    @ApiOperation({title: 'recupération de toute les activités d\'un compte'})
    @Get('compte/:idCompte')
    @Authorized()
    async findByCompte(@Param() params, @Req() req) {
        return await this.activiteService.getByCompte(params.idCompte, req.query)
    }

    @ApiOperation({title: 'recupération de toute les activités d\'un contact'})
    @Get('contact/:idContact')
    @Authorized()
    async findByContact(@Param() params, @Req() req) {
        return await this.activiteService.getByContact(params.idContact, req.query)
    }

    // Count All par type ou par franchise

    @ApiOperation({title: 'recupération de toute les activités d\'un compte'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        return await this.activiteService.countAll(params.idFranchise, req.query);
    }

    @ApiOperation({title: 'recupération de toute les activités d\'un compte'})
    @Get('count/compte/:idCompte')
    @Authorized()
    async countByCompte(@Param() params, @Req() req) {
        return await this.activiteService.countByCompte(params.idCompte, req.query)
    }

    @ApiOperation({title: 'recupération de toute les activités d\'un contact'})
    @Get('count/contact/:idContact')
    @Authorized()
    async countByContact(@Param() params, @Req() req) {
        return await this.activiteService.countByContact(params.idContact, req.query)
    }

    @ApiOperation({title: 'recupération d\'une activité'})
    @Get(':idActivite')
    @Authorized()
    async find(@Param() params) {
        return await this.activiteService.get(params.idActivite)
    }

    @ApiOperation({title: 'Création d\'une activité'})
    @Post()
    @Authorized()
    async create(@Body() requestBody: Activite, @Req() req) {
        const result =  await this.activiteService.create(requestBody);
        this.historiqueService.add(req.user.id, 'activite', result.id, 'Création activité');
        return result;
    }

    @ApiOperation({title: 'update d\'une activité'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Activite, @Req() req) {
        const oldActivite = await this.activiteService.get(requestBody.id);
        let historique = '';
        if (requestBody != oldActivite) {
            /*if (requestBody.adresse.telephone !== oldActivite.adresse.telephone) {
                historique += 'Modfication du téléphone : ' + oldActivite.adresse.telephone + ' => ' + requestBody.adresse.telephone + '\n'
            }
            if (requestBody.adresse.email !== oldActivite.adresse.email) {
                historique += 'Modfication du mail : ' + oldActivite.adresse.email + ' => ' + requestBody.adresse.email + '\n'
            }*/
            if (requestBody.contact && oldActivite.contact && requestBody.contact.id !== oldActivite.contact.id) {
                historique += 'Modfication de la cible : ' + oldActivite.contact.nom + ' => ' + requestBody.contact.nom + '\n'
            }
            if (requestBody.utilisateur && oldActivite.utilisateur && requestBody.utilisateur.id !== oldActivite.utilisateur.id) {
                historique += 'Modfication de l\'utilisateur : ' + oldActivite.utilisateur.nom + ' => ' + requestBody.utilisateur.nom + '\n'
            }
            if (requestBody.objet !== oldActivite.objet) {
                historique += 'Modfication de l\'objet : ' + oldActivite.objet + ' => ' + requestBody.objet + '\n'
            }
            if (requestBody.contenu !== oldActivite.contenu) {
                historique += 'Modfication du contenu : ' + oldActivite.contenu + ' => ' + requestBody.contenu + '\n'
            }
            if (requestBody.adresse.cp !== oldActivite.adresse.cp ||
                requestBody.adresse.ville !== oldActivite.adresse.ville ||
                requestBody.adresse.adresse !== oldActivite.adresse.adresse
            ) {
                historique += 'Modfication de l\'adresse : '
                    + oldActivite.adresse.adresse + ' '
                    + oldActivite.adresse.cp + ' '
                    + oldActivite.adresse.ville + ' => '
                    + requestBody.adresse.adresse
                    + requestBody.adresse.cp + ' '
                    + requestBody.adresse.ville + '\n'
            }
        }
        if (historique) {
            this.historiqueService.add(req.user.id, 'activite', requestBody.id, historique)
        }
        return await this.activiteService.update(requestBody)
    }

    @ApiOperation({title: 'Delete d\'une activité'})
    @Delete(':id')
    @Authorized()
    async delete(@Param() params) {
        return await this.activiteService.delete(params.id);
    }

    @ApiOperation({title: 'Génération de l\'export'})
    @Get('generateXlsx/:idFranchise')
    @Authorized(profils.FRANCHISE)
    async generateXlsx(@Param() params, @Res() res) {
        const data = await this.activiteService.getForXlsx(params.idFranchise);
        const header = ['Id', 'Nom Contact', 'Prénom contact',
            'Nom utilisateur', 'Prénom utilisateur', 'Catégorie',
            'adresse', 'Cp', 'Ville',
            'Date', 'Heure', 'Durée',
            'Objet', 'Contenu'
        ];
        const datas = [];

        data.forEach((row) => {
            const rowToPush = [];
            rowToPush.push(row.id);
            if (row.contact) {
                rowToPush.push(row.contact.nom);
                rowToPush.push(row.contact.prenom);
            } else {
                rowToPush.push('');
                rowToPush.push('');
            }
            if (row.utilisateur) {
                rowToPush.push(row.utilisateur.nom);
                rowToPush.push(row.utilisateur.prenom);
            } else {
                rowToPush.push('');
                rowToPush.push('');
            }
            if (row.categorie) {
                rowToPush.push(row.categorie.nom);
            } else {
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
            rowToPush.push(row.date);
            rowToPush.push(row.time);
            rowToPush.push(row.duree);
            rowToPush.push(row.objet);
            rowToPush.push(row.contenu);
            datas.push(rowToPush)
        });

        res.end(await this.generationService.generateXlsx(header, datas))
    }
}
