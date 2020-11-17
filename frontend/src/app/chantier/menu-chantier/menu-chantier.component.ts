import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chantier } from '../Chantier';
import { Strategie } from '../../resource/strategie/Strategie';
import { EnumSousSectionStrategie, EnumStatutIntervention } from '@aleaac/shared';
import { Observable } from 'rxjs/internal/Observable';
import { Intervention } from '../../intervention/Intervention';
import { Prelevement } from '../../processus/Prelevement';

@Component({
    selector: 'app-menu-chantier',
    templateUrl: './menu-chantier.component.html',
    styleUrls: ['./menu-chantier.component.scss']
})
export class MenuChantierComponent implements OnChanges, OnInit {
    id: number;
    idStrategie: number = 0;
    activeMenu: string = '';
    activeSubMenu: string = '';
    activeSubSubMenu: string = '';
    activeSubSubSubMenu: string = '';
    listeSS3: Array<Strategie> = new Array<Strategie>();
    listeSS4: Array<Strategie> = new Array<Strategie>();
    listeCSP: Array<Strategie> = new Array<Strategie>();
    enumStatutIntervention = EnumStatutIntervention;
    subscription: any;


    @Input() disableOnglets: boolean = false;
    @Input() chantier: Chantier;
    @Input() intervention: Intervention;
    @Input() isNewInter: boolean;
    @Input() prelevement: Prelevement;
    @Input() isNewPrelevement: boolean;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        if (!this.subscription) {
            this.subscription = this.route.params.subscribe((params) => {
                this.id = params.id;

                if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path !== 'intervention' &&
                    (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'modifier' ||
                        this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter')) {
                    this.activeMenu = 'informations';
                } else {
                    this.activeMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'sites') {
                        this.activeMenu = 'sites';
                    }

                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'devis') {
                        this.activeMenu = 'devis';
                    }

                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'besoin') {
                        this.activeMenu = 'besoin';
                    }

                    if (this.route.snapshot.url[1].path === 'intervention') {
                        this.activeMenu = 'intervention';
                        if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter') {
                            this.activeSubSubMenu = 'information';
                        } else {
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                        }
                    }

                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'strategie'        // Liste
                        || (this.route.snapshot.url[this.route.snapshot.url.length - 3]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'strategie')     // Ajout Zone
                        || (this.route.snapshot.url[this.route.snapshot.url.length - 4]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 4].path === 'strategie')     // Edit Zone
                        || (this.route.snapshot.url[this.route.snapshot.url.length - 5]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 5].path === 'strategie')     // Edit Zone sous menu
                    ) {
                        this.activeMenu = 'strategie';
                        if (this.chantier && this.chantier.strategies) {
                            if (this.chantier && this.chantier.besoinClient && this.chantier.besoinClient.ss3) {
                                this.listeSS3 =
                                    [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS3);
                            }
                            if (this.chantier && this.chantier.besoinClient && this.chantier.besoinClient.ss4) {
                                this.listeSS4 =
                                    [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS4);
                            }

                            this.listeCSP = [...this.chantier.strategies].filter(s => s.sousSection == null);
                        }

                        if (this.route.snapshot.url[this.route.snapshot.url.length - 3]
                            && !this.route.snapshot.url[this.route.snapshot.url.length - 4]) {
                            // Stratégie seule
                            if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'strategie') {

                                if (Number.isInteger(Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 1].path))) {
                                    this.activeSubMenu = 'liste';
                                    this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                                } else {
                                    // Liste / Documents / Historique
                                    this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                                }


                                this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 1].path);
                            } else if (this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'strategie') {
                                // Ajout zone
                                this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                                this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
                                this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 2].path);
                            }
                        } else if (this.route.snapshot.url[this.route.snapshot.url.length - 4]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'strategie') {
                            this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
                            this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 2].path);
                        } else if (this.route.snapshot.url[this.route.snapshot.url.length - 4]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 4].path === 'strategie') {
                            this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 3].path;
                            this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 3].path);
                        } else if (this.route.snapshot.url[this.route.snapshot.url.length - 5]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 5].path === 'strategie') {
                            this.activeSubMenu = 'liste';
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 4].path;
                            this.activeSubSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
                            this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 4].path);

                        }
                    }
                    console.log(this.activeMenu);
                }
            }, err => {
                console.error(err);
            });
        }
    }


    ngOnChanges() {
        if (!this.subscription) {
            this.subscription = this.route.params.subscribe((params) => {
                this.id = params.id;

                if ((this.route.snapshot.url[this.route.snapshot.url.length - 2].path !== 'intervention'
                    || this.route.snapshot.url[this.route.snapshot.url.length - 2].path !== 'prelevement') &&
                    (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'modifier' ||
                        this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter')) {
                    this.activeMenu = 'informations';
                } else {
                    this.activeMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'sites') {
                        this.activeMenu = 'sites';
                    }

                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'devis') {
                        this.activeMenu = 'devis';
                    }

                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'besoin') {
                        this.activeMenu = 'besoin';
                    }

                    if (this.route.snapshot.url[1].path === 'intervention') {
                        this.activeMenu = 'intervention';
                        if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter') {
                            this.activeSubSubMenu = 'information';
                        } else {
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                        }
                    }

                    if (this.route.snapshot.url[1].path === 'prelevement') {
                        this.activeMenu = 'prelevement';
                        if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter') {
                            this.activeSubSubMenu = 'information';
                        } else {
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                        }
                    }
                    console.log(this.activeMenu);

                    if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'strategie'        // Liste
                        || (this.route.snapshot.url[this.route.snapshot.url.length - 3]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'strategie')     // Ajout Zone
                        || (this.route.snapshot.url[this.route.snapshot.url.length - 4]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 4].path === 'strategie')     // Edit Zone
                        || (this.route.snapshot.url[this.route.snapshot.url.length - 5]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 5].path === 'strategie')     // Edit Zone sous menu
                    ) {
                        this.activeMenu = 'strategie';
                        if (this.chantier && this.chantier.strategies) {
                            if (this.chantier && this.chantier.besoinClient && this.chantier.besoinClient.ss3) {
                                this.listeSS3 =
                                    [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS3);
                            }
                            if (this.chantier && this.chantier.besoinClient && this.chantier.besoinClient.ss4) {
                                this.listeSS4 =
                                    [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS4);
                            }

                            this.listeCSP = [...this.chantier.strategies].filter(s => s.sousSection == null);
                        }

                        if (this.route.snapshot.url[this.route.snapshot.url.length - 3]
                            && !this.route.snapshot.url[this.route.snapshot.url.length - 4]) {
                            // Stratégie seule
                            if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'strategie') {
                                if (Number.isInteger(Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 1].path))) {
                                    this.activeSubMenu = 'liste';
                                    this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                                } else {
                                    // Liste / Documents / Historique
                                    this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                                }

                                this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 1].path);
                            } else if (this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'strategie') {
                                // Ajout zone
                                this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                                this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
                                this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 2].path);
                            }
                        } else if (this.route.snapshot.url[this.route.snapshot.url.length - 4]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 4].path === 'strategie') {
                            this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 3].path;
                            this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 3].path);
                        } else if (this.route.snapshot.url[this.route.snapshot.url.length - 4]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'strategie') {
                            this.activeSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
                            this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 2].path);
                        } else if (this.route.snapshot.url[this.route.snapshot.url.length - 5]
                            && this.route.snapshot.url[this.route.snapshot.url.length - 5].path === 'strategie') {
                            this.activeSubMenu = 'liste';
                            this.activeSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 4].path;
                            this.activeSubSubSubMenu = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
                            this.idStrategie = Number.parseInt(this.route.snapshot.url[this.route.snapshot.url.length - 4].path);
                        }
                    }
                    console.log(this.activeMenu);
                }
            }, err => {
                console.error(err);
            });
        }
    }
}
