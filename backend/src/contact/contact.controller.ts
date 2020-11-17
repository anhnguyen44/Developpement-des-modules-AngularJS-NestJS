import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put, Req, Res,
    UseInterceptors
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {ContactService} from './contact.service';
import {Authorized} from '../common/decorators/authorized.decorator';
import {Contact} from './contact.entity';
import {HistoriqueService} from '../historique/historique.service';
import {GenerationService} from '../generation/generation.service';
import {profils} from '@aleaac/shared';

@ApiUseTags('contact')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'contact'))
export class ContactController {
    constructor(
        private contactService: ContactService,
        private historiqueService: HistoriqueService,
        private generationService: GenerationService
    ) {}

    @ApiOperation({title: 'recupération de tout les contact d\'une franchise'})
    @Get('all/:idFranchise')
    @Authorized()
    async find(@Param() params, @Req() req) {

        return await this.contactService.getAll(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'Recupération de tous les contact d\'un compte'})
    @Get('allCompte/:idCompte')
    @Authorized()
    async findForCompte(@Param() params, @Req() req) {
        return await this.contactService.getAllForCompte(params.idCompte, req.query)
    }

    @ApiOperation({title: 'Compte de tous les contact d\'un compte'})
    @Get('countAllCompte/:idCompte')
    @Authorized()
    async countForCompte(@Param() params, @Req() req) {
        return await this.contactService.countAllForCompte(
            params.idCompte,
            req.query)
    }

    @ApiOperation({title: 'recupération de tout les contact d\'une franchise non lié à un compte'})
    @Get('allFree/:idFranchise')
    @Authorized()
    async findFree(@Param() params, @Req() req) {
        return await this.contactService.getAllFree(
            params.idFranchise,
            req.query)
    }

    @ApiOperation({title: 'count de tout les contact d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async count(@Param() params, @Req() req) {
        // console.log(req.query);
        return await this.contactService.countAll(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'count de tout les contact d\'une franchise non lié à un compte'})
    @Get('countAllFree/:idFranchise')
    @Authorized()
    async countFree(@Param() params, @Req() req) {
        return await this.contactService.countAllFree(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'récupére le contact en fonction de son id'})
    @Get('/:idContact')
    @Authorized()
    async findById(@Param() params) {
        return await this.contactService.findById(params.idContact)
    }

    @ApiOperation({title: 'recupération des secteur d\'une franchise'})
    @Get('secteur/:idFranchise')
    @Authorized()
    async findSecteur(@Param() params) {
        return await this.contactService.getSecteur(params.idFranchise)
    }

    @ApiOperation({title: 'update contact'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Contact, @Req() request) {
        const oldcontact = await this.contactService.findById(requestBody.id);
        if (requestBody.idUtilisateur && oldcontact.idUtilisateur !== requestBody.idUtilisateur) {
            let contactUser = await this.contactService.findByIdUser(requestBody.idUtilisateur);
            contactUser.idUtilisateur = null;
            await this.historiqueService.add(request.user.id, 'contact', oldcontact.id,
                'Modification de l\'utilisateur lié ' + oldcontact.idUtilisateur + ' -> ' + requestBody.idUtilisateur);
            if (contactUser) {
                await this.contactService.update(contactUser);
                await this.historiqueService.add(request.user.id, 'contact', contactUser.id,
                    'Supression de l\'utilisateur lié');
            }

        }
        const contact = await this.contactService.update(requestBody);
        if (!contact.compteContacts) {

        } else if (contact.compteContacts && !oldcontact.compteContacts) {
            await this.historiqueService.add(request.user.id, 'contact', contact.id,
                'Ajout entreprise parente id ' + contact.compteContacts.idCompte);
        } else if (contact.compteContacts.idCompte !== oldcontact.compteContacts.idCompte) {
            await this.historiqueService.add(request.user.id, 'contact', contact.id,
                'Modification entreprise parente id ' + oldcontact.compteContacts.idCompte + ' -> ' + contact.compteContacts.idCompte);
        }

        if (
            contact.adresse.adresse !== oldcontact.adresse.adresse ||
            contact.adresse.cp !== oldcontact.adresse.cp ||
            contact.adresse.ville !== oldcontact.adresse.ville
        ) {
            await this.historiqueService.add(request.user.id, 'contact', requestBody.id,
                'Modifification de l\'adresse ' + oldcontact.adresse.adresse + ' ' + oldcontact.adresse.cp + ' ' + oldcontact.adresse.ville + ' -> '
                + contact.adresse.adresse + ' ' + contact.adresse.cp + ' ' + contact.adresse.ville
            );
        }
        if (contact.adresse.email !== oldcontact.adresse.email) {
            await this.historiqueService.add(request.user.id, 'contact', requestBody.id,
                'Modifification de l\'email ' + oldcontact.adresse.email + ' -> ' + contact.adresse.email);
        }
        if (contact.adresse.telephone !== oldcontact.adresse.telephone) {
            await this.historiqueService.add(request.user.id, 'contact', requestBody.id,
                'Modifification du téléphone ' + oldcontact.adresse.telephone + ' -> ' + contact.adresse.telephone);
        }
        return contact
    }

    @ApiOperation({title: 'create contact'})
    @Post()
    @Authorized()
    async create(@Body() requestBody: Contact, @Req() request) {
        if (requestBody.idUtilisateur) {
            let contactUser = await this.contactService.findByIdUser(requestBody.idUtilisateur);
            if (contactUser) {
                contactUser.idUtilisateur = null;
                await this.contactService.update(contactUser);
                await this.historiqueService.add(request.user.id, 'contact', contactUser.id,
                    'Supression de l\'utilisateur lié');
            }
        }
        const contact = await this.contactService.create(requestBody);
        await this.historiqueService.add(request.user.id, 'contact', contact.id, 'Création du contact');
        if (requestBody.compteContacts && requestBody.compteContacts.compte.id) {
            await this.historiqueService.add(request.user.id, 'contact', contact.id, 'affectation entreprise parente');
        }
        if (requestBody.idUtilisateur) {
            await this.historiqueService.add(request.user.id, 'contact', contact.id,
                'Ajout de l\'utilisateur lié ' + requestBody.idUtilisateur);
        }
        return contact;
    }

    @ApiOperation({title: 'get avec le prix'})
    @Get('with-tarif/:id')
    @Authorized()
    async getWithTarif(@Param() params) {
        return await this.contactService.getWithTarif(params.id);
    }

    @ApiOperation({title: 'Génération de l\'export'})
    @Get('generate/:idFranchise')
    @Authorized(profils.FRANCHISE)
    async generateXlsx(@Param() params, @Res() res) {
        const data = await this.contactService.getForXlsx(params.idFranchise);
        const header = ['Id', 'Nom', 'Prénom', 'Civilité', 'Code Postal', 'Ville', 'adresse', 'Téléphone',
            'Commentaire', 'Prospect', 'Phase', 'Objectif', 'Potentiel', 'Qualification', 'Secteur',
            'Anniversaire', 'Editeur', 'Application'];
        const datas = [];

        data.forEach((row) => {
            const rowToPush = [];
            rowToPush.push(row.id);
            rowToPush.push(row.nom);
            rowToPush.push(row.prenom);
            if (row.civilite) {
                rowToPush.push(row.civilite.nom);
            } else {
                rowToPush.push('')
            }
            if (row.adresse) {
                rowToPush.push(row.adresse.cp);
                rowToPush.push(row.adresse.ville);
                rowToPush.push(row.adresse.adresse);
                rowToPush.push(row.adresse.telephone);
            } else {
                rowToPush.push('');
                rowToPush.push('');
                rowToPush.push('');
                rowToPush.push('');
            }
            rowToPush.push(row.commentaire);
            rowToPush.push(row.bProspect);
            rowToPush.push(row.phase);
            rowToPush.push(row.objectif);
            rowToPush.push(row.potentiel);
            rowToPush.push(row.qualification);
            rowToPush.push(row.secteur);
            rowToPush.push(row.anniversaire);
            rowToPush.push(row.editeur);
            rowToPush.push(row.application);
            datas.push(rowToPush)
        });

        res.end(await this.generationService.generateXlsx(header, datas))
    }
}
