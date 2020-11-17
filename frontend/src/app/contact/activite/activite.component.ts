import { Utilisateur, CodePostal } from '@aleaac/shared';
import { formatDate } from '@angular/common';
import {Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { UserStore } from '../../resource/user/user.store';
import { ValidationService } from '../../resource/validation/validation.service';
import { Activite } from '../Activite';
import { ActiviteService } from '../activite.service';
import { Categorie } from '../Categorie';
import { CategorieService } from '../categorie.service';
import { ContactService } from '../../contact/contact.service';
import { Contact } from '../../contact/Contact';
import { EnumTypeFichierGroupe } from '@aleaac/shared';

@Component({
    selector: 'app-activite',
    templateUrl: './activite.component.html',
    styleUrls: ['./activite.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ActiviteComponent implements OnInit {
    application: string = 'activite';
    idType: number;
    activite: Activite;
    nomPrenomContact: string;
    nomPrenomUtilisateur: string;
    submited: boolean = false;
    categories: Categorie[];
    modalType: string;
    userModalOpened: boolean = false;
    idCompte: number;

    groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.ACTIVITE;
    @ViewChild('activiteTextArea') activeTextArea: ElementRef;

    adresseFrom = this.formBuilder.group({
        adresse: ['', []],
        complement: [''],
        cp: ['', [Validators.maxLength(5), Validators.minLength(5)]],
        ville: ['', []]
    });

    activiteForm = this.formBuilder.group({
        contact: [''],
        adresse: this.adresseFrom,
        categorie: ['', [Validators.required]],
        objet: ['', [Validators.required]],
        contenu: ['', [Validators.required]],
        date: ['', [Validators.required]],
        duree: [''],
        time: ['', [Validators.required]],
        utilisateur: [''],
    });

    champsInformations: Map<string, string> = new Map<string, string>([
        ['objet', 'L\'objet'],
        ['contenu', 'Le contenu'],
        ['date', 'La date'],
        ['time', 'L\'heure'],
        ['duree', 'La durée'],
        ['cp', 'Le code postal'],
        ['ville', 'La ville'],
        ['adresse', 'L\'adresse'],
    ]);

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private route: ActivatedRoute,
        private activiteService: ActiviteService,
        private formBuilder: FormBuilder,
        private userStore: UserStore,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private contactService: ContactService,
        private categorieService: CategorieService,
        private menuService: MenuService
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.categorieService.getAll().subscribe((categories) => {
                this.categories = categories;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
            if (params.id) {
                if (!params.idType) {
                    this.menuService.setMenu([
                        ['Activités', '/contact/activite'],
                        ['Activité #' + params.id, '']
                    ]);
                } else {
                    this.menuService.setMenu([
                        ['Comptes / Contacts', '/contact'],
                        ['Activités du ' + params.type, '/contact/' + params.type + '/' + params.idType + '/activite'],
                        ['Activité #' + params.id, '']
                    ]);
                    this.idType = params.idType;
                }
                this.activiteService.getActivite(params.id).subscribe((activite) => {
                    this.activite = activite;
                    this.activiteForm.patchValue(this.activite);
                    this.adresseFrom.patchValue(this.activite.adresse);
                    this.upText();
                    if (this.activite.contact) {
                        this.nomPrenomContact = this.activite.contact.nom + ' ' + this.activite.contact.prenom;
                    }
                    if (!this.activite.utilisateur) {
                        this.userStore.user.subscribe((user) => {
                            this.activite.utilisateur = user;
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }
                    this.nomPrenomUtilisateur = this.activite.utilisateur.nom + ' ' + this.activite.utilisateur.prenom;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });

                if (params.idType && params.idType > 0) {
                    this.idCompte = params.idType;
                }
            } else {
                if (!params.idType) {
                    this.menuService.setMenu([
                        ['Activités', '/contact/activite'],
                        ['Nouvelle activité', '']
                    ]);
                } else {
                    this.menuService.setMenu([
                        ['Comptes / Contacts', '/contact'],
                        ['Activités du ' + params.type, '/contact/' + params.type + '/' + params.idType + '/activite'],
                        ['Nouvelle activité', '']
                    ]);
                    this.idType = params.idType;
                }
                this.activite = new Activite();
                if (params.idType && params.idType > 0 && params.type === 'contact') {
                    this.contactService.getById(params.idType).subscribe((contact) => {
                        this.activite.contact = contact;
                        this.nomPrenomContact = this.activite.contact.nom + ' ' + this.activite.contact.prenom;
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                }

                this.activiteForm.patchValue(this.activite);
                this.userStore.user.subscribe((user) => {
                    this.activite.utilisateur = user;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
                this.nomPrenomUtilisateur = this.activite.utilisateur.nom + ' ' + this.activite.utilisateur.prenom;
            }
        });
    }

    recuperationAdresseCible() {
        this.activite.adresse = this.activite.contact.adresse;
        this.adresseFrom.patchValue(this.activite.adresse);
    }

    openModalContact() {
        this.modalType = 'liste-contact';
    }

    openModalUtilisateur() {
        this.userModalOpened = true;
    }

    setContact(contact: Contact) {
        this.activite.contact = contact;
        this.nomPrenomContact = this.activite.contact.nom + ' ' + this.activite.contact.prenom;
        this.modalType = '';
    }

    setUser(user: Utilisateur) {
        this.activite.idUtilisateur = user.id;
        this.activite.utilisateur = user;
        this.nomPrenomUtilisateur = user.nom + ' ' + user.prenom;
        this.userModalOpened = false;
    }

    onSubmit({ value, valid }: { value: Activite, valid: boolean }) {
        // console.log(value);
        if (valid) {
            value.idContact = this.activite.contact.id;
            value.idUtilisateur = this.activite.utilisateur.id;
            value.idCategorie = value.categorie.id;
            value.date = formatDate(value.date, 'yyyy-MM-dd', this.locale);
            value.time = formatDate('2019-01-01 ' + value.time, 'HH:mm', this.locale);
            if (this.activite.id) {
                value.id = this.activite.id;
                value.adresse.id = this.activite.adresse.id;
                this.activiteService.updateActivite(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Acivité mis à jour correctement.']);
                    this.router.navigate(['/contact', 'contact', value.idContact, 'activite']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.franchiseService.franchise.subscribe((franchise) => {
                    value.idFranchise = franchise.id;
                    this.activiteService.createActivite(value).subscribe(() => {
                        this.notificationService.setNotification('success', ['Activité créée correctement.']);
                        this.router.navigate(['/contact', 'contact', value.idContact, 'activite']);
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }

        } else {
            this.submited = true;
            const erreurs = this.validationService.getFormValidationErrors(this.activiteForm, this.champsInformations)
                .concat(this.validationService.getFormValidationErrors(this.adresseFrom, this.champsInformations));
            if (!this.activite.utilisateur) {
                erreurs.push('Vous devez saisir une personne affectée.');
            }
            if (!this.activite.contact) {
                erreurs.push('Vous devez saisir une cible.');
            }
            this.notificationService.setNotification('danger', erreurs);
        }
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    upTextArea() {
        this.upText();
        window.scrollTo(0, document.body.scrollHeight);
    }

    upText() {
        this.activeTextArea.nativeElement.style.height = '0px';
        this.activeTextArea.nativeElement.style.height = (this.activeTextArea.nativeElement.scrollHeight + 25) + 'px';
    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseFrom.controls['cp'].setValue(cpVille.numCP);
            this.adresseFrom.controls['ville'].setValue(cpVille.nomCommune);
        }
    }
}
