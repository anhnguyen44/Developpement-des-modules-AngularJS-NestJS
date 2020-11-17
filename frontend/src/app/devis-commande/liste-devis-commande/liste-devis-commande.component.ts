import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import {
    EnumTypeDevis,
    Franchise,
    StatutCommande,
    EnumStatutCommande,
    EnumTypeContactDevisCommande
} from '@aleaac/shared';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { Recherche } from '../../resource/query-builder/recherche/Recherche';
import { MenuService } from '../../menu/menu.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { DevisCommande } from '../DevisCommande';
import { DevisCommandeService } from '../devis-commande.service';
import { Router } from '@angular/router';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild, QueryBuildable } from '../../resource/query-builder/QueryBuild';
import { Order } from '../../resource/query-builder/order/Order';
import { ModalAbandonCommandeDto } from '@aleaac/shared/src/dto/devis-commande/modal-abandon-commande.dto';
import * as FileSaver from 'file-saver';
import { FormationContactService } from '../../formation/formation-contact.service';
import { FormationService } from '../../formation/formation.service';
import { FichierService } from '../../resource/fichier/fichier.service';


@Component({
    selector: 'app-liste-devis-commande',
    templateUrl: './liste-devis-commande.component.html',
    styleUrls: ['./liste-devis-commande.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ListeDevisCommandeComponent implements OnInit, Recherchable, QueryBuildable {
    franchise: Franchise;
    devisCommandes: DevisCommande[];
    enumTypeDevis = EnumTypeDevis;
    enumTypeContactDevisCommande = EnumTypeContactDevisCommande;
    champDeRecherches: ChampDeRecherche[] = [];
    nbObjets: number;
    listeStatuts: StatutCommande[];
    statutCible: StatutCommande;
    openModalAbandon: boolean = false;
    infosAbandon: ModalAbandonCommandeDto = new ModalAbandonCommandeDto();
    defaultOrder: Order = new Order('Réf', '', true, 'devisCommande.id', 'DESC');
    isActiveButton: boolean = false;

    queryBuild: QueryBuild;
    @Input() isModal: boolean = false;
    @Input() idParent: number;
    @Input() nomCleParent: string;
    @Input() idFormation: number;

    @Output() emitDevisCommande: EventEmitter<DevisCommande> = new EventEmitter<DevisCommande>();
    @Output() emitUnlink: EventEmitter<DevisCommande> = new EventEmitter<DevisCommande>();

    headers: Order[] = [
        new Order('Réf', '', true, 'devisCommande.id'),
        new Order('Client', ''),
        new Order('Statut', '', true, 'statut_commande.nom'),
        new Order('Type', '', true, 'devisCommande.typeDevis'),
        new Order('Mission', '', true, 'devisCommande.mission'),
        new Order('Date création', '', true, 'devisCommande.dateCreation'),
        new Order('Montant HT', '', true, 'devisCommande.totalHT'),
        new Order('Action', 'action'),
    ];

    constructor(
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private devisCommandeService: DevisCommandeService,
        private statutCommandeService: StatutCommandeService,
        private router: Router,
        private notificationService: NotificationService,
        private formationContactService: FormationContactService,
        private formationService: FormationService,
        private fichierService: FichierService
    ) { }

    ngOnInit() {
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.getDevisCommande();
            this.countDevisCommande();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.statutCommandeService.getAllStatutCommande().subscribe((statuts) => {
            this.champDeRecherches = [
                new ChampDeRecherche('Référence', 'text', 'devisCommande.id', true, false),
                new ChampDeRecherche('Statut', 'list', 'devisCommande.idStatutCommande', true, true, statuts.map((statut) => {
                    return { id: statut.id, nom: statut.nom };
                })),
                new ChampDeRecherche('Type', 'enum', 'devisCommande.typeDevis', true, true, this.enumTypeDevis),
                new ChampDeRecherche('Mission', 'text', 'devisCommande.mission', true, true),
            ];
            this.listeStatuts = statuts;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        // Init ici du querybuild pour ne pas faire flasher la liste des commandes complètes avant de les virer en appliquant l'idParent
        this.queryBuild = new QueryBuild();
        if (!this.idParent) {
            this.menuService.setMenu([
                ['Devis / Commande', '']
            ]);
        } else {
            this.queryBuild.idParent = this.idParent;
            this.queryBuild.nomCleParent = this.nomCleParent;
        }
    }

    getDevisCommande() {
        if (this.idFormation) {
            this.devisCommandeService.getAllByIdFormation(this.idFormation, this.franchise.id, this.queryBuild).subscribe((devisCommandes) => {
                this.devisCommandes = devisCommandes;
                this.devisCommandes.map((devisCommande) => {
                    let client = devisCommande.contactDevisCommandes.find((client) => {
                        return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT;
                    });
                    if (client) {
                        devisCommande.contact = client.contact;
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            });
        } else {
            this.devisCommandeService.getAll(this.franchise.id, this.queryBuild).subscribe((devisCommandes) => {
                this.devisCommandes = devisCommandes;
                this.devisCommandes.map((devisCommande) => {
                    let client = devisCommande.contactDevisCommandes.find((client) => {
                        return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT;
                    });
                    if (client) {
                        devisCommande.contact = client.contact;
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            });
        }
    }

    countDevisCommande() {
        this.devisCommandeService.countAll(this.franchise.id, this.queryBuild).subscribe((count) => {
            this.nbObjets = count;
            console.log(this.nbObjets);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    goToDetail(devisCommande: DevisCommande) {
        if (this.isModal) {
            this.emitDevis(devisCommande);
        } else {
            if (this.idParent) {
                this.router.navigate(['devis-commande', devisCommande.id, 'detail']);
            } else {
                this.router.navigate(['devis-commande', devisCommande.id, 'modifier']);
            }
        }
    }

    openModaleAbandon(devisCommandes: DevisCommande[]) {
        this.openModalAbandon = true;
        if (devisCommandes) {
            if (devisCommandes.length === 1) {
                // Détermination auto
                this.statutCommandeService.statutIsBeforeCommande(devisCommandes[0].statut.id).then(res => {
                    this.statutCible = res
                        ? this.listeStatuts.find(s => s.id == EnumStatutCommande.DEVIS_ABANDONNE)!
                        : this.listeStatuts.find(s => s.id == EnumStatutCommande.COMMANDE_ABANDONNE)!;
                });
            } else {
                // WTF ?
            }
        } else {
            // WTF ?
        }

        if (devisCommandes) {
            this.devisCommandes.forEach(dcmain => {
                if (devisCommandes.some(dc => dc.id == dcmain.id)) {
                    dcmain.selected = true;
                }
            });
        }
    }

    setAllChecked(event) {
        if (this.devisCommandes) {
            this.devisCommandes.forEach(dc => dc.selected = event);
        }
        

        let collectionToApply = this.devisCommandes.filter(dc => dc.selected);
        if(this.isActiveButton){      
            if(!collectionToApply.length){
                this.isActiveButton = false;
            }
        }else{
            
            this.isActiveButton = true;
        }
    }

    isAllChecked() {
        if (this.devisCommandes) {
            return this.devisCommandes.every(dc => dc.selected);
        } else {
            return false;
        }
    }

    changeStatusTo() {
        if (!this.statutCible) {
            alert('Veuillez sélectionner un statut cible pour les devis/commandes.');
            return;
        }

        const collectionToApply = this.devisCommandes.filter(dc => dc.selected);

        if (collectionToApply.length > 0) {
            if (this.statutCible.isJustificationNecessaire) {
                // Modale
                this.openModaleAbandon(collectionToApply);
                return;
            } else {
                let i = 0;
                collectionToApply.forEach(dc => {
                    // On fait un objet partiel plus léger pour l'update
                    const localDC = new DevisCommande();
                    localDC.id = dc.id;
                    localDC.idStatutCommande = this.statutCible.id;
                    localDC.statut = this.statutCible;

                    this.devisCommandeService.partialUpdate(localDC).subscribe(data => {
                        i++;
                        if (i === collectionToApply.length) {
                            this.notificationService.setNotification('success', ['Statut de la ou des devis/commande(s) mis à jour.']);
                        }
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });

                    // On met quand même à jour pour la vue
                    dc.statut = this.statutCible;
                    dc.idStatutCommande = this.statutCible.id;
                });
            }
        } else {
            alert('Veuillez sélectionner au moins un devis/une commande avant de changer de statut.');
        }
    }

    setRaisonAbandon(event) {
        this.infosAbandon = event;
        const collectionToApply = this.devisCommandes.filter(dc => dc.selected);

        if (collectionToApply.length > 0) {
            let i = 0;
            collectionToApply.forEach(dc => {
                // On fait un objet partiel plus léger pour l'update
                const localDC = new DevisCommande();
                localDC.id = dc.id;
                localDC.idStatutCommande = this.statutCible.id;
                localDC.statut = this.statutCible;
                localDC.raisonStatutCommande = this.infosAbandon.commentaire;
                localDC.motifAbandonCommande = this.infosAbandon.motif;
                localDC.idMotifAbandonCommande = this.infosAbandon.motif.id;

                if (this.infosAbandon.motif.isSuppression) {
                    this.devisCommandeService.delete(localDC.id).subscribe(data => {
                        i++;
                        if (i === collectionToApply.length) {
                            this.notificationService.setNotification('success', ['Devis/commande(s) supprimé(s).']);
                        }
                        // On ele vire de la liste
                        this.devisCommandes = this.devisCommandes.filter(dd => dd.id != dc.id);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    });
                } else {
                    this.devisCommandeService.partialUpdate(localDC).subscribe(data => {
                        i++;
                        if (i === collectionToApply.length) {
                            this.notificationService.setNotification('success', ['Statut de la ou des devis/commande(s) mis à jour.']);
                        }
                        // On met quand même à jour pour la vue
                        dc.statut = this.statutCible;
                        dc.idStatutCommande = this.statutCible.id;
                        dc.raisonStatutCommande = this.infosAbandon.commentaire;
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    });
                }
            });
        }
        this.openModalAbandon = false;
    }

    setQueryBuild(queryBuild): void {
        console.log(queryBuild);

        this.queryBuild = queryBuild;
        if (this.idParent && this.nomCleParent) {
            this.queryBuild.idParent = this.idParent;
            this.queryBuild.nomCleParent = this.nomCleParent;
        }
        if (this.queryBuild.needCount) {
            this.countDevisCommande();
        }
        this.getDevisCommande();
    }

    satutIsParent(statut: StatutCommande) {
        if (statut) {
            return this.listeStatuts.some(s => s.parent && s.parent.id === statut.id);
        } else {
            return false;
        }
    }

    generateXlsx() {
        this.devisCommandeService.generateXlsx(this.franchise.id).subscribe((xlsx) => {
            FileSaver.saveAs(xlsx, 'export.xlsx');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    emitDevis(devisCommande: DevisCommande) {
        this.emitDevisCommande.emit(devisCommande);
    }

    unlinkDevis(devisCommande: DevisCommande) {
        this.emitUnlink.emit(devisCommande);
    }

    genererConvention(text:string) {
        const listDevis = this.devisCommandes.filter(dc => dc.selected);
        console.log(listDevis);

       
        listDevis.forEach(de => {
            if(!de.contact.compteContacts){
                console.log(de.idFormation!);
                console.log(de.contact.id);
                this.formationContactService.getById(de.idFormation!,de.contact.id).subscribe(sta=>{
                    console.log(sta);
                    this.formationService.generateDocumentCoche(text,[sta],de.idFormation!).subscribe(fichier=>{
                        this.fichierService.get(fichier.keyDL).subscribe((file) => {
                          const filename = fichier.nom + '.' + fichier.extention;
                          FileSaver.saveAs(file, filename);
                      }, err => {
                          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                          console.error(err);
                      });
                      },err=>{
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                      });
                },err=>{
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });

                
            }else{
                this.formationContactService.getAllByIdDevis(de.id).subscribe(listSta => {
                    console.log(listSta);

                    this.formationService.generateDocumentCoche(text,listSta,de.idFormation!).subscribe(fichier=>{
                        this.fichierService.get(fichier.keyDL).subscribe((file) => {
                          const filename = fichier.nom + '.' + fichier.extention;
                          FileSaver.saveAs(file, filename);
                      }, err => {
                          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                          console.error(err);
                      });
                      },err=>{
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                      });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
            
        });
        // console.log(data);
    }

    activeButton(){
        let collectionToApply = this.devisCommandes.filter(dc => dc.selected);
        console.log(collectionToApply);
        console.log('alo');
        if(this.isActiveButton){
            
            // console.log(collectionToApply);
            if(!collectionToApply.length){
                this.isActiveButton = false;
            }

        }else{
            this.isActiveButton = true;
        }
    }
}
