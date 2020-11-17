import { Component, Input, OnInit } from '@angular/core';
import { BatimentService } from './batiment.service';
import * as FileSaver from 'file-saver';
import { NotificationService } from '../../notification/notification.service';
import { HistoriqueService } from '../historique/historique.service';
import { Batiment, TypeBatiment, EnumTypeFichier } from '@aleaac/shared';
import { TypeFichier } from '../../superadmin/typefichier/type-fichier/TypeFichier';
import { TypeFichierService } from '../../superadmin/typefichier/type-fichier.service';

@Component({
    selector: 'app-batiment',
    templateUrl: './batiment.component.html',
    styleUrls: ['./batiment.component.scss']
})
export class BatimentComponent implements OnInit {
    @Input() idParent: number;
    @Input() TypeFichier: TypeFichier;
    modalAjouter: boolean = false;
    batiments: Batiment[] = new Array<Batiment>();
    currentBatiment: Batiment;

    constructor(
        private batimentService: BatimentService,
        private notificationService: NotificationService,
        private historiqueService: HistoriqueService,
        private typeFichierService: TypeFichierService,
    ) { }

    ngOnInit() {
        this.batimentService.getBySitePrelevement(this.idParent).subscribe((batiments) => {
            this.batiments = batiments;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        if (!this.TypeFichier) {
            this.typeFichierService.getAll().subscribe(data => {
                this.TypeFichier = data.find(c => c.id == EnumTypeFichier.CHANTIER_PLAN_BATIMENT)!;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    openModal() {
        this.currentBatiment = new Batiment();
        this.currentBatiment.idSitePrelevement = this.idParent;
        this.modalAjouter = true;
    }

    setBatiment(batiment) {
        this.currentBatiment = batiment;
        const toUpdate = this.batiments.find(sp => sp.id == batiment.id);
        if (toUpdate) {
            const index = this.batiments.indexOf(toUpdate);
            this.batiments[index] = batiment;
        } else {
            this.batiments.unshift(batiment);
        }
        // cthis.modalAjouter = false;
    }

    getBatiment(batiment) {
        this.currentBatiment = batiment;
        this.modalAjouter = true;
    }

    deleteBatiment(batiment) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ? (les plans associés seront perdus)')) {
            this.batimentService.removeBatiment(batiment.id).subscribe(() => {
                this.notificationService.setNotification('success', ['batiment ' + batiment.nom + ' supprimé correctement.']);
                this.historiqueService.setHistorique(this.idParent, 'batiment', 'Suppression batiment : ' + batiment.nom);
                this.batiments = this.batiments.filter((file) => {
                    return file.id !== batiment.id;
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }
}
