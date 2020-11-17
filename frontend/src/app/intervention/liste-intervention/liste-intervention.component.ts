import { Component, Input, OnInit } from '@angular/core';
import { InterventionService } from '../intervention.service';
import { Intervention } from '../Intervention';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Franchise } from '../../resource/franchise/franchise';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { Order } from '../../resource/query-builder/order/Order';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { EnumStatutIntervention, MailFile } from '@aleaac/shared';
import { ChantierService } from '../../chantier/chantier.service';
import { FormBuilder } from '@angular/forms';
import { Chantier } from '../../chantier/Chantier';
import { Fichier } from '../../resource/fichier/Fichier';
import * as FileSaver from 'file-saver';
import { FichierService } from '../../resource/fichier/fichier.service';
import { NotificationService } from '../../notification/notification.service';
import { TypeFichierService } from '../../superadmin/typefichier/type-fichier.service';
import { TypeFichier } from '../../superadmin/typefichier/type-fichier/TypeFichier';
import { Mail } from '../../resource/mail/Mail';
import {PompeService} from '../../logistique/pompe.service';
import {FiltreService} from '../../logistique/filtre.service';
import {DebitmetreService} from '../../logistique/debitmetre.service';
import {RessourceHumaineService} from '../../logistique/ressource-humaine.service';

@Component({
    selector: 'app-liste-intervention',
    templateUrl: './liste-intervention.component.html',
    styleUrls: ['./liste-intervention.component.scss']
})
export class ListeInterventionComponent implements OnInit {
    @Input() idParent: number;
    @Input() application: string;
    @Input() redirectPath: (string | number)[];
    keys: any[];
    nbObjets: number;
    interventions: Intervention[];
    franchise: Franchise;
    queryBuild: QueryBuild = new QueryBuild();
    enumStatutIntervention = EnumStatutIntervention;
    chantier: Chantier;
    modalFichier: boolean = false;
    typeFichier: TypeFichier;
    mail: Mail | null;
    statutCible: any;

    headers: Order[] = [
        new Order('Ref', '', true, 'intervention.id'),
        new Order('Libellé', '', true, 'intervention.libelle'),
        new Order('Statut', '', true, 'intervention.idStatut'),
        new Order('Date Validation', '', true, 'intervention.dateValidation'),
        new Order('Rang', '', true, 'intervention.rang'),
        new Order('Action', 'action')
    ];
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Référence', 'text', 'intervention.id', true, true),
        new ChampDeRecherche('Libellé', 'text', 'intervention.libelle', true, true),
        new ChampDeRecherche('Statut', 'enum', 'intervention.idStatut', false, true, this.enumStatutIntervention)
    ];

    constructor(
        private interventionService: InterventionService,
        private franchiseService: FranchiseService,
        private router: Router,
        private menuService: MenuService,
        private chantierService: ChantierService,
        private fichierService: FichierService,
        private notificationService: NotificationService,
        private typeFichierService: TypeFichierService,
        private pompeService: PompeService,
        private filtreService: FiltreService,
        private debitMetreService: DebitmetreService,
        private ressourceHumaineService: RessourceHumaineService
    ) {
    }

    ngOnInit() {
        this.keys = Object.keys(this.enumStatutIntervention).filter(Number);
        this.typeFichierService.get(26).subscribe((typeFichier) => {
            this.typeFichier = typeFichier;
        });
        if (this.idParent && this.application) {
            this.queryBuild.idParent = this.idParent;
            if (this.application === 'chantier') {
                this.chantierService.get(this.idParent).subscribe((chantier) => {
                    this.chantier = chantier;
                });
                this.queryBuild.nomCleParent = 'intervention.idChantier';
            }
        } else {
            this.menuService.setMenu([['Intervention', '']]);
        }

        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.getAll();
        });
    }

    getAll() {
        if (this.application === 'chantier') {
            this.queryBuild.nomCleParent = 'intervention.idChantier';
            this.queryBuild.idParent = this.idParent;
        }
        this.interventionService.getAll(this.franchise.id, this.queryBuild).subscribe((interventions) => {
            this.interventions = interventions;
        });
    }

    countAll() {
        if (this.application === 'chantier') {
            this.queryBuild.nomCleParent = 'intervention.idChantier';
            this.queryBuild.idParent = this.idParent;
        }
        this.interventionService.countAll(this.franchise.id, this.queryBuild).subscribe((nbIntervention) => {
            this.nbObjets = nbIntervention;
        });
    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countAll();
        }
        this.getAll();
    }

    goTo(intervention) {
        if (this.redirectPath) {
            this.redirectPath.push(intervention.id);
            this.redirectPath.push('information');
            this.router.navigate(this.redirectPath);
        } else {
            this.router.navigate(['/intervention', intervention.id, 'information']);
        }
    }

    async goToNew() {
        console.log(await this.checkIfRessource());
        if (await this.checkIfRessource()) {
            if (this.redirectPath) {
                this.redirectPath.push('ajouter');
                this.router.navigate(this.redirectPath);
            } else {
                this.router.navigate(['/intervention', 'ajouter']);
            }
        }
    }

    openModalFichier() {
        this.modalFichier = true;
    }

    setOrdreInterventionValide(fichier) {
        this.chantier.idOrdreInterventionGlobalSigne = fichier.id;
        this.chantier.ordreInterventionGlobalSigne = fichier;
        this.chantierService.update(this.chantier).subscribe(() => {
            this.chantier.ordreInterventionGlobalSigne = fichier;
            this.notificationService.setNotification('success', ['Ordre d\'intervention global signé attaché au chantier.']);
            this.closeModalFichier();
        });
    }

    closeModalFichier() {
        this.modalFichier = false;
    }

    generateFullOI(idChantier) {
        this.chantierService.generateFullOI(idChantier).subscribe((fichier) => {
            this.chantier.ordreInterventionGlobal = fichier;
        });
    }

    telecharge(fichier: Fichier) {
        this.fichierService.get(fichier.keyDL).subscribe((file) => {
            const filename = fichier.nom + '.' + fichier.extention;
            FileSaver.saveAs(file, filename);
        });
    }

    envoyerMail() {
        this.chantierService.generateFullOI(this.chantier.id).subscribe((file) => {
            this.chantier.ordreInterventionGlobal = file;
            const mail = new Mail();
            mail.subject = 'Envoi de l\'ordre d\'intervention global du chantier' + this.chantier.nomChantier;
            mail.to = [''];
            mail.from = '';
            mail.attachments = [];
            mail.idParent = this.chantier.id;
            mail.application = 'ordre-intervention';
            const fileToSend = new MailFile();
            fileToSend.filename = file.nom + '.' + file.extention;
            fileToSend.path = './uploads/' + file.keyDL;
            mail.attachments.push(fileToSend);
            mail.template = 'blank';
            this.mail = mail;
        });
    }

    setCloseMail() {
        this.mail = null;
    }

    checkAll(event) {
        this.interventions.map((intervention) => {
            intervention.checked = event;
        });
    }

    isAllChecked() {
        if (this.interventions) {
            return this.interventions.every(intervention => intervention.checked);
        } else {
            return false;
        }
    }

    changeStatut() {
        for (const intervention of this.interventions) {
            if (intervention.checked) {
                intervention.idStatut = this.statutCible;
                this.interventionService.update(intervention).subscribe(() => {

                });
            }
        }
    }

    async checkIfRessource() {
        const erreurs: string[] = [];
        const promiseResult = new Promise((resolve, reject) => {
            this.pompeService.getAll(this.franchise.id, new QueryBuild(1)).subscribe((pompe) => {
                if (!pompe || pompe.length === 0) {
                    erreurs.push('Il faut au moins une pompe pour créer une intervention');
                }
                this.filtreService.getAll(this.franchise.id, new QueryBuild(1)).subscribe((filtre) => {
                    if (!filtre || filtre.length === 0) {
                        erreurs.push('Il faut au moins un filtre pour créer une intervention');
                    }
                    this.debitMetreService.getAll(this.franchise.id, new QueryBuild(1)).subscribe((debitMetre) => {
                        if (!debitMetre || debitMetre.length === 0) {
                            erreurs.push('Il faut au moins un débitmètre pour créer une intervention');
                        }
                        this.ressourceHumaineService.getAll(this.franchise.id, new QueryBuild(1)).subscribe((ressourceHumaine) => {
                            if (!ressourceHumaine || ressourceHumaine.length === 0) {
                                erreurs.push('Il faut au moins un technicien pour créer une intervention');
                            }
                            if (erreurs.length > 0) {
                                this.notificationService.setNotification('danger', erreurs);
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    });
                });
            });
        });
        return promiseResult;
    }

}
