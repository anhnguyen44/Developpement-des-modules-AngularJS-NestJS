import { ContactChantier, EnumStatutCommande, EnumTypeContactChantiers, EnumTypeDevis, profils, Utilisateur } from '@aleaac/shared';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { Franchise } from '../../resource/franchise/franchise';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { GrilleTarif } from '../../resource/grille-tarif/GrilleTarif';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { UserService } from '../../resource/user/user.service';
import { Chantier } from '../Chantier';
import { ChantierService } from '../chantier.service';

@Component({
    selector: 'app-information-chantier',
    templateUrl: './information-chantier.component.html',
    styleUrls: ['./information-chantier.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class InformationChantierComponent implements OnInit {
    modalClient: boolean = false;
    modalMaitreOuvrage: boolean = false;
    keys: any[];
    enumTypeDevis = EnumTypeDevis;
    submitted: boolean = false;
    franchise: Franchise;
    id: number;
    chantier: Chantier;
    intituleClient: string;
    intituleMaitreOuvrage: string;
    grilleTarifs: GrilleTarif[] | null;
    isModified: boolean = false;
    queryBuildContact: QueryBuild = new QueryBuild();

    listeChargeClientele: Utilisateur[];
    listeRedacStrat: Utilisateur[];
    listeValidStrat: Utilisateur[];

    disableOngletsMenu: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.keys = Object.keys(this.enumTypeDevis).filter(Number);
        this.menuService.setMenu([
            ['Chantiers', '/chantier'],
            ['Chantier', ''],
            ['Informations', '']
        ]);
        this.route.params.subscribe((params) => {
            this.id = params.id;
            if (this.id) {
                this.chantierService.get(this.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    if (!(this.chantier.client && this.chantier.chargeClient && this.chantier.redacteurStrategie
                        && this.chantier.valideurStrategie && this.chantier.nomChantier.length > 0)) {
                        this.submitted = true;
                        this.disableOngletsMenu = true;
                    }
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + this.chantier.nomChantier, ''],
                        ['Informations', '']
                    ]);
                    this.parseIntituleClient(chantier.client);
                    if (chantier.contacts) {
                        const moa = chantier.contacts.find(c => c.idTypeContact == EnumTypeContactChantiers.MAITRE_OUVRAGE);
                        if (moa && moa.contact) {
                            this.parseIntituleMOA(moa!.contact);
                        }
                    }
                    this.findTarifs(chantier.client);

                    this.franchiseService.franchise.subscribe((franchise) => {
                        this.franchise = franchise;
                        this.listeChargeClientele = [];
                        this.listeRedacStrat = [];
                        this.listeValidStrat = [];

                        this.userService.getByProfilAndFranchise(profils.TECHNICO_COMMERCIAL, franchise.id).subscribe(data => {
                            this.listeChargeClientele = data;
                        });
                        this.userService.getByDroitAndFranchise('STRAT_REDACTION', franchise.id).subscribe(data2 => {
                            this.listeRedacStrat = data2;
                        });
                        this.userService.getByDroitAndFranchise('STRAT_VALIDATE', franchise.id).subscribe(data3 => {
                            this.listeValidStrat = data3;
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.chantier = new Chantier();
                this.chantier.idStatut = EnumStatutCommande.LABO_STRAT_A_REALISER;
                this.chantier.versionStrategie = 0;
                this.chantier.isCOFRAC = true;

                this.franchiseService.franchise.subscribe((franchise) => {
                    this.franchise = franchise;
                    this.chantier.idFranchise = franchise.id;
                    this.listeChargeClientele = [];
                    this.listeRedacStrat = [];
                    this.listeValidStrat = [];

                    this.userService.getByProfilAndFranchise(profils.TECHNICO_COMMERCIAL, franchise.id).subscribe(data => {
                        this.listeChargeClientele = data;

                        if (!this.chantier.chargeClient && this.listeChargeClientele && this.listeChargeClientele.length > 0) {
                            this.chantier.chargeClient = this.listeChargeClientele[0];
                        }
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                    this.userService.getByDroitAndFranchise('STRAT_REDACTION', franchise.id).subscribe(data2 => {
                        this.listeRedacStrat = data2;

                        if (!this.chantier.redacteurStrategie && this.listeRedacStrat && this.listeRedacStrat.length > 0) {
                            this.chantier.redacteurStrategie = this.listeRedacStrat[0];
                        }
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                    this.userService.getByDroitAndFranchise('STRAT_VALIDATE', franchise.id).subscribe(data3 => {
                        this.listeValidStrat = data3;

                        if (!this.chantier.valideurStrategie && this.listeValidStrat && this.listeValidStrat.length > 0) {
                            this.chantier.valideurStrategie = this.listeValidStrat[0];
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

    parseIntituleMOA(client) {
        if (client.nom) {
            if (client.compteContacts) {
                this.intituleMaitreOuvrage = (client.civilite && client.civilite.nom ? client.civilite.nom + ' ' : '')
                    + client.nom + ' ' + client.prenom + ' (' + client.compteContacts.compte.raisonSociale + ')';
            } else {
                this.intituleMaitreOuvrage = client.nom + ' ' + client.prenom + ' ( particulier ) ';
            }
        } else {
            this.intituleMaitreOuvrage = client.raisonSociale;
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

    getClientAttache(client) { // Compte ou Contact
        this.isModified = true;
        if (client.nom) {
            // C'est un contact
            this.chantier.client = client;
        } else {
            // C'est un compte
            const clientDemandeur = client.compteContacts.find((compteContact) => {
                return compteContact.bDemandeur;
            });
            if (clientDemandeur && clientDemandeur.length) {
                this.chantier.client = clientDemandeur[0].contact;
            } else {
                const clientPrincipal = client.compteContacts.find((compteContact) => {
                    return compteContact.bPrincipale;
                });
                if (clientPrincipal) {
                    this.chantier.client = clientPrincipal.contact;
                } else {
                    this.notificationService.setNotification('danger', ['Impossible de sélectionner le client.']);
                }
            }
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.chantier.client && this.chantier.chargeClient && this.chantier.redacteurStrategie
            && this.chantier.valideurStrategie && this.chantier.nomChantier.length > 0) {
            this.chantier.idBureau = this.chantier.client.idBureau;
            if (this.isModified) {
                if (this.chantier.id) {
                    this.chantierService.update(this.chantier).subscribe((chantier) => {
                        this.router.navigate(['chantier/', this.chantier.id, 'besoin']);
                        this.notificationService.setNotification('success', ['Informations mises à jour.']);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    this.chantierService.create(this.chantier).subscribe((chantier) => {
                        this.router.navigate(['chantier/', chantier.id, 'besoin']);
                        this.notificationService.setNotification('success', ['Chantier créé.']);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                }
            } else {
                this.router.navigate(['chantier/', this.chantier.id, 'besoin']);
                // this.notificationService.setNotification('secondary', ['Aucune modification.']);
            }

        } else {
            const erreur: string[] = [];
            if (!this.chantier.nomChantier || this.chantier.nomChantier.length === 0) {
                erreur.push('Il faut saisir un nom pour votre chantier.');
            }
            if (!this.chantier.client) {
                erreur.push('Il faut saisir un client pour votre chantier.');
            }
            if (!this.chantier.chargeClient) {
                erreur.push('Il faut saisir un chargé de clientèle pour votre chantier.');
            }
            if (!this.chantier.redacteurStrategie) {
                erreur.push('Il faut saisir un rédacteur de stratégie pour votre chantier.');
            }
            if (!this.chantier.valideurStrategie) {
                erreur.push('Il faut saisir un valideur de stratégie pour votre chantier.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    openModalClient() {
        this.modalClient = true;
    }
    closeModalClient() {
        this.modalClient = false;
    }
    openModalMaitreOuvrage() {
        this.modalMaitreOuvrage = true;
    }
    closeModalMaitreOuvrage() {
        this.modalMaitreOuvrage = false;
    }

    setClient(client) {
        console.log(client);
        this.parseIntituleClient(client);
        this.findTarifs(client);
        this.getClientAttache(client);
        this.isModified = true;
        this.modalClient = false;
    }

    setMaitreOuvrage(client) {
        console.log(client);
        this.intituleMaitreOuvrage = (client.civilite ? client.civilite.nom + ' ' : '') + client.nom + ' ' + client.prenom;
        const moa: ContactChantier = new ContactChantier();
        moa.idChantier = this.chantier.id;
        moa.idContact = client.id;
        moa.idTypeContact = EnumTypeContactChantiers.MAITRE_OUVRAGE;
        if (!this.chantier.contacts) {
            this.chantier.contacts = new Array<ContactChantier>();
        } else {
            this.chantier.contacts = this.chantier.contacts.filter(c => c.idTypeContact != EnumTypeContactChantiers.MAITRE_OUVRAGE);
        }
        this.chantier.contacts.push(moa);
        this.modalMaitreOuvrage = false;
        this.isModified = true;
    }
}
