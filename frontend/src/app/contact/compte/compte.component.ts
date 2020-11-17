import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../Contact';
import { MenuService } from '../../menu/menu.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { QualiteService } from '../../resource/qualite/qualite.service';
import { Qualite } from '../../resource/qualite/Qualite';
import { BureauService } from '../../parametrage/bureau/bureau.service';
import { Bureau } from '../../parametrage/bureau/Bureau';
import { ActivatedRoute, Router } from '@angular/router';
import { CompteService } from '../compte.service';
import { Compte } from '../Compte';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../notification/notification.service';
import { ValidationService } from '../../resource/validation/validation.service';
import { CompteContact } from '../CompteContact';
import { HistoriqueService } from '../../resource/historique/historique.service';
import { fadeIn, fadeOut } from '../../resource/animation';

import { TypeGrilleService } from '../../resource/grille-tarif/type-grille.service';
import { GrilleTarif } from '../../resource/grille-tarif/GrilleTarif';
import { GrilleTarifService } from '../../resource/grille-tarif/grille-tarif.service';
import { TypeGrille, CodePostal } from '@aleaac/shared';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { TypeFacturation } from '@aleaac/shared/src/models/type-facturation.model';
import { TypeFacturationService } from '../../resource/user/type-facturation.service';


@Component({
    selector: 'app-compte',
    templateUrl: './compte.component.html',
    styleUrls: ['./compte.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class CompteComponent implements OnInit {
    @Input() modal: boolean = false;
    qualites: Qualite[];
    franchise;
    bureaux: Bureau[];
    bureau: Bureau;
    compte: Compte;
    modalType: string | null = null;
    submited: boolean = false;
    typeGrilles: TypeGrille[];
    typeGrillesFiltre: TypeGrille[];
    typeGrille: TypeGrille;
    grilleTarifs: GrilleTarif[];
    grilleTarif: GrilleTarif;
    grilleTarifsType: GrilleTarif[];
    listeTypeFacturation: TypeFacturation[];

    adresseForm = this.formBuilder.group({
        adresse: ['', [Validators.required]],
        complement: [''],
        cp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
        ville: ['', [Validators.required]],
        fax: ['', [Validators.pattern('(0)[1-9]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[1-9][0-9]{8}|\\+[0-9]{2,15}')]],
        telephone: ['', [Validators.required, Validators.pattern('(0)[1-9]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[1-9][0-9]{8}|\\+[0-9]{2,15}')]],
        email: ['', [Validators.required, Validators.email]]
    });
    compteForm = this.formBuilder.group({
        qualite: [''],
        siret: [''],
        bureau: ['', [Validators.required]],
        adresse: this.adresseForm,
        bAccreditationCofrac: [''],
        bEntreprise: [''],
        bLaboratoire: [''],
        dateValiditeCofrac: [''],
        numClientCompta: [''],
        raisonSociale: ['', [Validators.required]],
        commentaire: [''],
        typeFacturation: [],
        nbJoursFacturation: []
    });

    champsInformations: Map<string, string> = new Map<string, string>([
        ['nom', 'Le nom du bureau'],
        ['telephone', 'Le téléphone'],
        ['email', 'l\'adresse email'],
        ['ville', 'la ville'],
        ['telephone', 'le téléphone'],
        ['bureau', 'le bureau'],
        ['raisonSociale', 'la raison sociale']
    ]);

    constructor(
        private compteService: CompteService,
        private menuService: MenuService,
        private qualiteService: QualiteService,
        private franchiseService: FranchiseService,
        private bureauxService: BureauService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private router: Router,
        private validationService: ValidationService,
        private historiqueService: HistoriqueService,
        private typeGrilleService: TypeGrilleService,
        private grilleTarifService: GrilleTarifService,
        private typeFacturationService: TypeFacturationService
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Comptes / Contacts', '/contact'],
            ['Informations du compte', '']
        ]);
        this.typeFacturationService.getAll().subscribe(data => {
            this.listeTypeFacturation = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.qualiteService.getAllQualite().subscribe((qualites) => {
            this.qualites = qualites;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauxService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.bureaux = bureaux;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
            this.grilleTarifService.getAll(this.franchise.id, new QueryBuild(100, 1))
                .subscribe((grilleTarifs) => {
                    this.grilleTarifs = grilleTarifs;
                    this.typeGrilleService.getAll().subscribe((typeGrilles) => {
                        this.typeGrilles = typeGrilles;
                        this.route.params.subscribe((data) => {
                            if (data['idType']) {
                                this.compteService.getById(data['idType']).subscribe((compte) => {
                                    this.compte = compte;
                                    this.compteForm.patchValue(this.compte);
                                    this.filtreTypeGrilles();
                                    this.filtreGrilleTarifs();
                                }, err => {
                                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                                    console.error(err);
                                });
                            } else {
                                this.compte = new Compte();
                                this.compte.compteContacts = [];
                                this.compte.grilleTarifs = [];
                                this.compteForm.patchValue(this.compte);
                                this.filtreTypeGrilles();
                                this.filtreGrilleTarifs();
                            }
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    onSubmit({ value, valid }: { value: Compte, valid: boolean }) {
        const havePrincipale = this.compte.compteContacts.find((compteContact) => {
            return compteContact.bPrincipale;
        });
        if (valid && havePrincipale) {
            value.compteContacts = this.compte.compteContacts;
            value.grilleTarifs = this.compte.grilleTarifs;
            if (this.compte.id) {
                value.id = this.compte.id;
                value.idFranchise = this.compte.idFranchise;
                if (this.compte.adresse && this.compte.adresse.id) {
                    value.adresse.id = this.compte.adresse.id;
                }
                this.compteService.update(value).subscribe((data) => {
                    this.notificationService.setNotification('success', ['Compte mis à jour correctement.']);
                    this.router.navigate(['/contact']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.franchiseService.franchise.subscribe((franchise) => {
                    value.idFranchise = franchise.id;
                    this.compteService.create(value).subscribe((data) => {
                        this.notificationService.setNotification('success', ['Compte créé correctement.']);
                        this.historiqueService.setHistorique(data.id, 'compte', 'Création du compte.');
                        this.router.navigate(['/contact']);
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        } else {
            this.submited = true;
            const erreurs = this.validationService.getFormValidationErrors(this.compteForm, this.champsInformations)
                .concat(this.validationService.getFormValidationErrors(this.adresseForm, this.champsInformations));
            if (!havePrincipale) {
                erreurs.push('Vous devez saisir un contact principal.');
            }
            this.notificationService.setNotification('danger', erreurs);
        }
    }

    openModalInterlocuteur() {
        this.modalType = 'liste-contact';
    }

    setContact(contact: Contact) {
        const compteContact = new CompteContact();
        compteContact.contact = contact;
        compteContact.idContact = contact.id;
        this.compte.compteContacts.push(compteContact);
        this.modalType = '';
    }

    changeCompteContact(event, compteContact) {
        if (event.currentTarget.checked) {
            this.compte.compteContacts.forEach((oldCompteContact) => {
                oldCompteContact['b' + event.currentTarget.id] = false;
            });
            compteContact['b' + event.currentTarget.id] = true;
        }
    }

    closeModal() {
        this.modalType = '';
    }

    changeBLaboratoire(event) {
        //Todo patchvalue
    }

    changeBAccreditationCofrac(event) {
        //Todo patchvalue
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    filtreTypeGrilles() {
        this.typeGrillesFiltre = this.typeGrilles
            .filter(typeGrille => !this.compte.grilleTarifs.find(grilleTarif => grilleTarif.idTypeGrille === typeGrille.id));
        this.typeGrille = this.typeGrillesFiltre[0];
    }

    filtreGrilleTarifs() {
        console.log(this.grilleTarifs);
        this.grilleTarifsType = this.grilleTarifs.filter((grilleTarif) => {
            return grilleTarif.idTypeGrille === this.typeGrille.id && !grilleTarif.isGrillePublique;
        });
        this.grilleTarif = this.grilleTarifsType[0];
    }

    ajoutGrilleTarif() {
        this.grilleTarif.typeGrille = this.typeGrille;
        this.compte.grilleTarifs.push(this.grilleTarif);
        this.filtreTypeGrilles();
        this.filtreGrilleTarifs();
    }

    unlinkGrilleTarif(grilleTarif) {
        this.compte.grilleTarifs.splice(this.compte.grilleTarifs.indexOf(grilleTarif), 1);
        this.filtreTypeGrilles();
        this.filtreGrilleTarifs();
    }

    unlinkCompteContact(compteContact: CompteContact) {
        this.compte.compteContacts.splice(this.compte.compteContacts.indexOf(compteContact), 1);
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

    goToContact(idContact) {
        window.scrollTo(0, 0);
        this.router.navigate(['/contact/contact', idContact, 'modifier']);
    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseForm.controls['cp'].setValue(cpVille.numCP);
            this.adresseForm.controls['ville'].setValue(cpVille.nomCommune);
        }
    }
}
