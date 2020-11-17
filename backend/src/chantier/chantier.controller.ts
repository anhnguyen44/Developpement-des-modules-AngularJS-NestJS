import { Controller, Get, UseInterceptors, Param, Req, Post, Body, Put, Patch, Delete, UnauthorizedException } from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Authorized } from '../common/decorators/authorized.decorator';
import { ChantierService } from './chantier.service';
import { Chantier } from './chantier.entity';
import { GenerationService } from '../generation/generation.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { HistoriqueService } from '../historique/historique.service';
import { Rights } from '../common/decorators/rights.decorator';
import { ContactChantierService } from '../contact-chantier/contact-chantier.service';
import { DevisCommandeService } from '../devis-commande/devis-commande.service';
import { DevisCommande } from '../devis-commande/devis-commande.entity';
import { FindManyOptions } from 'typeorm';
import * as dateFns from 'date-fns';
import { EnumTypePrelevement, EnumImportanceNotification,
    EnumStatutStrategie, EnumStatutCommande, EnumTypeTemplate, EnumTypeFichier } from '@aleaac/shared';
import { NotificationService } from '../notification/notification.service';
import { MailService } from '../mail/mail.service';
import { StrategieService } from '../strategie/strategie.service';
import { Notification } from '../notification/notification.entity';
import { Config } from '../config/Config';
import * as path from 'path';
import { Mail } from '../mail/mail.entity';
import { TypeContactChantierService } from '../type-contact-chantier/type-contact-chantier.service';
import { ContactService } from '../contact/contact.service';
import { FichierService } from '../fichier/fichier.service';

@ApiUseTags('chantier')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'chantier'))

export class ChantierController {
    enumTypePrelevement = EnumTypePrelevement;
    private readonly config: Config;

    constructor(
        private chantierService: ChantierService,
        private devisCommandeService: DevisCommandeService,
        private serviceUser: UtilisateurService,
        private contactChantierService: ContactChantierService,
        private generationService: GenerationService,
        private notificationService: NotificationService,
        private mailService: MailService,
        private strategieService: StrategieService,
        private historiqueService: HistoriqueService,
        private typeContactChantierService: TypeContactChantierService,
        private contactService: ContactService,
        private fichierService: FichierService,
    ) {
        const nodeEnv = process.env.NODE_ENV || 'development';
        const propertiesFolder = path.resolve(process.cwd(), 'properties');
        this.config = require(`${propertiesFolder}/${nodeEnv}.properties.json`);
    }

    @ApiOperation({ title: 'Récupération de toute les chantier d\'une franchise' })
    @Get('all/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], params.idFranchise)) {
            return await this.chantierService.getAll(params.idFranchise, req.query);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération nombre chantier par franchise' })
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], params.idFranchise)) {
            return await this.chantierService.countAll(params.idFranchise, req.query);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération d\'un chantier en fonction de son id' })
    @Get('get-simple/:idChantier')
    @Authorized()
    async getSimple(@Param() params, @Req() req) {
        const chantier = await this.chantierService.getSimple(params.idChantier);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], chantier.idFranchise)) {
            return chantier;
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération d\'un chantier en fonction de son id' })
    @Get(':idChantier')
    @Authorized()
    async get(@Param() params, @Req() req) {
        const chantier = await this.chantierService.get(params.idChantier);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], chantier.idFranchise)) {
            return chantier;
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération des zone d\'intervention du chantier' })
    @Get('getZI/:idChantier')
    @Authorized()
    async getZoneIntervention(@Param() params, @Req() req) {
        return await this.chantierService.getZI(params.idChantier);
    }

    @ApiOperation({ title: 'Valide strategie' })
    @Post('validate/:idChantier')
    @Authorized()
    @Rights(['STRAT_VALIDATE'])
    async validate(@Body() requestBody: Chantier, @Req() req, @Param() params) {
        requestBody.id = <number>requestBody.id;

        const user = await this.serviceUser.findOneById(requestBody.idRedacteurStrategie, false, true);

        // On génère la stratégie
        const { data, chantier, nomFichier }: { data: any; chantier: Chantier; nomFichier: string; } =
                                            await this.strategieService.getDataForStrategie(params, req);
        const toto = await this.generationService.generateDocx(data, EnumTypeTemplate.LABO_STRATEGIE, 'chantier',
            chantier.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CHANTIER_STRATEGIE, true);
        const fichierStrat = await this.fichierService.getLastByType('chantier', params.idChantier, EnumTypeFichier.CHANTIER_STRATEGIE);
        const urlFichierStrat = this.config.site.apiUrl + '/fichier/affiche/' + fichierStrat.keyDL;

        if (!this.serviceUser.hasRightOnFranchise(user, 'STRAT_VALIDATE', requestBody.idFranchise)) {
            // On fait une notif
            const notif: Notification = new Notification();
            notif.destinataires = [requestBody.redacteurStrategie];
            notif.importance = EnumImportanceNotification.FAIBLE;
            notif.dateEnvoi = new Date();
            notif.lien = '' + '/chantier/' + requestBody.id + '/strategie/liste';
            notif.contenu = 'Votre stratégie a été approuvée par ' + requestBody.valideurStrategie.prenom
                            + ' ' + requestBody.valideurStrategie.nom + '.';
            notif.contenu += '&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-check" style="color: green;"></i>';
            this.notificationService.create(notif);

            try {
                // On envoi le mail
                const mail: Mail = new Mail();
                mail.from = 'notification@aleacontroles.com';
                mail.to = [requestBody.redacteurStrategie.login];
                mail.subject = 'Votre stratégie a été validée';
                mail.template = 'strategie-validee';

                // On met toutes les valeurs à remplacer (clef/valeur) dans le template
                const data2: Map<string, string> = new Map<string, string>();
                data2.set('civilite', requestBody.redacteurStrategie.civilite.nom);
                data2.set('nom', requestBody.redacteurStrategie.nom);
                data2.set('prenom', requestBody.redacteurStrategie.prenom);
                data2.set('civiliteValideur', requestBody.valideurStrategie.civilite.nom);
                data2.set('prenomValideur', requestBody.valideurStrategie.prenom);
                data2.set('nomValideur', requestBody.valideurStrategie.nom);
                data2.set('urlDownloadStrategie', urlFichierStrat);
                data2.set('urlStrategie', this.config.site.url + '/chantier/' + requestBody.id + '/strategie/liste');

                // On convertit en objet pour le transfer par POST, sinon ça envoie vide
                const convMap = {};
                data2.forEach((val: string, key: string) => {
                    convMap[key] = val;
                });

                mail.dataList = convMap;
                await this.mailService.sendMail(mail);
            } catch (err) {
                console.error(err);
            }
        }

        for (const strat of requestBody.strategies) {
            strat.statut = EnumStatutStrategie.STRAT_VALIDEE;
            await this.strategieService.update(strat);
        }
        requestBody.versionStrategie++;
        await this.chantierService.update(requestBody, req);

        this.historiqueService.add(req.user.id, 'chantier', requestBody.id, 'Stratégie validée.');
        return requestBody;
    }

    @ApiOperation({ title: 'Demande la validation strategie' })
    @Post('askValidation/:idChantier')
    @Authorized()
    async askValidation(@Body() requestBody: Chantier, @Req() req, @Param() params) {
        requestBody.id = <number>requestBody.id;

        // On génère la stratégie
        const { data, chantier, nomFichier }: { data: any; chantier: Chantier; nomFichier: string; } =
                                            await this.strategieService.getDataForStrategie(params, req);
        const toto = await this.generationService.generateDocx(data, EnumTypeTemplate.LABO_STRATEGIE, 'chantier',
            chantier.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CHANTIER_STRATEGIE, true);
        const fichierStrat = await this.fichierService.getLastByType('chantier', params.idChantier, EnumTypeFichier.CHANTIER_STRATEGIE);
        const urlFichierStrat = this.config.site.apiUrl + '/fichier/affiche/' + fichierStrat.keyDL;

        // On fait une notif
        const notif: Notification = new Notification();
        notif.idDemandeur = req.user.id;
        notif.idValideur = requestBody.idValideurStrategie;
        notif.importance = EnumImportanceNotification.MAX;
        notif.dateEnvoi = new Date();
        notif.lien = '' + '/chantier/' + requestBody.id + '/strategie/liste';
        notif.contenu = 'Vous avez une nouvelle stratégie à approuver. Demandé par ' + req.user.prenom + ' ' + req.user.nom;
        if (requestBody.client.compteContacts.compte) {
            notif.contenu += ' pour le client ';
            notif.contenu += requestBody.client.compteContacts.compte.raisonSociale;
            notif.contenu += '.';
        } else if (requestBody.client.compteContacts) {
            notif.contenu += ' pour le client particulier ';
            notif.contenu += requestBody.client.compteContacts.contact.nom;
            notif.contenu += '.';
        } else {
            notif.contenu += '.';
        }
        notif.contenu += '&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-exclamation" style="color: orange;"></i>';
        this.notificationService.create(notif);

        // On envoi le mail
        try {
            const mail: Mail = new Mail();
            mail.from = 'notification@aleacontroles.com';
            mail.to = [requestBody.valideurStrategie.login];
            mail.subject = 'Une stratégie est en attente de validation';
            mail.template = 'valider-strategie';

            // On met toutes les valeurs à remplacer (clef/valeur) dans le template
            const data2: Map<string, string> = new Map<string, string>();
            data2.set('civilite', requestBody.valideurStrategie.civilite.nom);
            data2.set('nom', requestBody.valideurStrategie.nom);
            data2.set('prenom', requestBody.valideurStrategie.prenom);
            data2.set('civiliteRedacteur', req.user.civilite.nom);
            data2.set('nomRedacteur', req.user.nom);
            data2.set('prenomRedacteur', req.user.prenom);
            data2.set('urlDownloadStrategie', urlFichierStrat);
            data2.set('urlValidateStrategie', this.config.site.url + '/chantier/' + requestBody.id + '/strategie/liste');

            // On convertit en objet pour le transfer par POST, sinon ça envoie vide
            const convMap = {};
            data2.forEach((val: string, key: string) => {
                convMap[key] = val;
            });

            mail.dataList = convMap;
            await this.mailService.sendMail(mail);
        } catch (err) {
            console.error(err);
        }

        for (const strat of requestBody.strategies) {
            strat.statut = EnumStatutStrategie.STRAT_A_VALIDER;
            await this.strategieService.update(strat);
        }

        this.historiqueService.add(req.user.id, 'chantier', requestBody.id, 'Validation de la stratégie demandée.');
        return requestBody;
    }

    @ApiOperation({ title: 'Unlock strategie' })
    @Post('unlock/:idChantier')
    @Authorized()
    async unlock(@Body() requestBody: Chantier, @Req() req) {
        for (const strat of requestBody.strategies) {
            strat.statut = EnumStatutStrategie.STRAT_A_REALISER;
            await this.strategieService.update(strat);
        }

        this.historiqueService.add(req.user, 'chantier', requestBody.id,
            'Stratégie dévérouillée. Elle n\'est plus considérée comme validée.');
        return requestBody;
    }

    @ApiOperation({ title: 'Création chantier' })
    @Post()
    @Authorized()
    @Rights(['CMD_CREATE'])
    async create(@Body() requestBody: Chantier, @Req() req) {
        try {
            // On enlève les liens contact-chantier "orphelins"
            const tmp = await this.contactChantierService.find({ where: { idChantier: null } }).then(data => {
                data.forEach(conchan => {
                    this.contactChantierService.remove(conchan.id);
                });
            });
        } catch (err) {
            console.warn(err);
        }

        return await this.chantierService.create(requestBody, req)
    }

    @ApiOperation({ title: 'Maj chantier' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: Chantier, @Req() req) {
        const chantier = await this.chantierService.get(requestBody.id);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_CREATE'], chantier.idFranchise)) {
            // historiques
            let historique = '';
            // INFORMATION
            if (requestBody.reference && chantier.reference !== requestBody.reference) {
                historique += 'Changement de référence : ' + chantier.reference + ' &#x2192; ' + requestBody.reference + '\n';
            }

            if (requestBody.idFranchise && chantier.idFranchise !== requestBody.idFranchise) {
                if (requestBody.franchise && requestBody.franchise.raisonSociale) {
                    historique += 'Changement de franchise : '
                        + chantier.franchise.raisonSociale + ' &#x2192; ' + requestBody.franchise.raisonSociale + '\n';
                } else {
                    historique += 'Changement de franchise : ' + chantier.idFranchise + ' &#x2192; ' + requestBody.idFranchise + '\n';
                }
            } else if (requestBody.franchise && requestBody.franchise.raisonSociale && requestBody.franchise.id !== chantier.idFranchise) {
                historique += 'Changement de franchise : '
                    + chantier.franchise.raisonSociale + ' &#x2192; ' + requestBody.franchise.raisonSociale + '\n';
            }

            if (requestBody.idBureau && chantier.idBureau !== requestBody.idBureau) {
                if (requestBody.bureau && requestBody.bureau.nom) {
                    historique += 'Changement de bureau : ' + chantier.bureau.nom + ' &#x2192; ' + requestBody.bureau.nom + '\n';
                } else {
                    historique += 'Changement de bureau : ' + chantier.idBureau + ' &#x2192; ' + requestBody.idBureau + '\n';
                }
            } else if (requestBody.bureau && requestBody.bureau.nom && requestBody.bureau.id !== chantier.idBureau) {
                historique += 'Changement de bureau : ' + chantier.bureau.nom + ' &#x2192; ' + requestBody.bureau.nom + '\n';
            }

            if (requestBody.nomChantier && chantier.nomChantier !== requestBody.nomChantier) {
                historique += 'Changement de nom du chantier : ' + chantier.nomChantier + ' &#x2192; ' + requestBody.nomChantier + '\n';
            }

            // CONTACTS
            if (requestBody.idClient && chantier.idClient !== requestBody.idClient) {
                if (requestBody.client && requestBody.client.nom) {
                    historique += 'Changement de client : ';
                    if (chantier.client && chantier.client.nom) {
                        historique += chantier.client.nom + ' ' + chantier.client.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.client.nom + ' ' + requestBody.client.prenom + '\n';
                } else {
                    historique += 'Changement de client : ' + chantier.idClient + ' &#x2192; ' + requestBody.idClient + '\n';
                }
            } else if (requestBody.client && requestBody.client.nom && requestBody.client.id !== chantier.idClient) {
                historique += 'Changement de client : ';
                if (chantier.client && chantier.client.nom) {
                    historique += chantier.client.nom + ' ' + chantier.client.prenom;
                }
                historique += ' &#x2192; ' + requestBody.client.nom + ' ' + requestBody.client.prenom + '\n';
            }



            const typesContact = await this.typeContactChantierService.find();
            for (const type of typesContact) {
                if (chantier.contacts && chantier.contacts.findIndex(c => c.idTypeContact === type.id) > -1
                    && requestBody.contacts && requestBody.contacts.findIndex(c => c.idTypeContact === type.id) > -1) {
                    const old = chantier.contacts.find(c => c.idTypeContact === type.id);
                    const nouveau = requestBody.contacts.find(c => c.idTypeContact === type.id);
                    nouveau.contact = await this.contactService.findById(nouveau.idContact);

                    if (old.contact && nouveau.contact && old.idContact !== nouveau.idContact) {
                        historique += 'Changement de ' + type.nom + ' : ';
                        historique += old.contact.nom + ' ' + old.contact.prenom;
                        historique += ' &#x2192; ' + nouveau.contact.nom + ' ' + nouveau.contact.prenom + '\n';
                    }
                }
            }

            if (requestBody.idChargeClient && chantier.idChargeClient !== requestBody.idChargeClient) {
                if (requestBody.chargeClient && requestBody.chargeClient.nom) {
                    historique += 'Changement de chargé de clientèle : ';
                    if (chantier.chargeClient && chantier.chargeClient.nom) {
                        historique += chantier.chargeClient.nom + ' ' + chantier.chargeClient.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.chargeClient.nom + ' ' + requestBody.chargeClient.prenom + '\n';
                } else {
                    historique += 'Changement de chargé de clientèle : '
                        + chantier.idChargeClient + ' &#x2192; ' + requestBody.idChargeClient + '\n';
                }
            } else if (requestBody.chargeClient && requestBody.chargeClient.nom
                && requestBody.chargeClient.id !== chantier.idChargeClient) {
                historique += 'Changement de chargé de clientèle : ';
                if (chantier.chargeClient && chantier.chargeClient.nom) {
                    historique += chantier.chargeClient.nom + ' ' + chantier.chargeClient.prenom;
                }
                historique += ' &#x2192; ' + requestBody.chargeClient.nom + ' ' + requestBody.chargeClient.prenom + '\n';
            }

            if (requestBody.idRedacteurStrategie && chantier.idRedacteurStrategie !== requestBody.idRedacteurStrategie) {
                if (requestBody.redacteurStrategie && requestBody.redacteurStrategie.nom) {
                    historique += 'Changement de rédacteur de stratégie : ';
                    if (chantier.redacteurStrategie && chantier.redacteurStrategie.nom) {
                        historique += chantier.redacteurStrategie.nom + ' ' + chantier.redacteurStrategie.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.redacteurStrategie.nom + ' ' + requestBody.redacteurStrategie.prenom + '\n';
                } else {
                    historique += 'Changement de rédacteur de stratégie : '
                        + chantier.idRedacteurStrategie + ' &#x2192; ' + requestBody.idRedacteurStrategie + '\n';
                }
            } else if (requestBody.redacteurStrategie && requestBody.redacteurStrategie.nom
                && requestBody.redacteurStrategie.id !== chantier.idRedacteurStrategie) {
                historique += 'Changement de rédacteur de stratégie : ';
                if (chantier.redacteurStrategie && chantier.redacteurStrategie.nom) {
                    historique += chantier.redacteurStrategie.nom + ' ' + chantier.redacteurStrategie.prenom;
                }
                historique += ' &#x2192; ' + requestBody.redacteurStrategie.nom + ' ' + requestBody.redacteurStrategie.prenom + '\n';
            }

            if (requestBody.idValideurStrategie && chantier.idValideurStrategie !== requestBody.idValideurStrategie) {
                if (requestBody.valideurStrategie && requestBody.valideurStrategie.nom) {
                    historique += 'Changement de valideur de stratégie : ';
                    if (chantier.valideurStrategie && chantier.valideurStrategie.nom) {
                        historique += chantier.valideurStrategie.nom + ' ' + chantier.valideurStrategie.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.valideurStrategie.nom + ' ' + requestBody.valideurStrategie.prenom + '\n';
                } else {
                    historique += 'Changement de valideur de stratégie : '
                        + chantier.idValideurStrategie + ' &#x2192; ' + requestBody.idValideurStrategie + '\n';
                }
            } else if (requestBody.valideurStrategie && requestBody.valideurStrategie.nom
                && requestBody.valideurStrategie.id !== chantier.idValideurStrategie) {
                historique += 'Changement de valideur de stratégie : ';
                if (chantier.valideurStrategie && chantier.valideurStrategie.nom) {
                    historique += chantier.valideurStrategie.nom + ' ' + chantier.valideurStrategie.prenom;
                }
                historique += ' &#x2192; ' + requestBody.valideurStrategie.nom + ' ' + requestBody.valideurStrategie.prenom + '\n';
            }

            if (requestBody.idTarif && chantier.idTarif !== requestBody.idTarif) {
                if (requestBody.tarif && requestBody.tarif.reference) {
                    historique += 'Changement de tarif : ';
                    if (chantier.tarif && chantier.tarif.reference) {
                        historique += chantier.tarif.reference;
                    }
                    historique += ' &#x2192; ' + requestBody.tarif.reference + '\n';
                } else {
                    historique += 'Changement de tarif : '
                        + chantier.idTarif + ' &#x2192; ' + requestBody.idTarif + '\n';
                }
            } else if (requestBody.tarif && requestBody.tarif.reference
                && requestBody.tarif.id !== chantier.idTarif) {
                historique += 'Changement de tarif : ';
                if (chantier.tarif && chantier.tarif.reference) {
                    historique += chantier.tarif.reference;
                }
                historique += ' &#x2192; ' + requestBody.tarif.reference + '\n';
            }

            // STATUT
            if (requestBody.idStatut && chantier.idStatut !== requestBody.idStatut) {
                historique += 'Changement de statut : '
                    + EnumStatutCommande[chantier.idStatut] + ' &#x2192; ' + EnumStatutCommande[requestBody.idStatut] + '\n';
            }

            if (requestBody.raisonStatutCommande && chantier.raisonStatutCommande !== requestBody.raisonStatutCommande) {
                historique += 'Changement de raisonStatutCommande : '
                    + chantier.raisonStatutCommande + ' &#x2192; ' + requestBody.raisonStatutCommande + '\n';
            }

            if (requestBody.idMotifAbandonCommande && chantier.idMotifAbandonCommande !== requestBody.idMotifAbandonCommande) {
                if (requestBody.motifAbandonCommande && requestBody.motifAbandonCommande.nom) {
                    historique += 'Changement de motifAbandonCommande : ';
                    if (chantier.motifAbandonCommande && chantier.motifAbandonCommande.nom) {
                        historique += chantier.motifAbandonCommande.nom;
                    }
                    historique += ' &#x2192; ' + requestBody.motifAbandonCommande.nom + '\n';
                } else {
                    historique += 'Changement de motifAbandonCommande : '
                        + chantier.idMotifAbandonCommande + ' &#x2192; ' + requestBody.idMotifAbandonCommande + '\n';
                }
            } else if (requestBody.motifAbandonCommande && requestBody.motifAbandonCommande.nom
                && requestBody.motifAbandonCommande.id !== chantier.idMotifAbandonCommande) {
                historique += 'Changement de motifAbandonCommande : ';
                if (chantier.motifAbandonCommande && chantier.motifAbandonCommande.nom) {
                    historique += chantier.motifAbandonCommande.nom;
                }
                historique += ' &#x2192; ' + requestBody.motifAbandonCommande.nom + '\n';
            }

            // DATES
            if (requestBody.dateReceptionDemande && chantier.dateReceptionDemande !== requestBody.dateReceptionDemande) {
                historique += 'Changement de dateReceptionDemande : '
                    + chantier.dateReceptionDemande + ' &#x2192; ' + requestBody.dateReceptionDemande + '\n';
            }

            if (requestBody.dateDevisSouhaitee && chantier.dateDevisSouhaitee !== requestBody.dateDevisSouhaitee) {
                historique += 'Changement de dateDevisSouhaitee : '
                    + chantier.dateDevisSouhaitee + ' &#x2192; ' + requestBody.dateDevisSouhaitee + '\n';
            }

            if (requestBody.dateStrategieSouhaitee && chantier.dateStrategieSouhaitee !== requestBody.dateStrategieSouhaitee) {
                historique += 'Changement de dateStrategieSouhaitee : '
                    + chantier.dateStrategieSouhaitee + ' &#x2192; ' + requestBody.dateStrategieSouhaitee + '\n';
            }

            if (requestBody.dateDernierPrelevement && chantier.dateDernierPrelevement !== requestBody.dateDernierPrelevement) {
                historique += 'Changement de dateDernierPrelevement : '
                    + chantier.dateDernierPrelevement + ' &#x2192; ' + requestBody.dateDernierPrelevement + '\n';
            }

            if (requestBody.dateCommande && chantier.dateCommande !== requestBody.dateCommande) {
                historique += 'Changement de dateCommande : ' + chantier.dateCommande + ' &#x2192; ' + requestBody.dateCommande + '\n';
            }

            if (requestBody.dateEmissionRapport && chantier.dateEmissionRapport !== requestBody.dateEmissionRapport) {
                historique += 'Changement de dateEmissionRapport : '
                    + chantier.dateEmissionRapport + ' &#x2192; ' + requestBody.dateEmissionRapport + '\n';
            }

            if (requestBody.dateMiseADispoDernierRE && chantier.dateMiseADispoDernierRE !== requestBody.dateMiseADispoDernierRE) {
                historique += 'Changement de dateMiseADispoDernierRE : '
                    + chantier.dateMiseADispoDernierRE + ' &#x2192; ' + requestBody.dateMiseADispoDernierRE + '\n';
            }

            if (requestBody.debutPeriodeIntervention && chantier.debutPeriodeIntervention !== requestBody.debutPeriodeIntervention) {
                historique += 'Changement de debutPeriodeIntervention : '
                    + chantier.debutPeriodeIntervention + ' &#x2192; ' + requestBody.debutPeriodeIntervention + '\n';
            }

            if (requestBody.finPeriodeIntervention && chantier.finPeriodeIntervention !== requestBody.finPeriodeIntervention) {
                historique += 'Changement de finPeriodeIntervention : '
                    + chantier.finPeriodeIntervention + ' &#x2192; ' + requestBody.finPeriodeIntervention + '\n';
            }

            if (requestBody.datePreviDemarrage && chantier.datePreviDemarrage !== requestBody.datePreviDemarrage) {
                historique += 'Changement de datePreviDemarrage : '
                    + chantier.datePreviDemarrage + ' &#x2192; ' + requestBody.datePreviDemarrage + '\n';
            }

            if (requestBody.datePreviFinChantier && chantier.datePreviFinChantier !== requestBody.datePreviFinChantier) {
                historique += 'Changement de datePreviFinChantier : '
                    + chantier.datePreviFinChantier + ' &#x2192; ' + requestBody.datePreviFinChantier + '\n';
            }

            // ORDRE D'INTERVENTION
            if (requestBody.idOrdreInterventionGlobal && chantier.idOrdreInterventionGlobal !== requestBody.idOrdreInterventionGlobal) {
                historique += 'Changement de idOrdreInterventionGlobal : '
                    + chantier.idOrdreInterventionGlobal + ' &#x2192; ' + requestBody.idOrdreInterventionGlobal + '\n';
            }

            if (requestBody.idOrdreInterventionGlobalSigne
                && chantier.idOrdreInterventionGlobalSigne !== requestBody.idOrdreInterventionGlobalSigne) {
                historique += 'Changement de idOrdreInterventionGlobalSigne : '
                    + chantier.idOrdreInterventionGlobalSigne + ' &#x2192; ' + requestBody.idOrdreInterventionGlobalSigne + '\n';
            }

            if (historique.length > 0) {
                this.historiqueService.add(req.user.id, 'chantier', requestBody.id, 'Modification chantier : \n' + historique)
            }

            const result = await this.chantierService.update(requestBody, req);

            try {
                // On enlève les liens contact-chantier "orphelins"
                const tmp = await this.contactChantierService.find({ where: { idChantier: null } }).then(data => {
                    data.forEach(conchan => {
                        this.contactChantierService.remove(conchan.id);
                    });
                });
            } catch (err) {
                console.warn(err);
            }

            return result;
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Maj chantier' })
    @Patch()
    @Authorized()
    async updatePartial(@Body() requestBody: Chantier, @Req() req) {
        const chantier = await this.chantierService.get(requestBody.id);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_CREATE'], chantier.idFranchise)) {
            // historiques
            let historique = '';
            // INFORMATION
            if (requestBody.reference && chantier.reference !== requestBody.reference) {
                historique += 'Changement de référence : ' + chantier.reference + ' &#x2192; ' + requestBody.reference + '\n';
            }

            if (requestBody.idFranchise && chantier.idFranchise !== requestBody.idFranchise) {
                if (requestBody.franchise && requestBody.franchise.raisonSociale) {
                    historique += 'Changement de franchise : '
                        + chantier.franchise.raisonSociale + ' &#x2192; ' + requestBody.franchise.raisonSociale + '\n';
                } else {
                    historique += 'Changement de franchise : ' + chantier.idFranchise + ' &#x2192; ' + requestBody.idFranchise + '\n';
                }
            } else if (requestBody.franchise && requestBody.franchise.raisonSociale && requestBody.franchise.id !== chantier.idFranchise) {
                historique += 'Changement de franchise : '
                    + chantier.franchise.raisonSociale + ' &#x2192; ' + requestBody.franchise.raisonSociale + '\n';
            }

            if (requestBody.idBureau && chantier.idBureau !== requestBody.idBureau) {
                if (requestBody.bureau && requestBody.bureau.nom) {
                    historique += 'Changement de bureau : ' + chantier.bureau.nom + ' &#x2192; ' + requestBody.bureau.nom + '\n';
                } else {
                    historique += 'Changement de bureau : ' + chantier.idBureau + ' &#x2192; ' + requestBody.idBureau + '\n';
                }
            } else if (requestBody.bureau && requestBody.bureau.nom && requestBody.bureau.id !== chantier.idBureau) {
                historique += 'Changement de bureau : ' + chantier.bureau.nom + ' &#x2192; ' + requestBody.bureau.nom + '\n';
            }

            if (requestBody.nomChantier && chantier.nomChantier !== requestBody.nomChantier) {
                historique += 'Changement de nom du chantier : ' + chantier.nomChantier + ' &#x2192; ' + requestBody.nomChantier + '\n';
            }

            // CONTACTS
            if (requestBody.idClient && chantier.idClient !== requestBody.idClient) {
                if (requestBody.client && requestBody.client.nom) {
                    historique += 'Changement de client : ';
                    if (chantier.client && chantier.client.nom) {
                        historique += chantier.client.nom + ' ' + chantier.client.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.client.nom + ' ' + requestBody.client.prenom + '\n';
                } else {
                    historique += 'Changement de client : ' + chantier.idClient + ' &#x2192; ' + requestBody.idClient + '\n';
                }
            } else if (requestBody.client && requestBody.client.nom && requestBody.client.id !== chantier.idClient) {
                historique += 'Changement de client : ';
                if (chantier.client && chantier.client.nom) {
                    historique += chantier.client.nom + ' ' + chantier.client.prenom;
                }
                historique += ' &#x2192; ' + requestBody.client.nom + ' ' + requestBody.client.prenom + '\n';
            }



            const typesContact = await this.typeContactChantierService.find();
            for (const type of typesContact) {
                if (chantier.contacts && chantier.contacts.findIndex(c => c.idTypeContact === type.id) > -1
                    && requestBody.contacts && requestBody.contacts.findIndex(c => c.idTypeContact === type.id) > -1) {
                    const old = chantier.contacts.find(c => c.idTypeContact === type.id);
                    const nouveau = requestBody.contacts.find(c => c.idTypeContact === type.id);
                    nouveau.contact = await this.contactService.findById(nouveau.idContact);

                    historique += 'Changement de ' + type.nom + ' : ';
                    if (old.contact && nouveau.contact && old.idContact !== nouveau.idContact) {
                        historique += old.contact.nom + ' ' + old.contact.prenom;
                        historique += ' &#x2192; ' + nouveau.contact.nom + ' ' + nouveau.contact.prenom + '\n';
                    }
                }
            }

            if (requestBody.idChargeClient && chantier.idChargeClient !== requestBody.idChargeClient) {
                if (requestBody.chargeClient && requestBody.chargeClient.nom) {
                    historique += 'Changement de chargé de clientèle : ';
                    if (chantier.chargeClient && chantier.chargeClient.nom) {
                        historique += chantier.chargeClient.nom + ' ' + chantier.chargeClient.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.chargeClient.nom + ' ' + requestBody.chargeClient.prenom + '\n';
                } else {
                    historique += 'Changement de chargé de clientèle : '
                        + chantier.idChargeClient + ' &#x2192; ' + requestBody.idChargeClient + '\n';
                }
            } else if (requestBody.chargeClient && requestBody.chargeClient.nom
                && requestBody.chargeClient.id !== chantier.idChargeClient) {
                historique += 'Changement de chargé de clientèle : ';
                if (chantier.chargeClient && chantier.chargeClient.nom) {
                    historique += chantier.chargeClient.nom + ' ' + chantier.chargeClient.prenom;
                }
                historique += ' &#x2192; ' + requestBody.chargeClient.nom + ' ' + requestBody.chargeClient.prenom + '\n';
            }

            if (requestBody.idRedacteurStrategie && chantier.idRedacteurStrategie !== requestBody.idRedacteurStrategie) {
                if (requestBody.redacteurStrategie && requestBody.redacteurStrategie.nom) {
                    historique += 'Changement de rédacteur de stratégie : ';
                    if (chantier.redacteurStrategie && chantier.redacteurStrategie.nom) {
                        historique += chantier.redacteurStrategie.nom + ' ' + chantier.redacteurStrategie.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.redacteurStrategie.nom + ' ' + requestBody.redacteurStrategie.prenom + '\n';
                } else {
                    historique += 'Changement de rédacteur de stratégie : '
                        + chantier.idRedacteurStrategie + ' &#x2192; ' + requestBody.idRedacteurStrategie + '\n';
                }
            } else if (requestBody.redacteurStrategie && requestBody.redacteurStrategie.nom
                && requestBody.redacteurStrategie.id !== chantier.idRedacteurStrategie) {
                historique += 'Changement de rédacteur de stratégie : ';
                if (chantier.redacteurStrategie && chantier.redacteurStrategie.nom) {
                    historique += chantier.redacteurStrategie.nom + ' ' + chantier.redacteurStrategie.prenom;
                }
                historique += ' &#x2192; ' + requestBody.redacteurStrategie.nom + ' ' + requestBody.redacteurStrategie.prenom + '\n';
            }

            if (requestBody.idValideurStrategie && chantier.idValideurStrategie !== requestBody.idValideurStrategie) {
                if (requestBody.valideurStrategie && requestBody.valideurStrategie.nom) {
                    historique += 'Changement de valideur de stratégie : ';
                    if (chantier.valideurStrategie && chantier.valideurStrategie.nom) {
                        historique += chantier.valideurStrategie.nom + ' ' + chantier.valideurStrategie.prenom;
                    }
                    historique += ' &#x2192; ' + requestBody.valideurStrategie.nom + ' ' + requestBody.valideurStrategie.prenom + '\n';
                } else {
                    historique += 'Changement de valideur de stratégie : '
                        + chantier.idValideurStrategie + ' &#x2192; ' + requestBody.idValideurStrategie + '\n';
                }
            } else if (requestBody.valideurStrategie && requestBody.valideurStrategie.nom
                && requestBody.valideurStrategie.id !== chantier.idValideurStrategie) {
                historique += 'Changement de valideur de stratégie : ';
                if (chantier.valideurStrategie && chantier.valideurStrategie.nom) {
                    historique += chantier.valideurStrategie.nom + ' ' + chantier.valideurStrategie.prenom;
                }
                historique += ' &#x2192; ' + requestBody.valideurStrategie.nom + ' ' + requestBody.valideurStrategie.prenom + '\n';
            }

            if (requestBody.idTarif && chantier.idTarif !== requestBody.idTarif) {
                if (requestBody.tarif && requestBody.tarif.reference) {
                    historique += 'Changement de tarif : ';
                    if (chantier.tarif && chantier.tarif.reference) {
                        historique += chantier.tarif.reference;
                    }
                    historique += ' &#x2192; ' + requestBody.tarif.reference + '\n';
                } else {
                    historique += 'Changement de tarif : '
                        + chantier.idTarif + ' &#x2192; ' + requestBody.idTarif + '\n';
                }
            } else if (requestBody.tarif && requestBody.tarif.reference
                && requestBody.tarif.id !== chantier.idTarif) {
                historique += 'Changement de tarif : ';
                if (chantier.tarif && chantier.tarif.reference) {
                    historique += chantier.tarif.reference;
                }
                historique += ' &#x2192; ' + requestBody.tarif.reference + '\n';
            }

            // STATUT
            if (requestBody.idStatut && chantier.idStatut !== requestBody.idStatut) {
                historique += 'Changement de statut : '
                    + EnumStatutCommande[chantier.idStatut] + ' &#x2192; ' + EnumStatutCommande[requestBody.idStatut] + '\n';
            }

            if (requestBody.raisonStatutCommande && chantier.raisonStatutCommande !== requestBody.raisonStatutCommande) {
                historique += 'Changement de raisonStatutCommande : '
                    + chantier.raisonStatutCommande + ' &#x2192; ' + requestBody.raisonStatutCommande + '\n';
            }

            if (requestBody.idMotifAbandonCommande && chantier.idMotifAbandonCommande !== requestBody.idMotifAbandonCommande) {
                if (requestBody.motifAbandonCommande && requestBody.motifAbandonCommande.nom) {
                    historique += 'Changement de motifAbandonCommande : ';
                    if (chantier.motifAbandonCommande && chantier.motifAbandonCommande.nom) {
                        historique += chantier.motifAbandonCommande.nom;
                    }
                    historique += ' &#x2192; ' + requestBody.motifAbandonCommande.nom + '\n';
                } else {
                    historique += 'Changement de motifAbandonCommande : '
                        + chantier.idMotifAbandonCommande + ' &#x2192; ' + requestBody.idMotifAbandonCommande + '\n';
                }
            } else if (requestBody.motifAbandonCommande && requestBody.motifAbandonCommande.nom
                && requestBody.motifAbandonCommande.id !== chantier.idMotifAbandonCommande) {
                historique += 'Changement de motifAbandonCommande : ';
                if (chantier.motifAbandonCommande && chantier.motifAbandonCommande.nom) {
                    historique += chantier.motifAbandonCommande.nom;
                }
                historique += ' &#x2192; ' + requestBody.motifAbandonCommande.nom + '\n';
            }

            // DATES
            if (requestBody.dateReceptionDemande && chantier.dateReceptionDemande !== requestBody.dateReceptionDemande) {
                historique += 'Changement de dateReceptionDemande : '
                    + chantier.dateReceptionDemande + ' &#x2192; ' + requestBody.dateReceptionDemande + '\n';
            }

            if (requestBody.dateDevisSouhaitee && chantier.dateDevisSouhaitee !== requestBody.dateDevisSouhaitee) {
                historique += 'Changement de dateDevisSouhaitee : '
                    + chantier.dateDevisSouhaitee + ' &#x2192; ' + requestBody.dateDevisSouhaitee + '\n';
            }

            if (requestBody.dateStrategieSouhaitee && chantier.dateStrategieSouhaitee !== requestBody.dateStrategieSouhaitee) {
                historique += 'Changement de dateStrategieSouhaitee : '
                    + chantier.dateStrategieSouhaitee + ' &#x2192; ' + requestBody.dateStrategieSouhaitee + '\n';
            }

            if (requestBody.dateDernierPrelevement && chantier.dateDernierPrelevement !== requestBody.dateDernierPrelevement) {
                historique += 'Changement de dateDernierPrelevement : '
                    + chantier.dateDernierPrelevement + ' &#x2192; ' + requestBody.dateDernierPrelevement + '\n';
            }

            if (requestBody.dateCommande && chantier.dateCommande !== requestBody.dateCommande) {
                historique += 'Changement de dateCommande : ' + chantier.dateCommande + ' &#x2192; ' + requestBody.dateCommande + '\n';
            }

            if (requestBody.dateEmissionRapport && chantier.dateEmissionRapport !== requestBody.dateEmissionRapport) {
                historique += 'Changement de dateEmissionRapport : '
                    + chantier.dateEmissionRapport + ' &#x2192; ' + requestBody.dateEmissionRapport + '\n';
            }

            if (requestBody.dateMiseADispoDernierRE && chantier.dateMiseADispoDernierRE !== requestBody.dateMiseADispoDernierRE) {
                historique += 'Changement de dateMiseADispoDernierRE : '
                    + chantier.dateMiseADispoDernierRE + ' &#x2192; ' + requestBody.dateMiseADispoDernierRE + '\n';
            }

            if (requestBody.debutPeriodeIntervention && chantier.debutPeriodeIntervention !== requestBody.debutPeriodeIntervention) {
                historique += 'Changement de debutPeriodeIntervention : '
                    + chantier.debutPeriodeIntervention + ' &#x2192; ' + requestBody.debutPeriodeIntervention + '\n';
            }

            if (requestBody.finPeriodeIntervention && chantier.finPeriodeIntervention !== requestBody.finPeriodeIntervention) {
                historique += 'Changement de finPeriodeIntervention : '
                    + chantier.finPeriodeIntervention + ' &#x2192; ' + requestBody.finPeriodeIntervention + '\n';
            }

            if (requestBody.datePreviDemarrage && chantier.datePreviDemarrage !== requestBody.datePreviDemarrage) {
                historique += 'Changement de datePreviDemarrage : '
                    + chantier.datePreviDemarrage + ' &#x2192; ' + requestBody.datePreviDemarrage + '\n';
            }

            if (requestBody.datePreviFinChantier && chantier.datePreviFinChantier !== requestBody.datePreviFinChantier) {
                historique += 'Changement de datePreviFinChantier : '
                    + chantier.datePreviFinChantier + ' &#x2192; ' + requestBody.datePreviFinChantier + '\n';
            }


            // ORDRE D'INTERVENTION
            if (requestBody.idOrdreInterventionGlobal && chantier.idOrdreInterventionGlobal !== requestBody.idOrdreInterventionGlobal) {
                historique += 'Changement de idOrdreInterventionGlobal : '
                    + chantier.idOrdreInterventionGlobal + ' &#x2192; ' + requestBody.idOrdreInterventionGlobal + '\n';
            }

            if (requestBody.idOrdreInterventionGlobalSigne
                && chantier.idOrdreInterventionGlobalSigne !== requestBody.idOrdreInterventionGlobalSigne) {
                historique += 'Changement de idOrdreInterventionGlobalSigne : '
                    + chantier.idOrdreInterventionGlobalSigne + ' &#x2192; ' + requestBody.idOrdreInterventionGlobalSigne + '\n';
            }

            if (historique.length > 0) {
                this.historiqueService.add(req.user.id, 'chantier', requestBody.id, 'Modification chantier : \n' + historique)
            }

            const result = await this.chantierService.partialUpdate(requestBody, req);

            try {
                // On enlève les liens contact-chantier "orphelins"
                const tmp = await this.contactChantierService.find({ where: { idChantier: null } }).then(data => {
                    data.forEach(conchan => {
                        this.contactChantierService.remove(conchan.id);
                    });
                });
            } catch (err) {
                console.warn(err);
            }

            return result;
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Delete chantier' })
    @Delete(':id')
    @Authorized()
    async delete(@CurrentUtilisateur() user, @Param() params, @Req() req) {
        const chantier = await this.chantierService.get(params.id);
        if (this.serviceUser.hasRightOnFranchise(user, ['CMD_TEST'], chantier.idFranchise)) {
            const options: FindManyOptions<DevisCommande> = {
                where: {
                    idChantier: params.id
                }
            }
            // Il faut enlever le lien des commandes vers ce chantier
            // C'est pas une FK pour pouvoir le gérer à la main
            const devisCommandes: DevisCommande[] = await this.devisCommandeService.find(options);
            for (const devis of devisCommandes) {
                const toto = new DevisCommande();
                toto.id = devis.id;
                toto.idChantier = null;
                await this.devisCommandeService.partialUpdate(toto, req);
            }
            return await this.chantierService.delete(user, params.id);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'generateOI' })
    @Get('generateOI/:idChantier')
    @Authorized()
    async generateOI(@Param() params, @Req() req) {
        const chantier = await this.chantierService.getForGenerate(params.idChantier);
        const interventions: any = chantier.interventions;

        for (const intervention of interventions) {

            // parse la date
            intervention.dateDebutParse = dateFns.format(intervention.rendezVous.dateHeureDebut, 'DD/MM/YYYY à hh:mm');
            intervention.dateFinParse = dateFns.format(intervention.rendezVous.dateHeureFin, 'DD/MM/YYYY à hh:mm');

            const prelevements = intervention.prelevements;
            // parse le type de prelevement
            prelevements.map((prelevement) => {
                prelevement.typePompe = this.enumTypePrelevement[prelevement.idTypePrelevement]
            });

            // tri des prelevement par objectif
            intervention.objectifs = [];
            for (const prelevement of intervention.prelevements) {
                const findedObjectif = intervention.objectifs.find((objectif) => {
                    return objectif.id === prelevement.objectif.id
                });
                if (findedObjectif) {
                    findedObjectif.prelevements.push(prelevement);
                } else {
                    intervention.objectifs.push({ objectif: prelevement.objectif, prelevements: [prelevement] })
                }
            }
        }

        const client = chantier.client;
        const compte = client.compteContacts.compte;

        // console.log(client);

        const data: any = {
            interventions: interventions,
            client: client,
            compte: compte,
            chantier: chantier,
            bureau: chantier.bureau,
            dateGeneration: dateFns.format(new Date(), 'DD/MM/YYYY')
        };

        const file = await this.generationService.generateDocx(
            data,
            'ordreIntervention.docx',
            'chantier',
            params.idChantier, req.user.id,
            'ordre-intervention-global' + params.idChantier,
            req.user,
            true,
            25
        );

        chantier.idOrdreInterventionGlobal = file.id;
        await this.chantierService.update(chantier, req);

        return file;
    }

    @ApiOperation({ title: 'generateStratGlobale' })
    @Get('generateStratGlobale/:idChantier')
    @Authorized()
    async generateStratGlobale(@Param() params, @Req() req) {
        const { data, chantier, nomFichier }:
        { data: any; chantier: Chantier; nomFichier: string; } = await this.strategieService.getDataForStrategie(params, req);

        // console.log(data);
        return await this.generationService.generateDocx(data, EnumTypeTemplate.LABO_STRATEGIE, 'chantier',
            chantier.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CHANTIER_STRATEGIE, true);
    }

    // TODO !!!
    @ApiOperation({ title: 'generateStratBySite' })
    @Get('generateStratBySite/:idChantier/:idSite')
    @Authorized()
    async generateStratBySite(@Param() params, @Req() req) {
        const chantier = await this.chantierService.getForGenerate(params.idChantier);
        const interventions: any = chantier.interventions;

        for (const intervention of interventions) {

            // parse la date
            intervention.dateDebutParse = dateFns.format(intervention.rendezVous.dateHeureDebut, 'DD/MM/YYYY à hh:mm');
            intervention.dateFinParse = dateFns.format(intervention.rendezVous.dateHeureFin, 'DD/MM/YYYY à hh:mm');

            const prelevements = intervention.prelevements;
            // parse le type de prelevement
            prelevements.map((prelevement) => {
                prelevement.typePompe = this.enumTypePrelevement[prelevement.idTypePrelevement]
            });

            // tri des prelevement par objectif
            intervention.objectifs = [];
            for (const prelevement of intervention.prelevements) {
                const findedObjectif = intervention.objectifs.find((objectif) => {
                    return objectif.id === prelevement.objectif.id
                });
                if (findedObjectif) {
                    findedObjectif.prelevements.push(prelevement);
                } else {
                    intervention.objectifs.push({ objectif: prelevement.objectif, prelevements: [prelevement] })
                }
            }
        }

        const client = chantier.client;
        const compte = client.compteContacts.compte;

        // console.log(client);

        const data: any = {
            interventions: interventions,
            client: client,
            compte: compte,
            chantier: chantier,
            bureau: chantier.bureau,
            dateGeneration: dateFns.format(new Date(), 'DD/MM/YYYY')
        };

        const file = await this.generationService.generateDocx(
            data,
            'ordreIntervention.docx',
            'chantier',
            params.idChantier, req.user.id,
            'OI-global-' + chantier.franchise.trigramme + '-' + params.idChantier,
            req.user,
            true,
            23
        );

        chantier.idOrdreInterventionGlobal = file.id;
        await this.chantierService.update(chantier, req);

        return file;
    }

    @ApiOperation({ title: 'import PaintDiag' })
    @Get('importPaintDiag/:idChantier')
    @Authorized()
    async imporPaintDiag(@Param() params) {
        const chantier: any = await this.chantierService.importPaintDiag(params.idChantier);
        chantier.zones = await this.chantierService.getZI(chantier.id);
        // console.log(chantier);
        return chantier;
    }
}