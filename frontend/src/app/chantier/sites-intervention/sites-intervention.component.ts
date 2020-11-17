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
import { SitePrelevement } from '@aleaac/shared';
import { SitePrelevementService } from '../site-prelevement.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';

@Component({
    selector: 'app-site-intervention',
    templateUrl: './sites-intervention.component.html',
    styleUrls: ['./sites-intervention.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class SiteInterventionComponent implements OnInit {
    id: number;
    chantier: Chantier;
    franchise: Franchise;
    submitted: boolean = false;
    listePoints: LatLngDto[] = new Array<LatLngDto>();
    caption: LegendeDto[] = new Array<LegendeDto>();
    listeSites: SitePrelevement[] = new Array<SitePrelevement>();

    constructor(
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private serviceSitePrelevement: SitePrelevementService,
    ) {

        // const legende1: LegendeDto = {
        //     iconPath: 'assets/img/marker-icon-blue.png',
        //     description: 'Site de couleur bleue'
        // };
        // const legende2: LegendeDto = {
        //     iconPath: 'assets/img/marker-icon-green.png',
        //     description: 'Site de couleur verte'
        // };
        // const legende3: LegendeDto = {
        //     iconPath: 'assets/img/marker-icon-orange.png',
        //     description: 'Site de couleur orange'
        // };

        // this.caption.push(legende1);
        // this.caption.push(legende2);
        // this.caption.push(legende3);

        this.route.params.subscribe((params) => {
            this.id = params.id;
            this.menuService.setMenu([
                ['Chantiers', '/chantier'],
                ['Chantier', '/chantier/' + this.id + '/informations'],
                ['Sites d\'interventions', '']
            ]);
            if (this.id) {
                this.chantierService.get(this.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + chantier.nomChantier, '/chantier/' + this.id + '/informations'],
                        ['Sites d\'interventions', '']
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
            this.serviceSitePrelevement.getAll(this.id, new QueryBuild()).subscribe(sites => {
                this.listeSites = sites;
                for (const site of sites) {
                    const point: LatLngDto = {
                        latitude: site.latitude !== null ? site.latitude : site.adresse.latitude,
                        longitude: site.longitude !== null ? site.longitude : site.adresse.longitude,
                        tooltipHTMLContent: '<b>' + site.nom + '</b><br />' + site.adresse.adresse + ' '
                            + site.adresse.cp + ' ' + site.adresse.ville
                    };

                    if (point.latitude !== null && point.longitude !== null) {
                        this.listePoints.push(point);
                    }
                }
            });
        });
    }

    refresh(): void {
        const tmpList = JSON.parse(JSON.stringify(this.listePoints));
        this.listePoints = [];
        setTimeout(() => {
            this.serviceSitePrelevement.getAll(this.id, new QueryBuild()).subscribe(sites => {
                this.listeSites = sites;
                for (const site of sites) {
                    const point: LatLngDto = {
                        latitude: site.latitude !== null ? site.latitude : site.adresse.latitude,
                        longitude: site.longitude !== null ? site.longitude : site.adresse.longitude,
                        tooltipHTMLContent: '<b>' + site.nom + '</b><br />' + site.adresse.adresse + ' '
                            + site.adresse.cp + ' ' + site.adresse.ville
                    };

                    if (point.latitude !== null && point.longitude !== null) {
                        this.listePoints.push(point);
                    }
                }
            });
        }, 10);
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
}
