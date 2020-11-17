import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';

import { FormBuilder, Validators } from '@angular/forms';
import { DevisCommande } from '../../devis-commande/DevisCommande';
import { FormationContactService } from '../formation-contact.service';
import { FormationContact, EnumTypeContactDevisCommande } from '@aleaac/shared';
import { DevisCommandeService } from '../../devis-commande/devis-commande.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { BureauService } from '../../parametrage/bureau/bureau.service';
import { DevisCommandeDetail } from '../../devis-commande/DevisCommandeDetail';
import { ContactDevisCommande } from '../../devis-commande/ContactDevisCommande';
import { Fichier } from '../../resource/fichier/Fichier';



@Component({
    selector: 'app-devis-formation',
    templateUrl: './devisFormation.component.html',
    styleUrls: ['./devisFormation.component.scss']
})
export class DevisFormationComponent implements OnInit {
    countDevis: number = 0;
    idFormation: number;
    listStagiaire: FormationContact[];
    stagiaireParEntreprise: any;
    listeEntrerise: any;
    idFranchise: number;
    clickCreerDevis: boolean = false;
    listDe: any[];


    constructor(
        private route: ActivatedRoute,
        private formationContactService: FormationContactService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private devisCommandeService: DevisCommandeService,
        private franchiseService: FranchiseService,
        private bureauService: BureauService,
        private router: Router,
    ) {
        this.route.params.subscribe((params) => {
            this.idFormation = params.id;
        });
    }


    queryBuild: QueryBuild = new QueryBuild();

    ngOnInit() {
        this.franchiseService.franchise.subscribe(franchise => {
            this.idFranchise = franchise.id;
            this.getListDevis(this.idFormation, this.idFranchise, new QueryBuild());
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
        });
    }

    getListDevis(idFormation: number, idFranchise: number, queryBuild: QueryBuild) {
        this.devisCommandeService.getAllByIdFormation(idFormation, idFranchise, queryBuild).subscribe(listDe => {
            console.log(listDe);
            this.listDe = listDe;
            // this.listeDevis = listDe;
            // if(listDe.length){
            this.countDevis = listDe.length;
            // window.location.reload();
            // }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
        });
    }

    onSubmit() {

    }

    testCreerDevis(e) {
        this.clickCreerDevis = true;
        console.log('coucou');
        console.log(this.idFormation);
        this.formationContactService.getAllByIdFormation(this.queryBuild, this.idFormation).subscribe(listSta => {
            this.listStagiaire = listSta;
            this.stagiaireParEntreprise = {
                "particulier": []
            }
            this.listeEntrerise = ['particulier'];

            this.listStagiaire.forEach(s => {
                console.log(s.contact.nom);
                console.log(s.sousTraitance);
                console.log('---------------------------');

                if (!s.sousTraitance) {
                    this.stagiaireParEntreprise.particulier.push(s);
                } else {
                    if (!this.stagiaireParEntreprise[s.sousTraitance.id]) {
                        this.stagiaireParEntreprise[s.sousTraitance.id] = [];
                        this.listeEntrerise.push(s.sousTraitance.id);
                        this.stagiaireParEntreprise[s.sousTraitance.id].push(s);
                    } else {
                        this.stagiaireParEntreprise[s.sousTraitance.id].push(s);
                    }
                }
            });

            console.log(this.stagiaireParEntreprise);


            this.bureauService.getAllPricipal(this.idFranchise).subscribe(listAgence => {
                console.log(this.stagiaireParEntreprise['particulier']);
                console.log(this.listeEntrerise);
                // await this.save()
                for (let entreprise of this.listeEntrerise) {
                    if (entreprise == 'particulier') {
                        for (let stagiaire of this.stagiaireParEntreprise[entreprise]) {
                            console.log(stagiaire);
                            let devis: DevisCommande = new DevisCommande();
                            devis.idFranchise = this.idFranchise;
                            devis.typeDevis = 2;
                            devis.idBureau = listAgence[0].id;
                            devis.idStatutCommande = 1;
                            devis.tauxTVA = 20.0;
                            devis.dateCreation = new Date();
                            devis.idFormation! = this.idFormation;

                            devis.totalHT = stagiaire.formation.typeFormation.product?stagiaire.formation.typeFormation.product.prixUnitaire:0;
                            devis.totalTVA = devis.totalHT * 0.2;
                            devis.totalTTC = devis.totalHT * 1.2;

                            const tmpClient = new ContactDevisCommande();
                            tmpClient.idContact = stagiaire.contact.id;
                            tmpClient.idTypeContactDevisCommande = EnumTypeContactDevisCommande.CLIENT;
                            devis.contactDevisCommandes = [tmpClient];

                            devis.mission = 'Formation: '+stagiaire.formation.typeFormation.nomFormation;


                            console.log(devis);
                            // this.save(devis);
                            // () => {
                            //     console.log(devis);
                            //     this.save(devis);
                            // }


                            this.devisCommandeService.create(devis).subscribe(devisCre => {
                                this.notificationService.setNotification('success', ['created']);
                                const devisCommandeDetail = new DevisCommandeDetail();
                                devisCommandeDetail.montantHT = stagiaire.formation.typeFormation.product?stagiaire.formation.typeFormation.product.prixUnitaire:0;
                                devisCommandeDetail.montantRemise = stagiaire.formation.typeFormation.product?stagiaire.formation.typeFormation.product.prixUnitaire:0;
                                devisCommandeDetail.totalHT = stagiaire.formation.typeFormation.product?stagiaire.formation.typeFormation.product.prixUnitaire:0;
                                devisCommandeDetail.quantite = 1;
                                devisCommandeDetail.idDevisCommande = devisCre.id;
                                devisCommandeDetail.description = stagiaire.formation.typeFormation.product?stagiaire.formation.typeFormation.product.nom:'';
                                devisCommandeDetail.idProduit = stagiaire.formation.typeFormation.product?stagiaire.formation.typeFormation.product.id:null;
                                if (!devisCre.devisCommandeDetails) {
                                    devisCre.devisCommandeDetails = [];
                                    devisCre.devisCommandeDetails.push(devisCommandeDetail);
                                } else {
                                    devisCre.devisCommandeDetails.push(devisCommandeDetail);
                                }

                                console.log(devisCre);
                                this.devisCommandeService.update(devisCre).subscribe(() => {
                                    this.countDevis += 1;
                                }, err => {
                                    this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                                    console.log(err);
                                });

                                let sta: FormationContact = new FormationContact();
                                sta.idDevis = devisCre.id;
                                sta.id = stagiaire.id;
                                
                                this.formationContactService.update(sta).subscribe((upForma) => {
                                }, err => {
                                    this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                                    console.log(err);
                                });
                            }, err => {
                                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                                console.log(err);
                            });



                        }
                    } else {
                        console.log(this.stagiaireParEntreprise[entreprise][0]);

                        
                        let devis: DevisCommande = new DevisCommande();
                        let firstElement = this.stagiaireParEntreprise[entreprise][0];

                        devis.idFranchise = this.idFranchise;
                        devis.typeDevis = 2;
                        devis.idBureau = listAgence[0].id;
                        devis.idStatutCommande = 1;
                        devis.tauxTVA = 20.0;
                        devis.dateCreation = new Date();
                        devis.idFormation! = this.idFormation;

                        devis.totalHT = firstElement.formation.typeFormation.product?firstElement.formation.typeFormation.product.prixUnitaire:0 * this.stagiaireParEntreprise[entreprise].length;
                        devis.totalTVA = devis.totalHT * 0.2;
                        devis.totalTTC = devis.totalHT * 1.2;

                        devis.mission = 'Formation: '+firstElement.formation.typeFormation.nomFormation;

                        const tmpClient = new ContactDevisCommande();
                        for (let c of firstElement.sousTraitance.compteContacts) {
                            if (c.bDevis) {
                                tmpClient.idContact = c.idContact;
                                break;
                            } else {
                                if (c.bPrincipale) {
                                    tmpClient.idContact = c.idContact
                                }
                            }
                        }
                        tmpClient.idTypeContactDevisCommande = EnumTypeContactDevisCommande.CLIENT;
                        devis.contactDevisCommandes = [tmpClient];

                        this.devisCommandeService.create(devis).subscribe(devisCre => {
                            this.notificationService.setNotification('success', ['created']);
                            const devisCommandeDetail = new DevisCommandeDetail();
                            devisCommandeDetail.montantHT = firstElement.formation.typeFormation.product?firstElement.formation.typeFormation.product.prixUnitaire:0;
                            devisCommandeDetail.montantRemise = firstElement.formation.typeFormation.product?firstElement.formation.typeFormation.product.prixUnitaire:0;
                            devisCommandeDetail.totalHT = devisCommandeDetail.montantHT * this.stagiaireParEntreprise[entreprise].length;
                            devisCommandeDetail.quantite = this.stagiaireParEntreprise[entreprise].length;
                            devisCommandeDetail.idDevisCommande = devisCre.id;
                            devisCommandeDetail.description = firstElement.formation.typeFormation.product?firstElement.formation.typeFormation.product.nom:'';
                            devisCommandeDetail.idProduit = firstElement.formation.typeFormation.product?firstElement.formation.typeFormation.product.id:null;
                            if (!devisCre.devisCommandeDetails) {
                                devisCre.devisCommandeDetails = [];
                                devisCre.devisCommandeDetails.push(devisCommandeDetail);
                            } else {
                                devisCre.devisCommandeDetails.push(devisCommandeDetail);
                            }

                            console.log(devisCre);
                            this.devisCommandeService.update(devisCre).subscribe(() => {
                                this.countDevis += 1;
                            }, err => {
                                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                                console.log(err);
                            });

                            this.stagiaireParEntreprise[entreprise].forEach(stagi=>{
                                let st = new FormationContact();
                                st.idDevis = devisCre.id;
                                st.id = stagi.id
                             
                                this.formationContactService.update(st).subscribe((upForma) => {
                                }, err => {
                                    this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                                    console.log(err);
                                });
                            });
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                            console.log(err);
                        });
                    }
                }
                this.listeEntrerise.forEach(en => {
                    console.log(this.stagiaireParEntreprise[en]);
                    // this.devisCommandeService.create(devis).
                });

            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                console.log(err);
            });


        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
        });


    }

    // save(devisCommande: DevisCommande): Promise<DevisCommande> {
    //     return new Promise((resolve, reject) => {
    //         if (!devisCommande.id) {
    //             this.devisCommandeService.create(devisCommande).subscribe((devis) => {
    //                 resolve(devis);
    //             });
    //         } else {
    //             this.devisCommandeService.update(devisCommande).subscribe((devis) => {
    //                 resolve(devis);
    //             });
    //         }
    //     });
    // }
}