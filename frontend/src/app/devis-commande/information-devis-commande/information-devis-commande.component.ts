import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevisCommande } from '../DevisCommande';
import { DevisCommandeService } from '../devis-commande.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MenuService } from '../../menu/menu.service';
import { EnumTypeContactDevisCommande, EnumTypeDevis, CodePostal, Formation } from '@aleaac/shared';
import { GrilleTarif } from '../../resource/grille-tarif/GrilleTarif';
import { NotificationService } from '../../notification/notification.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Franchise } from '../../resource/franchise/franchise';
import { fadeIn, fadeOut } from '../../resource/animation';
import { Adresse } from '../../parametrage/bureau/Adresse';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';
import { ContactDevisCommande } from '../ContactDevisCommande';
import { ChantierService } from '../../chantier/chantier.service';
import { Chantier } from '../../chantier/Chantier';
import { FormationService } from '../../formation/formation.service';
import { fadeInItems } from '@angular/material';

@Component({
    selector: 'app-information-devis-commande',
    templateUrl: './information-devis-commande.component.html',
    styleUrls: ['./information-devis-commande.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class InformationDevisCommandeComponent implements OnInit, AfterViewChecked {
    modalClient: boolean = false;
    keys: any[];
    enumTypeDevis = EnumTypeDevis;
    submited: boolean = false;
    franchise: Franchise;
    id: number;
    devisCommande: DevisCommande;
    intituleClient: string;
    grilleTarifs: GrilleTarif[] | null;
    isModified: boolean = false;
    displayAdresse: boolean = false;
    displayChoixChantier: boolean = false;
    displayModalChantier: boolean = false;
    displayModalFormation: boolean = false;
    isDevis: boolean = true;
    chantier: Chantier;
    enumTypeContactDevisCommande = EnumTypeContactDevisCommande;

    adresseForm: FormGroup;
    chantierForm: FormGroup;
    adresseInit: boolean = false;

    isSessionFormationExist: boolean = false;
    sessionFormation: Formation;
    voirSessionFormation: boolean = false;

    activeButton:boolean = false;

    constructor(
        private route: ActivatedRoute,
        private devisCommandeService: DevisCommandeService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private formBuilder: FormBuilder,
        private statutCommandeService: StatutCommandeService,
        private chantierService: ChantierService,
        private cdRef: ChangeDetectorRef,
        private formationService: FormationService
    ) { }

    ngAfterViewChecked() {
        if (this.devisCommande && this.devisCommande.adresse && !this.adresseInit) {
            this.adresseForm.patchValue(this.devisCommande.adresse);
            const codePostal = new CodePostal();
            codePostal.numCP = this.devisCommande.adresse.cp;
            codePostal.nomCommune = this.devisCommande.adresse.ville;
            this.setCP(codePostal);
            this.adresseInit = true;
            this.cdRef.detectChanges();
        }
    }

    ngOnInit() {
        this.adresseForm = this.formBuilder.group({
            adresse: ['',],
            complement: [''],
            cp: ['', [Validators.minLength(5), Validators.maxLength(5)]],
            ville: ['',],
            fax: ['', [Validators.pattern('(0)[1-9]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[1-9][0-9]{8}|\\+[0-9]{2,15}')]],
            telephone: ['', [Validators.pattern('(0)[1-9]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[1-9][0-9]{8}|\\+[0-9]{2,15}')]],
            email: ['', [Validators.email]]
        });
        this.chantierForm = this.formBuilder.group({
            relier: ['',],
            idChantier: ['',],
            txtChantier: ['',],
        });

        this.keys = Object.keys(this.enumTypeDevis).filter(Number);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.route.params.subscribe((params) => {
            this.id = params.id;
            if (this.id) {
                this.devisCommandeService.get(this.id).subscribe((devisCommande) => {
                    this.devisCommande = devisCommande;

                    if (devisCommande.idChantier) {
                        this.chantierService.getSimple(devisCommande.idChantier).subscribe(chantier => {
                            this.chantier = chantier;
                        });
                    }

                    this.statutCommandeService.statutIsBeforeCommande(this.devisCommande.idStatutCommande).then(isDevis => {
                        this.isDevis = isDevis;
                        if (isDevis) {
                            this.menuService.setMenu([
                                ['Devis & Commande', '/devis-commande'],
                                ['Devis #' + params.id, ''],
                            ]);
                        } else {
                            this.menuService.setMenu([
                                ['Devis & Commande', '/devis-commande'],
                                ['Commande #' + params.id, ''],
                            ]);
                        }
                    });
                    this.displayAdresse = this.devisCommande.typeDevis == EnumTypeDevis.LIBRE;

                    const client = devisCommande.contactDevisCommandes.find((client2) => {
                        return client2.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT;
                    });

                    if (client) {
                        this.parseIntituleClient(client.contact);
                        this.findTarifs(client.contact);
                    }

                    //Créer une session formation ou attacher une session ou voir la session d'un devis en type FORMATION
                    if(this.devisCommande.typeDevis == EnumTypeDevis.FORMATION){
                        console.log(devisCommande);
                        if(devisCommande.idFormation!){
                            this.formationService.getById(devisCommande.idFormation!).subscribe((forma)=>{
                                this.sessionFormation = forma;
                                this.isSessionFormationExist = this.sessionFormation?true:false;
                            },err=>{
                                this.notificationService.setNotification('danger',['Une erreur est survenue']);
                                console.log(err);
                            });
                        }
                        this.activeButton = true;
                    }else{
                        this.activeButton = false;
                    }

                    //Créer une session formation ou attacher une session ou voir la session d'un devis en type FORMATION
                });
            } else {
                this.devisCommande = new DevisCommande();
                this.devisCommande.contactDevisCommandes = [];
                this.devisCommande.idFranchise = this.franchise.id;
                this.devisCommande.totalTVA = this.franchise.pourcentTVADefaut;
                this.devisCommande.adresse = new Adresse();
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

    }

    parseIntituleClient(client) {
        if (client.nom) {
            if (client.compteContacts) {
                this.intituleClient = client.compteContacts.compte.raisonSociale;
            } else {
                this.intituleClient = client.nom + ' ' + client.prenom + ' ( particulier ) ';
            }
        } else {
            this.intituleClient = client.raisonSociale;
        }
    }

    findTarifs(client) {
        if (client.nom) {
            if (client.compteContacts && client.compteContacts.compte.grilleTarifs) {
                this.grilleTarifs = client.compteContacts.compte.grilleTarifs;
            } else {
                this.grilleTarifs = null;
            }
        } else {
            this.grilleTarifs = client.grilleTarifs;
        }
    }

    getClientAttache(client) {
        this.isModified = true;
        this.devisCommande.idBureau = client.idBureau;
        const contactDevisCommande = new ContactDevisCommande();
        contactDevisCommande.idTypeContactDevisCommande = this.enumTypeContactDevisCommande.CLIENT;
        if (client.nom) {
            contactDevisCommande.idContact = client.id;
        } else {
            const clientDevis = client.compteContacts.find((compteContact) => {
                return compteContact.bDevis;
            });
            if (clientDevis) {
                contactDevisCommande.idContact = clientDevis.contact.id;
            } else {
                const clientPrincipale = client.compteContacts.find((compteContact) => {
                    return compteContact.bPrincipale;
                });
                contactDevisCommande.idContact = clientPrincipale.contact.id;
            }
        }
        const findedClient = this.devisCommande.contactDevisCommandes.find((contactDevisCommande2) => {
            return contactDevisCommande2.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT;
        });
        if (findedClient) {
            findedClient.idContact = contactDevisCommande.idContact;
        } else {
            this.devisCommande.contactDevisCommandes.push(contactDevisCommande);
        }
        console.log(this.devisCommande);
    }

    onSubmit() {
        console.log(this.devisCommande);
        this.submited = true;
        if (this.devisCommande.typeDevis && Number(this.devisCommande.typeDevis) === this.enumTypeDevis.LIBRE.valueOf()
            && this.devisCommande.contactDevisCommandes.length >= 1) {
            this.devisCommande.typeDevis = Number(this.devisCommande.typeDevis);
            if (this.devisCommande.isModifie) {
                if (this.devisCommande.id) {
                    delete this.devisCommande.idAdresse;
                    this.devisCommande.adresse = { ...this.devisCommande.adresse, ...this.adresseForm.value };
                    this.devisCommandeService.update(this.devisCommande).subscribe((devisCommande) => {
                        this.router.navigate(['devis-commande', this.devisCommande.id, 'detail']);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    this.devisCommande.adresse = { ...this.devisCommande.adresse, ...this.adresseForm.value };
                    this.devisCommandeService.create(this.devisCommande).subscribe((devisCommande) => {
                        this.router.navigate(['devis-commande', devisCommande.id, 'detail']);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                }
            } else {
                this.router.navigate(['devis-commande', this.devisCommande.id, 'detail']);
            }

        } else if (this.devisCommande.typeDevis && Number(this.devisCommande.typeDevis) === this.enumTypeDevis.LABO.valueOf()
            && this.devisCommande.contactDevisCommandes.length >= 1) {
            if (this.devisCommande.id) {
                this.devisCommandeService.update(this.devisCommande).subscribe((devisCommande) => {

                    this.router.navigate(['devis-commande', this.devisCommande.id, 'detail']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                const idTruc = this.devisCommande.contactDevisCommandes[0].idContact;
                // this.devisCommande.contactDevisCommandes =[];
                this.devisCommandeService.create(this.devisCommande).subscribe((devisCommande) => {
                    if (this.devisCommande.idChantier) {
                        this.devisCommandeService.update(devisCommande).subscribe(() => {
                            this.router.navigate(['chantier', this.devisCommande.idChantier, 'devis', 'liste']);
                        });
                    } else {
                        const chantier: Chantier = new Chantier();
                        chantier.bureau = devisCommande.bureau;
                        chantier.idClient = idTruc;
                        chantier.listeDevisCommande = new Array<DevisCommande>();
                        chantier.listeDevisCommande.push(devisCommande);
                        chantier.idFranchise = this.franchise.id;
                        chantier.versionStrategie = 0;
                        chantier.isCOFRAC = true;


                        this.chantierService.create(chantier).subscribe(data => {
                            devisCommande.idChantier = data.id;

                            this.devisCommandeService.update(devisCommande).subscribe(() => {
                                this.router.navigate(['chantier', data.id, 'informations']);
                            });
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }

                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        } else if (this.devisCommande.typeDevis && Number(this.devisCommande.typeDevis) === this.enumTypeDevis.FORMATION.valueOf() // Ajout un devis en type formation -> Nguyen changé
            && this.devisCommande.contactDevisCommandes.length >= 1) { //Je copie la partie type LIBRE de Yohann
                this.devisCommande.typeDevis = Number(this.devisCommande.typeDevis);
                if (this.devisCommande.isModifie) {
                    if (this.devisCommande.id) {
                        this.devisCommandeService.update(this.devisCommande).subscribe((devisCommande) => {
                            this.router.navigate(['devis-commande', this.devisCommande.id, 'detail']);
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    } else {
                        this.devisCommandeService.create(this.devisCommande).subscribe((devisCommande) => {
                            this.router.navigate(['devis-commande', devisCommande.id, 'detail']);
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }
                } else {
                    this.router.navigate(['devis-commande', this.devisCommande.id, 'detail']);
                }
                
            // Ajout un devis en type formation -> Nguyen changé
        } else {
            const erreur: string[] = [];
            if (!this.devisCommande.typeDevis) {
                erreur.push('Il faut saisir un type pour votre devis.');
            }
            if (this.devisCommande.typeDevis && Number(this.devisCommande.typeDevis) !== this.enumTypeDevis.LIBRE.valueOf()
                && Number(this.devisCommande.typeDevis) !== this.enumTypeDevis.LABO.valueOf()) {
                console.log(Number(this.enumTypeDevis.LIBRE.valueOf()));
                erreur.push('Seuls les devis libres sont oppérationnels.');
            }
            if (this.devisCommande.contactDevisCommandes.length < 1) {
                erreur.push('Il faut saisir un client pour votre devis.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }

    figeDevis() {
        if (!this.devisCommande.isModifie) {
            this.devisCommandeService.figer(this.devisCommande.id).subscribe((devisCommande) => {
                this.devisCommande.versionFigee = devisCommande.versionFigee;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    openModalClient() {
        this.modalClient = true;
    }
    closeModalClient() {
        this.modalClient = false;
    }

    openModalChantier() {
        this.displayModalChantier = true;
    }
    closeModalChantier() {
        this.displayModalChantier = false;
    }

    openModalFormation(){
        this.displayModalFormation = true;
    }

    emitSessionFormation(e){
        this.displayModalFormation = false;
        console.log(e);
        this.sessionFormation = e;
        this.devisCommande.idFormation = this.sessionFormation.id;
        this.devisCommandeService.update(this.devisCommande).subscribe(()=>{
        },err=>{
            this.notificationService.setNotification('danger',['Une erreur est survenue']);
            console.log(err);
        });
        this.voirSessionFormation = true;
    }

    setClient(client) {
        this.devisCommande.isModifie = true;
        this.parseIntituleClient(client);
        this.findTarifs(client);
        this.getClientAttache(client);
        this.modalClient = false;
    }

    goToGoogleAdresse(adresseForm) {
        let googleUrl = 'https://www.google.com/maps/place/';
        if (this.adresseForm.get('adresse') && this.adresseForm.get('cp') && this.adresseForm.get('ville')) {
            googleUrl += adresseForm.get('adresse').value.replace(/\s+/g, '+');
            googleUrl += '+';
            googleUrl += adresseForm.get('cp').value.replace(/\s+/g, '+');
            googleUrl += '+';
            googleUrl += adresseForm.get('ville').value.replace(/\s+/g, '+');

            window.open(googleUrl, '_blank');
        }
    }

    goToChantier() {
        this.router.navigate(['chantier', this.devisCommande.idChantier, 'informations']);
    }

    changeType() {
        this.isModified = true;
        // Init tout à false
        this.displayAdresse = false;
        this.displayChoixChantier = false;

        if (this.devisCommande.typeDevis == EnumTypeDevis.LIBRE) {
            this.displayAdresse = true;
        } else if (this.devisCommande.typeDevis == EnumTypeDevis.LABO) {
            this.displayChoixChantier = true;
        } 

        if(this.id){
            if(this.devisCommande.typeDevis == EnumTypeDevis.FORMATION){
                this.activeButton = true;
            }else{
                this.activeButton = false;
            }
        }


    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseForm.controls['cp'].setValue(cpVille.numCP);
            this.adresseForm.controls['ville'].setValue(cpVille.nomCommune);
        }
    }

    setChantier(chantier: Chantier) {
        this.chantierForm.controls['txtChantier'].setValue('#' + chantier.id + ' - ' + chantier.nomChantier);
        this.chantierForm.controls['idChantier'].setValue(chantier.id);
        this.devisCommande.idChantier = chantier.id;
        this.setClient(chantier.client);
        this.closeModalChantier();
    }
}
