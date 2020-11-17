import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    Req, FilesInterceptor, UploadedFiles
} from '@nestjs/common';
import { ApiOperation, ApiUseTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { apiPath } from '../api';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import {WebServiceService} from './web-service.service';
import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {extname} from 'path';
import { diskStorage } from 'multer';
import * as xmlConvert from 'xml-js';
import {ActiviteService} from '../activite/activite.service';
import {Activite} from '../activite/activite.entity';
import {EnumCategorie, EnumTypeFichier} from '@aleaac/shared';
import {Fichier} from '../fichier/fichier.entity';
import {FichierService} from '../fichier/fichier.service';
import {HistoriqueService} from '../historique/historique.service';
import * as fs from 'fs';
const JSZip = require('jszip');

@ApiUseTags('ws')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'ws'))
export class WebServiceController {
    enumCategorie = EnumCategorie;
    constructor(
        private webServiceService: WebServiceService,
        private passwordCryptographerServiceImpl: PasswordCryptographerServiceImpl,
        private activiteService: ActiviteService,
        private fichierService: FichierService,
        private historiqueService: HistoriqueService
    ) {}

    @ApiOperation({ title: 'login ws' })
    @ApiResponse({
        status: 200,
        description: 'Return User si connection ok'
    })
    @ApiResponse({ status: 400, description: 'Email ou mot de passe invalide.' })
    @Post('login')
    async login(@Body() requestBody) {

        const data: any = {};

        const user: any = await this.webServiceService.findUserByEmail(requestBody.email);

        if (!user || !await this.passwordCryptographerServiceImpl.doCompare(requestBody.mdp, user.motDePasse)) {
            data.msg = 'Email ou mot de passe invalide.';
            data.error = 'True';
        } else if (user.isSuspendu) {
            data.msg = 'Utilisateur désactivé.';
            data.error = 'True';
        } else {
            user.franchises = await this.webServiceService.getFranchiseByUser(user.id);
            data.user = user;
            data.msg = 'connection réussi!'
        }

        return data
    }

    @Post('findInterlocuteur')
    async findInterlocuteur(@Body() requestBody) {
        let idFranchise;
        if (requestBody.idFranchise) {
            idFranchise = requestBody.idFranchise
        } else {
            idFranchise = await this.webServiceService.getFranchiseByEmailUser(requestBody.emailUser);
        }

        let feedback;

        if (requestBody.emailInterlocuteur) {
            const interlocuteur = await this.webServiceService.findContactByEmail(requestBody.emailInterlocuteur, idFranchise);

            if (interlocuteur) {
                feedback = 'Interlocuteur: ' + interlocuteur.prenom + ' ' + interlocuteur.nom;

            } else {
                feedback = 'Interlocuteur: aucun';
            }
        } else {
            feedback = 'Interlocuteur: aucun';
        }

        if (requestBody.emailUser) {
            const user = await this.webServiceService.findUserByEmail(requestBody.emailUser);
            if (user) {
                feedback += '/User affecte: ' + user.prenom + ' ' + user.nom;

            } else {
                feedback += '/User affecte: aucun';
            }
        } else {
            feedback += '/User affecte: aucun';
        }
        return feedback;
    }

    @Post('uploadPaintDiag')
    @UseInterceptors(FilesInterceptor('file', 2, {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                // Generating a 32 random chars long string
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                // Calling the callback passing the random name generated with the original extension name
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))

    async createPaintDiag(@UploadedFiles() file, @Body() requestBody) {
        // console.log('in PaintDiag');
        // console.log(requestBody);
        const login = await this.login(requestBody);

        if (login.error) {
            return 'connexion refusé'
        } else {
            const user = login.user;
            // console.log(file);
            for (const f of file) {
                const fichier = new Fichier();
                fichier.idUtilisateur = user.id;
                fichier.extention = f.originalname.split('.').pop();
                fichier.keyDL = f.filename;
                fichier.date = new Date();
                fichier.idTypeFichier = fichier.extention === 'pg' || fichier.extention === 'PG'
                    ? EnumTypeFichier.ACTIVITE_PLAN
                    : EnumTypeFichier.CHANTIER_PLAN_PRELEVEMENTS;
                fichier.nom = f.originalname.split('.')[0];
                if (requestBody.idZoneIntervention && requestBody.idZoneIntervention !== 'null') {
                    fichier.application = 'zone-intervention';
                    fichier.idParent = requestBody.idZoneIntervention;
                }

                await this.fichierService.create(fichier, user);
            }


            return 'OK'
        }
    }

    @Post('crm')
    @UseInterceptors(FilesInterceptor('file', 10, {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                // Generating a 32 random chars long string
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                // Calling the callback passing the random name generated with the original extension name
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async create(@UploadedFiles() images, @Body() requestBody) {

        const data: any = {};

        const user: any = await this.webServiceService.findUserByEmail(requestBody.user);

        if (!user || !await this.passwordCryptographerServiceImpl.doCompare(requestBody.pwd, user.motDePasse)) {
            data.error = 'Email ou mot de passe invalide.';
        } else if (user.isSuspendu) {
            data.error = 'Utilisateur désactivé.';
        } else {
            data.msg = 'CRM OK!';
            const jsonXml = xmlConvert.xml2js(requestBody.xml, {compact: true});

            let mails = jsonXml['xml']['mails']['mail'];
            if (mails.length === undefined) {
                mails = [mails]
            }
            for (const mail of mails) {
                const activite = new Activite();
                activite.idFranchise = requestBody.idFranchise;
                activite.idUtilisateur = user.id;
                activite.idCategorie = this.enumCategorie.MAIL;
                activite.date = new Date().toISOString().substr(0, 19);
                activite.time = (('0' + (new Date().getHours())).slice(-2) + ':' + ('0' + (new Date().getMinutes())).slice(-2));
                activite.objet = mail._attributes.objetSujet;
                activite.contenu = mail._attributes.objetDescription.replace(/\*n/gi, '\n');
                const contact = await this.webServiceService.findContactByEmail(mail._attributes.from, requestBody.idFranchise);
                const compte = await this.webServiceService.findCompteByEmail(mail._attributes.from, requestBody.idFranchise);
                if (contact) {
                    activite.idContact = contact.id;
                } else {
                    if (compte && compte.compteContacts && compte.compteContacts.length > 0 && compte.compteContacts[0].contact) {
                        activite.idContact = compte.compteContacts[0].contact.id
                    }
                }
                const newActivite =  await this.activiteService.create(activite);

                await this.historiqueService.add(user.id, 'activite', newActivite.id, 'Création d\'une activité depuis outlook');

                if (mail._attributes.filenames) {
                    const fichier = new Fichier();
                    fichier.idUtilisateur = user.id;
                    fichier.nom = mail._attributes.filenames;
                    fichier.extention = 'msg';
                    fichier.application = 'activite';
                    fichier.idParent = newActivite.id;
                    const imageSelected = images.find((image) => {
                        return image.mimetype === mail._attributes.filenames.replace(/;/gi, '').toLowerCase()
                    });
                    fichier.keyDL = imageSelected.filename;
                    fichier.nom = imageSelected.mimetype.split('.')[0];
                    await this.fichierService.create(fichier, null);
                }
                return data;
            }
        }

    }

}


