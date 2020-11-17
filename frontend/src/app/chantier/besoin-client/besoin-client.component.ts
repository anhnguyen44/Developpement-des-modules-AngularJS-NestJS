import { BesoinClientLabo, EnumTypeBesoinLabo, Objectif, EnumTypeFichierGroupe } from '@aleaac/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { Franchise } from '../../resource/franchise/franchise';
import { Chantier } from '../Chantier';
import { ChantierService } from '../chantier.service';
import { MomentObjectif } from '@aleaac/shared';
import { ObjectifService } from '../../resource/objectif/objectif.service';
import { BesoinClientLaboService } from '../../resource/besoin-client/besoin-client.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import { Fichier } from '../../resource/fichier/Fichier';
import { EnumTypeFichier } from '@aleaac/shared';



@Component({
    selector: 'app-besoin-client',
    templateUrl: './besoin-client.component.html',
    styleUrls: ['./besoin-client.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class BesoinClientComponent implements OnInit {
    id: number;
    chantier: Chantier;
    franchise: Franchise;
    submitted: boolean = false;
    besoinClient: BesoinClientLabo;

    formBesoin: FormGroup;
    formObjectifCT: FormGroup;
    formObjectifCSP: FormGroup;

    enumTypeC: EnumTypeBesoinLabo;
    listeObjectifsHorsTravaux: Objectif[] = new Array<Objectif>();
    listeObjectifsPendantTravaux: Objectif[] = new Array<Objectif>();
    listeMomentsObjectifsHorsTravaux: MomentObjectif[] = new Array<MomentObjectif>();
    listeMomentsObjectifsPendantTravaux: MomentObjectif[] = new Array<MomentObjectif>();
    listeObjectifParMoment: Array<Array<Objectif>> = new Array<Array<Objectif>>();
    modalSiteIntervention: boolean = false;
    displayFichiers: boolean = false;
    displayInfos: boolean = false;
    // PDRE (SS3), Liste Processus, Mode Opératoire, PIC, Planning des informations, Repérage amiante, Photos, Plans, PDRE (CSP)
    documentsPresents: Array<boolean> = [false, false, false, false, false, false, false, false, false, false];
    fichiers: Fichier[];
    groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.CHANTIER;

    constructor(
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private objectifService: ObjectifService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private besoinClientService: BesoinClientLaboService,
        private router: Router,
        private formBuilder: FormBuilder,
        private fichierService: FichierService,
    ) {
        this.formObjectifCT = this.formBuilder.group({
            G: [null, null],
            AnnexeB_F1_6Pt0: [null, null],
            AnnexeB_F7Pt0: [null, null],
            AnnexeB_F8Pt0: [null, null],
            AnnexeB_F9Pt0: [null, null],
            AnnexeB_F10Pt0: [null, null],
            AnnexeB_F12Pt0: [null, null],
            H: [null, null],
            I: [null, null],
            J: [null, null],
            K: [null, null],
            L: [null, null],
            M: [null, null],
            MExt: [null, null],
            N: [null, null],
            O: [null, null],
            P: [null, null],
            Q: [null, null],
            R: [null, null],
            S: [null, null],
            AnnexeB_F1: [null, null],
            AnnexeB_F2: [null, null],
            AnnexeB_F3: [null, null],
            AnnexeB_F4: [null, null],
            AnnexeB_F5: [null, null],
            AnnexeB_F6: [null, null],
            AnnexeB_F7: [null, null],
            AnnexeB_F8: [null, null],
            AnnexeB_F9: [null, null],
            AnnexeB_F10: [null, null],
            AnnexeB_F12: [null, null],
            T: [null, null],
            U: [null, null],
            V: [null, null],
            W: [null, null],
            X: [null, null],
        });
        this.formObjectifCSP = this.formBuilder.group({
            A: [null, null],
            B: [null, null],
            C: [null, null],
            D: [null, null],
            E: [null, null],
            F: [null, null],
            AnnexeB_F14: [null, null],
            AnnexeB_F15: [null, null],
            AnnexeB_F16: [null, null],
            AnnexeB_F17: [null, null],
            AnnexeB_F15Pt0: [null, null],
            AnnexeB_F16Pt0: [null, null],
            Y: [null, null],
        });

        this.formBesoin = this.formBuilder.group({
            id: [null, null],
            dateDemande: [, Validators.required],
            dateDemandeSS4: ['',],
            adresseMission: ['',],
            idTypeBesoinLabo: [, Validators.required],
            ss3: ['', null],
            ss4: ['', null],
            perimetreGlobal: ['', null],
            objectifs: ['', null],
            commentaires: ['', null],
            descriptifChantier: ['', null],
            effectifPrevu: ['', null],
            objectifsCT: this.formObjectifCT,
            objectifsCSP: this.formObjectifCSP
        });
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.id = params.id;
            this.objectifService.getHorsTravaux().subscribe(oht => {
                this.listeObjectifsHorsTravaux = oht;
                for (const objHT of this.listeObjectifsHorsTravaux) {
                    if (!this.listeMomentsObjectifsHorsTravaux.some(moht => moht.id === objHT.idMomentObjectif)) {
                        this.listeMomentsObjectifsHorsTravaux.push(objHT.momentObjectif);
                    }
                    if (!this.listeObjectifParMoment[objHT.idMomentObjectif]) {
                        this.listeObjectifParMoment[objHT.idMomentObjectif] = new Array<Objectif>();
                    }
                    this.listeObjectifParMoment[objHT.idMomentObjectif].push(objHT);
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });

            this.objectifService.getPendantTravaux().subscribe(opt => {
                this.listeObjectifsPendantTravaux = opt;
                for (const objPT of this.listeObjectifsPendantTravaux) {
                    if (!this.listeMomentsObjectifsPendantTravaux.some(moht => moht.id === objPT.idMomentObjectif)) {
                        this.listeMomentsObjectifsPendantTravaux.push(objPT.momentObjectif);
                    }
                    if (!this.listeObjectifParMoment[objPT.idMomentObjectif]) {
                        this.listeObjectifParMoment[objPT.idMomentObjectif] = new Array<Objectif>();
                    }
                    this.listeObjectifParMoment[objPT.idMomentObjectif].push(objPT);
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });


            if (this.id) {
                this.chantierService.get(this.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier/liste'],
                        ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.id + '/informations'],
                        ['Besoin client', '']
                    ]);
                    if (!this.chantier.besoinClient) {
                        this.chantier.besoinClient = new BesoinClientLabo();
                        this.chantier.besoinClient.idTypeBesoinLabo = EnumTypeBesoinLabo.CODE_TRAVAIL.valueOf();
                        this.chantier.besoinClient.dateDemande = new Date().toISOString().substr(0, 10);
                        this.chantier.besoinClient.dateDemandeSS4 = new Date().toISOString().substr(0, 10);
                    }

                    this.updateDocumentsFournis();

                    this.besoinClient = this.chantier.besoinClient;
                    this.formBesoin.patchValue(this.chantier.besoinClient);
                    console.log(this.chantier);

                    if (this.formBesoin.controls['idTypeBesoinLabo'].value! === 1
                        || this.formBesoin.controls['idTypeBesoinLabo'].value! === '1'
                        || this.formBesoin.controls['idTypeBesoinLabo'].value! === EnumTypeBesoinLabo.CODE_TRAVAIL) {
                        // console.log('CT');
                        if (this.besoinClient && this.besoinClient.objectifs) {
                            for (const obj of this.besoinClient.objectifs) {
                                // console.log(obj.code);
                                if (obj.idType === EnumTypeBesoinLabo.CODE_TRAVAIL) {
                                    this.formObjectifCT.controls[obj.code].setValue(true);
                                }
                            }
                        }
                    } else if (this.formBesoin.controls['idTypeBesoinLabo'].value! === 2
                        || this.formBesoin.controls['idTypeBesoinLabo'].value! === '2'
                        || this.formBesoin.controls['idTypeBesoinLabo'].value! === EnumTypeBesoinLabo.CODE_SANTE_PUBLIQUE) {
                        // console.log('CSP');
                        if (this.besoinClient && this.besoinClient.objectifs) {
                            for (const obj of this.besoinClient.objectifs) {
                                if (obj.idType === EnumTypeBesoinLabo.CODE_SANTE_PUBLIQUE) {
                                    this.formObjectifCSP.controls[obj.code].setValue(true);
                                }
                            }
                        }
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        });
    }

    private updateDocumentsFournis() {
        this.documentsPresents = [false, false, false, false, false, false, false, false, false, false];
        this.fichierService.getAll('chantier', this.id).subscribe(fichiers => {
            this.fichiers = fichiers;
            fichiers.forEach(fichier => {
                switch (fichier.idTypeFichier) {
                    case EnumTypeFichier.CHANTIER_PDRE_SS3:
                        this.documentsPresents[0] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_LISTE_PROCESS:
                        this.documentsPresents[1] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_MODE_OP:
                        this.documentsPresents[2] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_PIC:
                        this.documentsPresents[3] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_PLANNING_INFO:
                        this.documentsPresents[4] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_REPERAGE_AMIANTE:
                        this.documentsPresents[5] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_PHOTOS:
                        this.documentsPresents[6] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_PLANS:
                        this.documentsPresents[7] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_PDRE_CSP:
                        this.documentsPresents[8] = true;
                        break;
                    case EnumTypeFichier.CHANTIER_PLAN_PERIMETRE:
                        this.documentsPresents[9] = true;
                        break;
                }
            });
        });
    }

    checkSS3() {
        if (!this.besoinClient) {
            this.besoinClient = new BesoinClientLabo();
        }
        if (!this.besoinClient.id || !this.besoinClient.objectifs || this.besoinClient.objectifs.length === 0) {
            Object.keys(this.formObjectifCT.controls).forEach(key => {
                if (this.listeObjectifsPendantTravaux.find(o => o.code == key && o.isObligatoireCOFRAC)) {
                    this.formObjectifCT.get(key)!.setValue(true);
                }
            });
        }
    }

    onSubmit(isSuivant: boolean = false) {
        this.submitted = true;

        // Si valide
        if (this.chantier.client && this.chantier.chargeClient && this.chantier.redacteurStrategie
            && this.chantier.valideurStrategie && this.chantier.nomChantier.length > 0) {
            const listeObjectifs: Array<Objectif> = new Array<Objectif>();
            if (this.formBesoin.controls['idTypeBesoinLabo'].value! === 1
                || this.formBesoin.controls['idTypeBesoinLabo'].value! === '1'
                || this.formBesoin.controls['idTypeBesoinLabo'].value! === EnumTypeBesoinLabo.CODE_TRAVAIL) {
                // console.log('CT');
                Object.keys(this.formObjectifCT.controls).forEach(key => {
                    // console.log(key);
                    if (this.formObjectifCT.get(key)!.value == true) {
                        // console.log('oui');
                        listeObjectifs.push(this.listeObjectifsPendantTravaux.find(o => o.code === key)!);
                    }
                });
            } else if (this.formBesoin.controls['idTypeBesoinLabo'].value! === 2
                || this.formBesoin.controls['idTypeBesoinLabo'].value! === '2'
                || this.formBesoin.controls['idTypeBesoinLabo'].value! === EnumTypeBesoinLabo.CODE_SANTE_PUBLIQUE) {
                // console.log('CSP');
                Object.keys(this.formObjectifCSP.controls).forEach(key => {
                    // console.log(key);
                    if (this.formObjectifCSP.get(key)!.value == true) {
                        // console.log('oui');
                        listeObjectifs.push(this.listeObjectifsHorsTravaux.find(o => o.code === key)!);
                    }
                });
            }

            // On patch les valeurs
            this.besoinClient = { ...this.besoinClient, ...this.formBesoin.value };

            this.besoinClient.objectifs = listeObjectifs;
            if (!this.chantier.besoinClient) {
                this.chantier.besoinClient = this.besoinClient;
            } else {
                this.chantier.besoinClient.objectifs = listeObjectifs;
            }

            // Si le bsoin  existe déjà, update
            if (this.besoinClient && this.besoinClient.id) {
                this.besoinClientService.updateBesoinClientLabo(this.besoinClient).subscribe(() => {
                    if (isSuivant) {
                        this.router.navigate(['chantier/', this.chantier.id, 'sites', 'liste']);
                    }
                    this.notificationService.setNotification('success', ['Besoin client mis à jour.']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.besoinClientService.createBesoinClientLabo(this.besoinClient).subscribe((besoin) => {
                    delete this.chantier.besoinClient;
                    // this.besoinClient.id = besoin.id;
                    this.besoinClient = besoin;

                    this.chantier.idBesoinClient = besoin.id;
                    // this.besoinClientService.updateBesoinClientLabo(this.besoinClient).subscribe((aa) => {
                    this.chantierService.partialUpdate(this.chantier).subscribe((bb) => {
                        if (isSuivant) {
                            this.router.navigate(['chantier/', this.chantier.id, 'sites', 'liste']);
                        }

                        this.notificationService.setNotification('success', ['Besoin client mis à jour.']);
                    });
                    // });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }

        } else {
            const erreur: string[] = [];
            this.notificationService.setNotification('danger', erreur);
        }
    }

    openModalSiteIntervention() {
        this.modalSiteIntervention = true;
    }

    closeModalSiteIntervention() {
        this.modalSiteIntervention = false;
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }
}
