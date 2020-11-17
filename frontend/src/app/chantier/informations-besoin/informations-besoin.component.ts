import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import * as FileSaver from 'file-saver';
import { NotificationService } from '../../notification/notification.service';
import { HistoriqueService } from '../../resource/historique/historique.service';
import { InfosBesoinClientLabo } from '@aleaac/shared';
import { InformationsBesoinService } from './informations-besoin.service';

@Component({
    selector: 'app-informations-besoin',
    templateUrl: './informations-besoin.component.html',
    styleUrls: ['./informations-besoin.component.scss']
})
export class InformationsBesoinComponent implements OnInit {
    @Input() idParent: number;
    @Output() emitInformationsBesoin: EventEmitter<InfosBesoinClientLabo> = new EventEmitter<InfosBesoinClientLabo>();
    modalAjouter: boolean = false;
    informationsBesoins: InfosBesoinClientLabo[];
    currentInfosBesoinClientLabo: InfosBesoinClientLabo;

    constructor(
        private informationsBesoinService: InformationsBesoinService,
        private notificationService: NotificationService,
        private historiqueService: HistoriqueService
    ) { }

    ngOnInit() {
        this.informationsBesoinService.getAll(this.idParent).subscribe((infos) => {
            console.log(infos)
            this.informationsBesoins = infos;
        });
    }

    openModal() {
        this.currentInfosBesoinClientLabo = new InfosBesoinClientLabo();
        this.currentInfosBesoinClientLabo.idBesoinClientLabo = this.idParent;
        this.modalAjouter = true;
    }

    setInformationsBesoin(infosBesoinClientLabo) {
        this.currentInfosBesoinClientLabo = infosBesoinClientLabo;
        const toUpdate = this.informationsBesoins.find(sp => sp.id == infosBesoinClientLabo.id);
        if (toUpdate) {
            const index = this.informationsBesoins.indexOf(toUpdate);
            this.informationsBesoins[index] = infosBesoinClientLabo;
        } else {
            this.informationsBesoins.push(infosBesoinClientLabo);
        }

        this.emitInformationsBesoin.emit(infosBesoinClientLabo);
        this.modalAjouter = false;
    }

    getInformationsBesoin(infosBesoinClientLabo) {
        this.currentInfosBesoinClientLabo = infosBesoinClientLabo;
        this.modalAjouter = true;
    }

    deleteInformationsBesoin(infosBesoinClientLabo) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette information ?')) {
            this.informationsBesoinService.delete(infosBesoinClientLabo).subscribe(() => {
                this.notificationService.setNotification('success', ['Information supprimée correctement.']);
                this.historiqueService.setHistorique(this.idParent, 'infos-besoin-client', 'Suppression infosBesoinClientLabo : '
                    + JSON.stringify(infosBesoinClientLabo));
                this.informationsBesoins = this.informationsBesoins.filter((ibc) => {
                    return ibc.id !== infosBesoinClientLabo.id;
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }
}
