import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContactService } from '../contact.service';

import { Router } from '@angular/router';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Contact } from '../Contact';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import {CiviliteService} from '../../resource/civilite/civilite.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {Order} from '../../resource/query-builder/order/Order';
import * as FileSaver from 'file-saver';
import {profils} from '@aleaac/shared';
import {UserStore} from '../../resource/user/user.store';
import { NotificationService } from '../../notification/notification.service';

@Component({
    selector: 'app-liste-contact',
    templateUrl: './liste-contact.component.html',
    styleUrls: ['./liste-contact.component.scss']
})
export class ListeContactComponent implements OnInit, Recherchable {
    @Input() modal: boolean = false;
    @Input() modalClient: boolean = false;
    @Input() idCompte: number;
    @Input() nonAttache: boolean = false;
    @Output() emitContact = new EventEmitter<Contact>();
    @Output() emitNouveau = new EventEmitter();
    @Input() queryBuild: QueryBuild = new QueryBuild();
    canExport: boolean;
    interlocuteurs: Contact[];
    nbObjets: number;
    franchise;
    champDeRecherches: ChampDeRecherche[] = [];
    headers: Order[] = [
        new Order('Nom', '', true, 'contact.nom'),
        new Order('Prénom', '', true, 'contact.prenom'),
        new Order('Adresse'),
        new Order('CP', '', true, 'adresse.cp'),
        new Order('Ville', '', true, 'adresse.ville'),
        new Order('Téléphone', '', true, 'adresse.telephone'),
        new Order('Portable', '', true, 'contact.portable'),
        new Order('Action', 'action'),
    ];

    constructor(
        private contactService: ContactService,
        private franchiseService: FranchiseService,
        private civiliteService: CiviliteService,
        private router: Router,
        private userStore: UserStore,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.userStore.hasProfil(profils.FRANCHISE).then((data) => {
            this.canExport = data;
        });
        this.civiliteService.getAllCivilite().subscribe((civilites) => {
            this.champDeRecherches = [
                new ChampDeRecherche('Nom', 'text', 'contact.nom', true, true),
                new ChampDeRecherche('Prenom', 'text', 'contact.prenom', true, true),
                new ChampDeRecherche('Adresse', 'text', 'adresse.adresse', true, true),
                new ChampDeRecherche('Civilité', 'list', 'contact.idCivilite', true, true,
                    civilites.map((civilite) => {
                    return {id: civilite.id, nom: civilite.nom};
                })),
                new ChampDeRecherche('Code postal', 'text', 'adresse.cp', true, true),
                new ChampDeRecherche('Ville', 'text', 'adresse.ville', true, true),
                new ChampDeRecherche('Téléphone', 'text', 'adresse.telephone', true, true),
                new ChampDeRecherche('Portable', 'text', 'contact.portable', true, true),
            ];
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.getContact();
            this.countContact();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    getContact() {
        if (this.idCompte) {
            this.contactService.getAllCompte(this.idCompte, this.queryBuild).subscribe((data) => {
                this.interlocuteurs = data;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.contactService.getAll(this.franchise.id, this.nonAttache, this.queryBuild)
                .subscribe((data) => {
                    this.interlocuteurs = data;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
        }
    }

    countContact() {
        if (this.idCompte) {
            this.contactService.countAllCompte(this.idCompte, this.queryBuild).subscribe((data) => {
                this.nbObjets = data;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.contactService.count(this.franchise.id, this.nonAttache, this.queryBuild).subscribe((data) => {
                this.nbObjets = data;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countContact();
        }
        this.getContact();
    }

    setNouveau() {
        this.emitNouveau.emit();
    }

    gotoDetails(contact) {
        if (this.modal || this.modalClient) {
            this.emitContact.emit(contact);
        } else {
            this.router.navigate(['/contact', 'contact', contact.id, 'modifier']);
        }
    }

    generateXlsx() {
        this.contactService.generateXlsx(this.franchise.id).subscribe((xlsx) => {
            FileSaver.saveAs(xlsx, 'export.xlsx');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
