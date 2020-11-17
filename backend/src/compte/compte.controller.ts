import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseInterceptors} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {CompteService} from './compte.service';
import {Authorized} from '../common/decorators/authorized.decorator';
import {Compte} from './compte.entity';
import {HistoriqueService} from '../historique/historique.service';
import {CompteContact} from '../compte-contact/compte-contact.entity';
import {GenerationService} from '../generation/generation.service';
import {profils} from '@aleaac/shared';

@ApiUseTags('compte')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'contact/compte'))
export class CompteController {
    constructor(
        private compteService: CompteService,
        private historiqueService: HistoriqueService,
        private generationService: GenerationService
    ) {}

    @ApiOperation({title: 'recupération de tout les compte d\'une franchise'})
    @Get('all/:idFranchise')
    @Authorized()
    async find(@Param() params, @Req() req) {
        return await this.compteService.getAll(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'recupération de tout les compte d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async count(@Param() params, @Req() req) {
        return await this.compteService.count(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'récupére le compte en fonction de son id'})
    @Get('/:idCompte')
    @Authorized()
    async findById(@Param() params) {
        return await this.compteService.findById(params.idCompte)
    }

    @ApiOperation({title: 'update compte'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Compte, @Req() request) {
        // console.log(requestBody);
        const oldCompte = await this.compteService.findById(requestBody.id);

        // On empêche de supprimer les comptesContact si le contact est déjà lié à autre chose via ce compte
        if (oldCompte.compteContacts !== requestBody.compteContacts) {
            const deleted = oldCompte.compteContacts.filter(cc => requestBody.compteContacts.indexOf(cc) === -1);
            // console.log(deleted);
            for (const del of deleted) {
                if (del.contact.isLinked) {
                    requestBody.compteContacts.push(del);
                }
            }
        }

        await this.compteService.update(requestBody);
        const compte = await this.compteService.findById(requestBody.id);
        // Historique
        if (
            oldCompte.adresse.adresse !== compte.adresse.adresse ||
            oldCompte.adresse.cp !== compte.adresse.cp ||
            oldCompte.adresse.ville !== compte.adresse.ville
        ) {
            this.historiqueService.add(request.user.id, 'compte', compte.id,
                'Modification de l\'adresse ' + oldCompte.adresse.adresse + ' ' + oldCompte.adresse.cp + ' '
                + oldCompte.adresse.ville + ' -> ' + compte.adresse.adresse + ' ' + compte.adresse.cp + ' ' + compte.adresse.ville)
        }
        if (oldCompte.adresse.email !== compte.adresse.email) {
            this.historiqueService.add(request.user.id, 'compte', compte.id,
                'Modification du mail ' + oldCompte.adresse.email + ' -> ' + compte.adresse.email
                )
        }
        if (oldCompte.adresse.telephone !== compte.adresse.telephone) {
            this.historiqueService.add(request.user.id, 'compte', compte.id,
                'Modification du mail ' + oldCompte.adresse.telephone + ' -> ' + compte.adresse.telephone
            )
        }

        if (oldCompte.grilleTarifs !== compte.grilleTarifs) {
            let histoTarif = '';
            for (const newGrilleTarif of compte.grilleTarifs) {
                const findGrilleTarif = oldCompte.grilleTarifs.find((grilleTarif) => {
                    return grilleTarif.id === newGrilleTarif.id
                });
                if (!findGrilleTarif) {
                    histoTarif += 'Ajout de la grille ' + newGrilleTarif.reference + '\n'
                }
            }

            for (const oldGrilleTarif of oldCompte.grilleTarifs) {
                const findGrilleTarif = compte.grilleTarifs.find((grilleTarif) => {
                    return grilleTarif.id === oldGrilleTarif.id
                });
                // console.log(findGrilleTarif);
                if (!findGrilleTarif) {
                    histoTarif += 'Suppresion de la grille ' + oldGrilleTarif.reference + '\n'
                }
            }
            if (histoTarif.length > 0) {
                this.historiqueService.add(request.user.id, 'compte', compte.id, histoTarif)
            }
        }

        if (oldCompte.compteContacts !== compte.compteContacts) {
            for (const newCompteContact of compte.compteContacts) {
                const findCompteContact = oldCompte.compteContacts.find((compteContact) => {
                    return compteContact.idCompte === newCompteContact.idCompte && compteContact.idContact === newCompteContact.idContact
                });
                if (findCompteContact) {
                    // si différent
                    if (
                        findCompteContact.bDemandeur !== newCompteContact.bDemandeur ||
                        findCompteContact.bRapport !== newCompteContact.bRapport ||
                        findCompteContact.bDevis !== newCompteContact.bDevis ||
                        findCompteContact.bFacture !== newCompteContact.bFacture ||
                        findCompteContact.bPrincipale !== newCompteContact.bPrincipale
                    ) {
                        this.historiqueService.add(request.user.id, 'compte', compte.id,
                         'Modification du contact id: ' + newCompteContact.idContact + ' ' + this.ajoutRoleContact(newCompteContact))
                    }
                } else {
                    // new compteContact
                    this.historiqueService.add(request.user.id, 'compte', compte.id,
                     'Liaison du contact id: ' + newCompteContact.idContact + ' ' + this.ajoutRoleContact(newCompteContact))
                }
            }
        }
        return compte;
    }

    ajoutRoleContact(compteContact: CompteContact) {
        let roles = '';
        if (compteContact.bPrincipale) {
            roles += (' - Contact principale\n')
        }
        if (compteContact.bFacture) {
            roles += (' - Contact facturation\n')
        }
        if (compteContact.bDevis) {
            roles += (' - Contact devis\n')
        }
        if (compteContact.bRapport) {
            roles += (' - Contact rapport\n')
        }
        if (compteContact.bDemandeur) {
            roles += (' - Contact demandeur\n')
        }
        if (roles !== '') {
            return 'avec les roles\n' + roles
        } else {
            return ''
        }
    }

    @ApiOperation({title: 'create compte'})
    @Post()
    @Authorized()
    async create(@Body() requestBody: Compte, @Req() request) {
        const compte = await this.compteService.create(requestBody);
        let historique = 'Création du compte : \n';
        if (compte.compteContacts && compte.compteContacts.length > 0) {
            historique += 'Contact(s) associé(s) : \n';
            for (const compteContact of requestBody.compteContacts) {
                historique += '- ' + compteContact.contact.nom + ' ( ' + compteContact.contact.id + ' ) : '
                    + this.ajoutRoleContact(compteContact);
                // console.log(compteContact)
            }
        }
        if (compte.grilleTarifs && compte.grilleTarifs.length > 0) {
            historique += 'Tarif(s) associé(s) : \n';
            for (const grilleTarif of compte.grilleTarifs) {
                historique += '- ' + grilleTarif.reference + ' ( ' + grilleTarif.id + ' )\n'
            }
        }
        if (historique.length > 0) {
            await this.historiqueService.add(request.user.id, 'compte', compte.id, historique);
        }
        return compte
    }

    @ApiOperation({title: 'get avec le prix'})
    @Get('with-tarif/:id')
    @Authorized()
    async getWithTarif(@Param() params) {
        return await this.compteService.getWithTarif(params.id);
    }

    @ApiOperation({title: 'Suppression compte'})
    @Delete(':id')
    @Authorized()
    async  delete(@Param() params) {
        return await this.compteService.delete(params.id)
    }

    @ApiOperation({title: 'Génération de l\'export'})
    @Get('generate/:idFranchise')
    @Authorized(profils.FRANCHISE)
    async generateXlsx(@Param() params, @Res() res) {
        const data = await this.compteService.getForXlsx(params.idFranchise);
        const header = ['Id', 'Raison Sociale', 'Qualité', 'Code Postal', 'Ville', 'adresse', 'Téléphone', 'Siret', 'Commentaire'];
        const datas = [];

        data.forEach((row) => {
            const rowToPush = [];
            rowToPush.push(row.id);
            rowToPush.push(row.raisonSociale);
            if (row.qualite) {
                rowToPush.push(row.qualite.nom);
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
            rowToPush.push(row.siret);
            rowToPush.push(row.commentaire);
            datas.push(rowToPush)
        });

        res.end(await this.generationService.generateXlsx(header, datas))
    }

    /*@ApiOperation({title: 'recupération du nombre d\'interlocuteur d\'une franchise'})
    @Get('count/:idFranchise')
    @Authorized()
    async count(@Param() params) {
        return await this.interlocuteurService.count(params.idFranchise)
    }*/
}
