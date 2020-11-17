import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../Contact';
import { FormBuilder, Validators } from '@angular/forms';
import { IQualite, ICivilite, Utilisateur, CodePostal } from '@aleaac/shared';
import { CiviliteService } from '../../resource/civilite/civilite.service';
import { QualiteService } from '../../resource/qualite/qualite.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Bureau } from '../../parametrage/bureau/Bureau';
import { BureauService } from '../../parametrage/bureau/bureau.service';
import { FonctionService } from '../../resource/fonction/fonction.service';
import { Fonction } from '../../resource/fonction/Fonction';
import { ValidationService } from '../../resource/validation/validation.service';
import { NotificationService } from '../../notification/notification.service';
import { Compte } from '../Compte';
import { CompteContact } from '../CompteContact';
import { Recherche } from '../../resource/query-builder/recherche/Recherche';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { formatDate } from '@angular/common';
import { format } from 'date-fns';


@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ContactComponent implements OnInit {
    @Input() modal: boolean = false;
    @Output() emitContact = new EventEmitter<Contact>();
    @Input() nonAttache: boolean;
    @Input() compte: Compte;
    modalType: string | null = null;
    submited: boolean = false;
    userModalOpened: boolean = false;
    intituleUtilisateur: string;
    id: number;
    contact: Contact;
    qualites: IQualite[];
    civilites: ICivilite[];
    franchise;
    bureaux: Bureau[];
    fonctions: Fonction[];
    phases = [
        'Inconnue',
        'Découverte',
        'Conquête',
        'Entretien'
    ];
    objectifs = [
        'Ne rien faire',
        'A découvrir',
        'A conquerir',
        'A développer',
        'A entretenir'
    ];
    potentiels = [
        'Faible',
        'Moyen',
        'Elevé'
    ];
    secteurs: string[];
    adresseForm = this.formBuilder.group({
        adresse: ['', [Validators.required]],
        complement: [''],
        cp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
        ville: ['', [Validators.required]],
        fax: ['', [Validators.pattern('(0)[1-9]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[1-9][0-9]{8}|\\+[0-9]{2,15}')]],
        telephone: ['', [Validators.pattern('(0)[1-9]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[1-9][0-9]{8}|\\+[0-9]{2,15}')]],
        email: ['', [Validators.required, Validators.email]]
    });
    contactForm = this.formBuilder.group({
        fonction: [''],
        civilite: [''],
        nom: ['', [Validators.required]],
        prenom: [''],
        portable: ['', [Validators.pattern('(0)[6-7]\\s([0-9]{2}\\s){3}[0-9]{2}|(0)[6-7][0-9]{8}|\\+[0-9]{2,15}')]],
        anniversaire: [''],
        bureau: ['', [Validators.required]],
        adresse: this.adresseForm,
        bProspect: [''],
        phase: [''],
        objectif: [''],
        potentiel: [''],
        qualification: [''],
        secteur: [''],
        editeur: [''],
        application: [''],
        commentaire: ['']
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['nom', 'Le nom'],
        ['telephone', 'Le téléphone'],
        ['email', 'l\'adresse email'],
        ['ville', 'la ville'],
        ['adresse', 'l\'adresse'],
        ['telephone', 'le téléphone'],
        ['bureau', 'le bureau']
    ]);

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private interlocuteurService: ContactService,
        private civiliteService: CiviliteService,
        private formBuilder: FormBuilder,
        private qualiteService: QualiteService,
        private franchiseService: FranchiseService,
        private bureauxService: BureauService,
        private fonctionService: FonctionService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Comptes / Contacts', '/contact'],
            ['Informations Contact', '']
        ]);
        this.civiliteService.getAllCivilite().subscribe((civilites) => {
            this.civilites = civilites;
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
        this.fonctionService.getAll().subscribe((fonctions) => {
            this.fonctions = fonctions;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.interlocuteurService.getSecteur(this.franchise.id).subscribe((secteurs) => {
                this.secteurs = secteurs;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
            this.bureauxService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.bureaux = bureaux;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.route.params.subscribe((data) => {
            this.id = data['idType'];
            if (this.id && !this.modal) {
                this.interlocuteurService.getById(this.id).subscribe((contact) => {
                    this.contact = contact;
                    if (this.contact.utilisateur) {
                        this.parseIntituleUtilisateur(this.contact.utilisateur);
                    }
                    this.contactForm.patchValue(this.contact);
                    this.contactForm.patchValue({
                        anniversaire: format(this.contact.anniversaire, 'YYYY-MM-DD')
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.contact = new Contact;
                this.contact.compteContacts = new CompteContact();
                this.contact.compteContacts.compte = new Compte();
                this.contactForm.patchValue(this.contact);
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    onSubmit({ value, valid }: { value: Contact, valid: boolean }) {
        if (valid) {
            if (this.contact.compteContacts) {
                value.compteContacts = this.contact.compteContacts;
            }
            if (this.contact.idUtilisateur) {
                value.idUtilisateur = this.contact.idUtilisateur;
            }
            if (this.contact.id) {
                value.id = this.contact.id;
                value.idFranchise = this.contact.idFranchise;
                if (this.contact.adresse && this.contact.adresse.id) {
                    value.adresse.id = this.contact.adresse.id;
                }
                this.interlocuteurService.update(value).subscribe((data) => {
                    this.notificationService.setNotification('success', ['Interlocuteur mis à jour correctement.']);
                    this.router.navigate(['/contact']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.franchiseService.franchise.subscribe((franchise) => {
                    value.idFranchise = franchise.id;
                    // console.log(value);
                    this.interlocuteurService.create(value).subscribe((data) => {
                        this.notificationService.setNotification('success', ['Interlocuteur créé correctement.']);
                        if (!this.modal) {
                            this.router.navigate(['/contact']);
                        } else {
                            this.emitContact.emit(data);
                        }
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        } else {
            this.submited = true;
            const erreurs = this.validationService.getFormValidationErrors(this.contactForm, this.champsInformations)
                .concat(this.validationService.getFormValidationErrors(this.adresseForm, this.champsInformations));
            this.notificationService.setNotification('danger', erreurs);
        }
    }

    openModalCompte() {
        if (this.contact.compteContacts && this.contact.compteContacts.bPrincipale) {
            this.notificationService.setNotification('danger',
                ['Vous ne pouvez pas changer d\'entreprise car ce contact est le contact principal de celle-ci']);
        } else {
            this.modalType = 'liste-compte';
        }
    }

    setCompte(compte: Compte) {
        this.contact.compteContacts = new CompteContact();
        this.contact.compteContacts.compte = compte;
        this.modalType = '';
    }

    setUser(utilisateur: Utilisateur) {
        this.contact.idUtilisateur = utilisateur.id;
        this.parseIntituleUtilisateur(utilisateur);
        this.userModalOpened = false;
    }

    parseIntituleUtilisateur(utilisateur) {
        this.intituleUtilisateur = utilisateur.nom + ' ' + utilisateur.prenom;
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    compareVal(val1, val2) {
        if (val1 && val2) {
            return val1 === val2;
        }
    }

    getInfoCompte() {
        if (this.modal) {
            this.contact.adresse = this.compte.adresse;
            this.contact.bureau = this.compte.bureau;
        } else {
            this.contact.adresse = this.contact.compteContacts.compte.adresse;
            this.contact.idBureau = this.contact.compteContacts.compte.idBureau;
        }
        this.adresseForm.patchValue(this.contact.adresse);
        this.contactForm.patchValue(this.contact);
    }

    setClose() {
        this.modalType = '';
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

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseForm.controls['cp'].setValue(cpVille.numCP);
            this.adresseForm.controls['ville'].setValue(cpVille.nomCommune);
        }
    }
}
