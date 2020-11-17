import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { DevisCommande } from '../DevisCommande';
import { ActivatedRoute, Router } from '@angular/router';
import { DevisCommandeService } from '../devis-commande.service';
import { DevisCommandeDetail } from '../DevisCommandeDetail';
import { NotificationService } from '../../notification/notification.service';
import { GrilleTarif } from '../../resource/grille-tarif/GrilleTarif';
import { EnumTypeDevis, MailFile, EnumStatutCommande, EnumTypeContactDevisCommande } from '@aleaac/shared';
import { TarifDetail } from '../../resource/tarif-detail/TarifDetail';
import { FichierService } from '../../resource/fichier/fichier.service';
import * as FileSaver from 'file-saver';
import { Mail } from '../../resource/mail/Mail';
import { fadeIn, fadeOut } from '../../resource/animation';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';
import { HistoriqueService } from '../../resource/historique/historique.service';
import { Contact } from '../../contact/Contact';

@Component({
    selector: 'app-detail-devis-commande',
    templateUrl: './detail-devis-commande.component.html',
    styleUrls: ['./detail-devis-commande.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class DetailDevisCommandeComponent implements OnInit {
    devisCommande: DevisCommande;
    modalProduit: number = 0;
    grilleTarifs: GrilleTarif[];
    enumTypeDevis = EnumTypeDevis;
    enumTypeContactDevisCommande = EnumTypeContactDevisCommande;
    enumStatutCommande = EnumStatutCommande;
    isDevis: boolean;
    mail: Mail | null;
    client: Contact;
    isInitFromChantierEnCours: boolean = false;

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private devisCommandeService: DevisCommandeService,
        private router: Router,
        private notificationService: NotificationService,
        private fichierService: FichierService,
        private statutCommandeService: StatutCommandeService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.devisCommandeService.get(params.id).subscribe((devisCommande) => {
                    this.devisCommande = devisCommande;
                    console.log(this.devisCommande);
                    this.statutCommandeService.statutIsBeforeCommande(this.devisCommande.idStatutCommande).then(isDevis => {
                        console.log(isDevis);
                        this.isDevis = isDevis;

                        if (isDevis) {
                            this.menuService.setMenu([
                                ['Devis & Commande', '/devis-commande'],
                                ['Devis #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                                ['Détails', '']
                            ]);
                        } else {
                            this.menuService.setMenu([
                                ['Devis & Commande', '/devis-commande'],
                                ['Commande #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                                ['Détails', '']
                            ]);
                        }

                        const client = devisCommande.contactDevisCommandes.find((client) => {
                            return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT;
                        });
                        console.log(client);
                        if (client) {
                            this.client = client.contact;
                        }
                        if (client && client.contact && client.contact.compteContacts
                            && client.contact.compteContacts.compte.grilleTarifs) {
                            this.grilleTarifs = client.contact.compteContacts.compte.grilleTarifs;
                        }
                        console.log(this.grilleTarifs);
                        this.calculTotal();
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

    changeText() {
        this.devisCommande.isModifie = true;
    }

    ajoutLigne() {
        if (!this.devisCommande.versionFigee) {
            this.changeText();
            const devisCommandeDetail = new DevisCommandeDetail();
            devisCommandeDetail.montantRemise = 0;
            devisCommandeDetail.montantHT = 0;
            devisCommandeDetail.totalHT = 0;
            devisCommandeDetail.quantite = 1;
            devisCommandeDetail.produit = null;
            devisCommandeDetail.idDevisCommande = this.devisCommande.id;
            this.devisCommande.devisCommandeDetails.push(devisCommandeDetail);
        }
    }

    setTarifDetail(tarifDetail: TarifDetail) {
        if (!this.devisCommande.versionFigee) {
            this.changeText();
            const devisCommandeDetail = new DevisCommandeDetail();
            if (tarifDetail.tarifPublique) {
                devisCommandeDetail.montantHT = tarifDetail.tarifPublique.prixUnitaire;
                if (tarifDetail.prixUnitaire !== tarifDetail.tarifPublique.prixUnitaire) {
                    devisCommandeDetail.montantRemise = tarifDetail.prixUnitaire;
                } else {
                    devisCommandeDetail.montantRemise = tarifDetail.tarifPublique.prixUnitaire;
                }
            } else {
                devisCommandeDetail.montantHT = tarifDetail.prixUnitaire;
                devisCommandeDetail.montantRemise = tarifDetail.prixUnitaire;
            }
            devisCommandeDetail.totalHT = tarifDetail.prixUnitaire;
            devisCommandeDetail.quantite = 1;
            devisCommandeDetail.idProduit = tarifDetail.produit.id;
            devisCommandeDetail.idDevisCommande = this.devisCommande.id;
            devisCommandeDetail.description = tarifDetail.produit.nom;
            this.devisCommande.devisCommandeDetails.push(devisCommandeDetail);
            this.modalProduit = 0;
            this.calculTotal();
        }
    }

    deleteDetail(detailDevisCommande) {
        if (!this.devisCommande.versionFigee) {
            this.changeText();
            const index = this.devisCommande.devisCommandeDetails.indexOf(detailDevisCommande);
            this.devisCommande.devisCommandeDetails.splice(index, 1);
            this.calculTotal();
        }
    }

    openModalProduit() {
        if (!this.devisCommande.versionFigee) {
            this.modalProduit = this.devisCommande.typeDevis;
        }
    }

    calculLigne(detailDevisCommande) {
        this.changeText();
        detailDevisCommande.totalHT = Number((detailDevisCommande.montantRemise * detailDevisCommande.quantite).toFixed(2));
        this.calculTotal();
    }

    calculTotal() {
        this.devisCommande.totalHT = 0;
        this.devisCommande.totalRemiseHT = 0;
        for (const detailDevisCommande of this.devisCommande.devisCommandeDetails) {
            this.devisCommande.totalRemiseHT += Number((detailDevisCommande.montantHT - detailDevisCommande.montantRemise) * detailDevisCommande.quantite);
            this.devisCommande.totalHT += Number(detailDevisCommande.totalHT);
        }
        this.devisCommande.totalHT = Number(this.devisCommande.totalHT.toFixed(2));
        this.devisCommande.totalRemiseHT = Number(this.devisCommande.totalRemiseHT.toFixed(2));
        this.devisCommande.totalTVA = Number(((this.devisCommande.totalHT * this.devisCommande.tauxTVA) / 100).toFixed(2));
        this.devisCommande.totalTTC = Number((this.devisCommande.totalHT + this.devisCommande.totalTVA).toFixed(2));
    }

    imprimer() {
        if (this.checkSiDetail()) {
            if (this.devisCommande.isModifie) {
                this.devisCommande.version += 1;
                this.devisCommande.isModifie = false;
                this.devisCommandeService.update(this.devisCommande).subscribe(() => {
                    this.devisCommandeService.imprimer(this.devisCommande.id).subscribe((fichier) => {
                        this.fichierService.get(fichier.keyDL).subscribe((file) => {
                            const filename = fichier.nom + '.' + fichier.extention;
                            FileSaver.saveAs(file, filename);
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
            } else {
                this.devisCommandeService.imprimer(this.devisCommande.id).subscribe((fichier) => {
                    this.fichierService.get(fichier.keyDL).subscribe((file) => {
                        const filename = fichier.nom + '.' + fichier.extention;
                        FileSaver.saveAs(file, filename);
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
    }

    envoyerMail() {
        if (this.checkSiDetail()) {
            if (this.devisCommande.isModifie) {
                this.devisCommande.version += 1;
                this.devisCommande.isModifie = false;
                this.devisCommandeService.update(this.devisCommande).subscribe(() => {
                    this.devisCommandeService.imprimer(this.devisCommande.id).subscribe((fichier) => {
                        this.fichierService.getAll('devis-commande', this.devisCommande.id).subscribe((fichiers) => {
                            const mail = new Mail();
                            mail.subject = 'Envoi du devis ' + this.devisCommande.id + '-V' + this.devisCommande.version;
                            if (this.client && this.client.adresse && this.client.adresse.email) {
                                mail.to = [this.client.adresse.email];
                            } else {
                                mail.to = [''];
                            }
                            mail.from = this.devisCommande.bureau.adresse.email;
                            mail.attachments = [];
                            mail.idParent = this.devisCommande.id;
                            mail.application = 'devis-commande';
                            for (const fichier of fichiers) {
                                const fileToSend = new MailFile();
                                fileToSend.filename = fichier.nom + '.' + fichier.extention;
                                fileToSend.path = './uploads/' + fichier.keyDL;
                                mail.attachments.push(fileToSend);
                            }
                            mail.template = 'blank';
                            this.mail = mail;
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
            } else {
                this.devisCommandeService.imprimer(this.devisCommande.id).subscribe((fichier) => {
                    this.fichierService.getAll('devis-commande', this.devisCommande.id).subscribe((fichiers) => {
                        const mail = new Mail();
                        mail.subject = 'Envoi du devis ' + this.devisCommande.id + '-V' + this.devisCommande.version;
                        if (this.client && this.client.adresse && this.client.adresse.email) {
                            mail.to = [this.client.adresse.email];
                        } else {
                            mail.to = [''];
                        }
                        mail.from = this.devisCommande.bureau.adresse.email;
                        mail.attachments = [];
                        mail.idParent = this.devisCommande.id;
                        mail.application = 'devis-commande';
                        for (const fichier of fichiers) {
                            const fileToSend = new MailFile();
                            fileToSend.filename = fichier.nom + '.' + fichier.extention;
                            fileToSend.path = './uploads/' + fichier.keyDL;
                            mail.attachments.push(fileToSend);
                        }
                        mail.template = 'blank';
                        this.mail = mail;
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
    }

    confirmerCommande() {
        if (this.checkSiDetail()) {
            this.devisCommande.isModifie = true;
            this.devisCommande.idStatutCommande = EnumStatutCommande.COMMANDE_EN_SAISIE;
            this.devisCommande.versionFigee = true;
            this.isDevis = false;
            this.enregistrer();
        }
    }

    checkSiDetail() {
        if (!this.devisCommande.devisCommandeDetails || this.devisCommande.devisCommandeDetails.length < 1) {
            this.notificationService.setNotification('danger', ['Vous devez avoir au moins une ligne de détail dans votre devis.']);
            return false;
        } else {
            return true;
        }
    }

    figeDevis() {
        if (!this.devisCommande.isModifie && this.isDevis) {
            this.devisCommandeService.figer(this.devisCommande.id).subscribe((devisCommande) => {
                this.devisCommande.versionFigee = devisCommande.versionFigee;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    enregistrer() {
        console.log(this.devisCommande);
        // if (!this.devisCommande.versionFigee) {
        if (this.devisCommande.isModifie) {
            this.devisCommandeService.update(this.devisCommande).subscribe(() => {
                this.devisCommande.isModifie = false;
                this.notificationService.setNotification('success', ['Enregistré avec succès.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
        // }
    }

    fermer() {
        this.router.navigate(['devis-commande']);
    }

    setCloseMail() {
        this.mail = null;
    }

    initFromChantier() {
        this.isInitFromChantierEnCours = true;
        this.devisCommandeService.initFromChantier(this.devisCommande).subscribe(data => {
            this.devisCommande.devisCommandeDetails = data.devisCommandeDetails;
            this.calculTotal();
            this.isInitFromChantierEnCours = false;
        }, err => {
            this.isInitFromChantierEnCours = false;
            console.error(err);
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });
    }
}
