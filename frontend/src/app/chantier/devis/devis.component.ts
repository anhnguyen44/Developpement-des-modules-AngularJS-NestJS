import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { Franchise } from '../../resource/franchise/franchise';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { UserService } from '../../resource/user/user.service';
import { Chantier } from '../Chantier';
import { ChantierService } from '../chantier.service';
import { LatLngDto } from '@aleaac/shared/src/dto/chantier/latlng.dto';
import { LegendeDto } from '@aleaac/shared/src/dto/chantier/legende.dto';
import { SitePrelevement, EnumStatutCommande, EnumTypeContactDevisCommande } from '@aleaac/shared';
import { SitePrelevementService } from '../site-prelevement.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { DevisCommande } from '../../devis-commande/DevisCommande';
import { DevisCommandeService } from '../../devis-commande/devis-commande.service';
import { Adresse } from '../../parametrage/bureau/Adresse';
import { ContactDevisCommande } from '../../devis-commande/ContactDevisCommande';
import { EnumTypeDevis } from '@aleaac/shared/src/models/devis-commande.model';
import { HistoriqueService } from '../../resource/historique/historique.service';
import { Historique } from '../../resource/historique/Historique';

@Component({
    selector: 'app-devis-chantier',
    templateUrl: './devis.component.html',
    styleUrls: ['./devis.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class DevisChantierComponent implements OnInit {
    id: number;
    chantier: Chantier;
    franchise: Franchise;
    submitted: boolean = false;
    listePoints: LatLngDto[] = new Array<LatLngDto>();
    caption: LegendeDto[] = new Array<LegendeDto>();
    listeSites: SitePrelevement[] = new Array<SitePrelevement>();
    openModalDevis: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private historiqueService: HistoriqueService,
        private devisCommandeService: DevisCommandeService,
    ) {
        this.route.params.subscribe((params) => {
            this.id = params.id;
            this.menuService.setMenu([
                ['Chantiers', '/chantier'],
                ['Chantier', '/chantier/' + this.id + '/informations'],
                ['Devis & Commandes', '']
            ]);
            if (this.id) {
                this.chantierService.get(this.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.id + '/informations'],
                        ['Devis & Commandes', '']
                    ]);

                    this.franchiseService.franchise.subscribe((franchise) => {
                        this.franchise = franchise;
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

    refresh(): void {
        window.location.reload();
    }

    ngOnInit() {
    }

    onSubmit() {
        this.submitted = true;
        if (this.chantier.client && this.chantier.chargeClient && this.chantier.redacteurStrategie
            && this.chantier.valideurStrategie && this.chantier.nomChantier.length > 0) {
            if (this.chantier.id) {
                this.chantierService.update(this.chantier).subscribe((chantier) => {
                    this.router.navigate(['chantier/', this.chantier.id, 'informations']);
                    this.notificationService.setNotification('success', ['Informations mises à jour.']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.chantierService.create(this.chantier).subscribe((chantier) => {
                    this.router.navigate(['chantier/', chantier.id, 'informations']);
                    this.notificationService.setNotification('success', ['Chantier créé.']);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }

        } else {
            const erreur: string[] = [];
            if (!this.chantier.nomChantier) {
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

    setDevis(devisCommande: DevisCommande) {
        devisCommande.idChantier = this.chantier.id;
        const devCmd = new DevisCommande();
        devCmd.id = devisCommande.id;
        devCmd.idChantier = this.chantier.id;
        devCmd.idBureau = this.chantier.client.idBureau;
        this.devisCommandeService.partialUpdate(devCmd).subscribe(() => {
            this.notificationService.setNotification('success', ['Devis/Commande relié(e).']);
            this.openModalDevis = false;

            const histo = new Historique(0, new Date(), 'chantier', this.chantier.id,
                'Devis #' + devisCommande.id + ' lié avec le chantier.');

            this.historiqueService.createHistorique(histo).subscribe();
            this.refreshCmdLiees();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    unlinkDevis(devisCommande: DevisCommande) {
        devisCommande.idChantier = this.chantier.id;
        const toto = new DevisCommande();
        toto.id = devisCommande.id;
        toto.idChantier = null;
        this.devisCommandeService.partialUpdate(toto).subscribe(() => {
            this.notificationService.setNotification('success', ['Devis/Commande délié(e).']);
            this.openModalDevis = false;

            const histo = new Historique(0, new Date(), 'chantier', this.chantier.id,
                'Devis #' + devisCommande.id + ' délié du chantier.');

            this.historiqueService.createHistorique(histo).subscribe();
            this.refreshCmdLiees();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    refreshCmdLiees() {
        const idSave = this.chantier.id;
        delete this.chantier.id;
        setTimeout(() => {
            this.chantier.id = idSave;
        }, 100);
    }

    createDevis() {
        const tmp = new DevisCommande();
        tmp.idFranchise = this.chantier.idFranchise;
        tmp.adresse = new Adresse();
        tmp.idStatutCommande = EnumStatutCommande.LABO_STRAT_A_REALISER;
        tmp.typeDevis = EnumTypeDevis.LABO;
        tmp.idBureau = this.chantier.idBureau;
        tmp.mission = this.chantier.nomChantier;
        tmp.idChantier = this.chantier.id;
        const tmpClient = new ContactDevisCommande();
        tmpClient.idContact = this.chantier.client.id;
        tmpClient.idTypeContactDevisCommande = EnumTypeContactDevisCommande.CLIENT;
        tmp.contactDevisCommandes = [tmpClient];

        this.devisCommandeService.create(tmp).subscribe(cmd => {
            this.notificationService.setNotification('success', ['Devis créé.']);
            if (!this.chantier.listeDevisCommande) {
                this.chantier.listeDevisCommande = new Array<DevisCommande>();
            }

            this.chantier.listeDevisCommande.push(cmd);
            this.chantierService.partialUpdate(this.chantier).subscribe(() => {
                this.router.navigate(['devis-commande/', cmd.id, 'modifier']);
                const histo = new Historique(0, new Date(), 'chantier', this.chantier.id,
                    'Devis #' + cmd.id + ' créé pour le chantier.');

                this.historiqueService.createHistorique(histo).subscribe();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
